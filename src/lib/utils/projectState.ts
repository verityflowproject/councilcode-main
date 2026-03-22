import redis from '@/lib/db/redis'
import { connectDB } from '@/lib/db/mongoose'
import { ProjectState } from '@/lib/models/ProjectState'
import type {
  ProjectStateDoc,
  ModelRole,
  TaskType,
  ReviewEntry,
  OpenQuestion,
} from '@/types'

const STATE_TTL_SECONDS = 60 * 60 * 24 // 24 hours

// --- Key helpers ---
function stateKey(projectId: string): string {
  return `projectstate:${projectId}`
}

function lockKey(projectId: string): string {
  return `lock:projectstate:${projectId}`
}

// --- Core read/write ---
export async function getProjectState(
  projectId: string
): Promise<ProjectStateDoc | null> {
  try {
    const cached = await redis.get(stateKey(projectId))
    if (cached) {
      return JSON.parse(cached) as ProjectStateDoc
    }

    // Cache miss — load from MongoDB
    await connectDB()
    const doc = await ProjectState.findOne({ projectId }).lean()
    if (!doc) return null

    const state = mongoDocToStateDoc(doc)
    await redis.setex(stateKey(projectId), STATE_TTL_SECONDS, JSON.stringify(state))
    return state
  } catch (err) {
    console.error('[ProjectState] getProjectState error:', err)
    return null
  }
}

export async function setProjectState(
  projectId: string,
  state: ProjectStateDoc
): Promise<boolean> {
  try {
    const updated = { ...state, updatedAt: new Date() }

    // Write to Redis immediately
    await redis.setex(
      stateKey(projectId),
      STATE_TTL_SECONDS,
      JSON.stringify(updated)
    )

    // Sync to MongoDB
    await connectDB()
    await ProjectState.findOneAndUpdate(
      { projectId },
      {
        $set: {
          architecture: updated.architecture,
          conventions: updated.conventions,
          dependencies: updated.dependencies,
          openQuestions: updated.openQuestions,
          reviewLog: updated.reviewLog,
          currentTask: updated.currentTask,
          updatedAt: updated.updatedAt,
        },
        $inc: { version: 1 },
      },
      { upsert: true, new: true }
    )
    return true
  } catch (err) {
    console.error('[ProjectState] setProjectState error:', err)
    return false
  }
}

export async function initProjectState(
  projectId: string
): Promise<ProjectStateDoc> {
  const initial: ProjectStateDoc = {
    projectId,
    architecture: {
      decisions: [],
      fileTree: '',
      dataModels: [],
      apiRoutes: [],
    },
    conventions: {
      naming: '',
      folderStructure: '',
      componentPatterns: [],
    },
    dependencies: {
      packages: [],
      versions: {},
      knownGotchas: [],
    },
    openQuestions: [],
    reviewLog: [],
    currentTask: {
      scope: '',
      constraints: [],
      relatedFiles: [],
    },
    updatedAt: new Date(),
  }
  await setProjectState(projectId, initial)
  return initial
}

// --- Merge helpers ---
export async function mergeProjectState(
  projectId: string,
  patch: Partial<ProjectStateDoc>
): Promise<ProjectStateDoc | null> {
  const current = await getProjectState(projectId)
  if (!current) return null

  const merged: ProjectStateDoc = {
    ...current,
    ...patch,
    architecture: {
      ...current.architecture,
      ...(patch.architecture ?? {}),
    },
    conventions: {
      ...current.conventions,
      ...(patch.conventions ?? {}),
    },
    dependencies: {
      ...current.dependencies,
      ...(patch.dependencies ?? {}),
      versions: {
        ...current.dependencies.versions,
        ...(patch.dependencies?.versions ?? {}),
      },
    },
    updatedAt: new Date(),
  }
  await setProjectState(projectId, merged)
  return merged
}

export async function appendReviewEntry(
  projectId: string,
  entry: ReviewEntry
): Promise<boolean> {
  const state = await getProjectState(projectId)
  if (!state) return false
  state.reviewLog = [...state.reviewLog, entry]
  return setProjectState(projectId, state)
}

export async function appendOpenQuestion(
  projectId: string,
  question: OpenQuestion
): Promise<boolean> {
  const state = await getProjectState(projectId)
  if (!state) return false
  state.openQuestions = [...state.openQuestions, question]
  return setProjectState(projectId, state)
}

export async function resolveOpenQuestion(
  projectId: string,
  questionText: string
): Promise<boolean> {
  const state = await getProjectState(projectId)
  if (!state) return false
  state.openQuestions = state.openQuestions.map((q) =>
    q.text === questionText ? { ...q, resolved: true } : q
  )
  return setProjectState(projectId, state)
}

// --- Task-relevant slicing ---
// Each model only receives the ProjectState sections relevant to its task.
// This keeps token usage lean and prevents context noise.
export function sliceStateForTask(
  state: ProjectStateDoc,
  taskType: TaskType,
  model: ModelRole
): Partial<ProjectStateDoc> {
  // Gemini gets the full state for refactor/consistency tasks
  if (model === 'gemini') return state

  switch (taskType) {
    case 'architecture':
      return {
        projectId: state.projectId,
        architecture: state.architecture,
        conventions: state.conventions,
        openQuestions: state.openQuestions.filter((q) => !q.resolved),
        currentTask: state.currentTask,
      }
    case 'implementation':
      return {
        projectId: state.projectId,
        architecture: state.architecture,
        conventions: state.conventions,
        dependencies: state.dependencies,
        currentTask: state.currentTask,
      }
    case 'research':
      return {
        projectId: state.projectId,
        dependencies: state.dependencies,
        currentTask: state.currentTask,
      }
    case 'refactor':
      return {
        projectId: state.projectId,
        architecture: state.architecture,
        conventions: state.conventions,
        dependencies: state.dependencies,
        currentTask: state.currentTask,
      }
    case 'review':
      return {
        projectId: state.projectId,
        architecture: state.architecture,
        conventions: state.conventions,
        dependencies: state.dependencies,
        reviewLog: state.reviewLog.slice(-10), // last 10 entries only
        currentTask: state.currentTask,
      }
    case 'arbitration':
      return {
        projectId: state.projectId,
        architecture: state.architecture,
        conventions: state.conventions,
        reviewLog: state.reviewLog.slice(-20),
        openQuestions: state.openQuestions,
        currentTask: state.currentTask,
      }
    default:
      return {
        projectId: state.projectId,
        currentTask: state.currentTask,
      }
  }
}

// --- Optimistic lock for concurrent writes ---
export async function acquireLock(
  projectId: string,
  ttlSeconds = 30
): Promise<boolean> {
  const result = await redis.set(
    lockKey(projectId),
    '1',
    'EX',
    ttlSeconds,
    'NX'
  )
  return result === 'OK'
}

export async function releaseLock(projectId: string): Promise<void> {
  await redis.del(lockKey(projectId))
}

export async function withLock<T>(
  projectId: string,
  fn: () => Promise<T>
): Promise<T> {
  const acquired = await acquireLock(projectId)
  if (!acquired) {
    throw new Error(`[ProjectState] Could not acquire lock for project ${projectId}`)
  }
  try {
    return await fn()
  } finally {
    await releaseLock(projectId)
  }
}

// --- Invalidate cache ---
export async function invalidateStateCache(projectId: string): Promise<void> {
  await redis.del(stateKey(projectId))
}

// --- Internal helpers ---
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mongoDocToStateDoc(doc: any): ProjectStateDoc {
  return {
    projectId: doc.projectId.toString(),
    architecture: doc.architecture,
    conventions: doc.conventions,
    dependencies: {
      ...doc.dependencies,
      versions: doc.dependencies?.versions instanceof Map
        ? Object.fromEntries(doc.dependencies.versions)
        : doc.dependencies?.versions ?? {},
    },
    openQuestions: doc.openQuestions ?? [],
    reviewLog: doc.reviewLog ?? [],
    currentTask: doc.currentTask,
    updatedAt: doc.updatedAt,
  }
}
