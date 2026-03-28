export type ModelRole = 'claude' | 'gpt4o' | 'codestral' | 'gemini' | 'perplexity'

export type TaskType =
  | 'architecture'
  | 'implementation'
  | 'research'
  | 'refactor'
  | 'review'
  | 'arbitration'

export interface ArchitectureState {
  decisions: string[]
  fileTree: string
  dataModels: string[]
  apiRoutes: string[]
}

export interface ConventionsState {
  naming: string
  folderStructure: string
  componentPatterns: string[]
}

export interface DependenciesState {
  packages: string[]
  versions: Record<string, string>
  knownGotchas: string[]
}

export interface OpenQuestion {
  text: string
  flaggedBy: ModelRole
  resolved?: boolean
}

export interface ReviewEntry {
  modelSource: ModelRole
  decision: string
  rationale: string
  timestamp: Date
  taskType: TaskType
}

export interface CurrentTask {
  scope: string
  constraints: string[]
  relatedFiles: string[]
}

export interface ProjectStateDoc {
  projectId: string
  architecture: ArchitectureState
  conventions: ConventionsState
  dependencies: DependenciesState
  openQuestions: OpenQuestion[]
  reviewLog: ReviewEntry[]
  currentTask: CurrentTask
  updatedAt: Date
}

export interface OrchestratorTask {
  projectId: string
  taskType: TaskType
  prompt: string
  assignedModel: ModelRole
  context: Partial<ProjectStateDoc>
  userId: string
}

export interface ModelResponse {
  model: ModelRole
  output: string
  confidence: number
  flaggedIssues: string[]
  tokensUsed: number        // inputTokens + outputTokens (backward compat)
  modelString: string
  inputTokens: number
  outputTokens: number
  creditCost: number
  keySource: 'byok-individual' | 'byok-openrouter' | 'platform'
}

export interface CouncilSession {
  sessionId: string
  projectId: string
  userId: string
  tasks: OrchestratorTask[]
  responses: ModelResponse[]
  status: 'pending' | 'running' | 'review' | 'complete' | 'error'
  createdAt: Date
  updatedAt: Date
}

export interface FirewallStatus {
  fired: boolean
  passed: boolean
  blocked: boolean
  verifiedCount: number
  warningCount: number
  unverifiedCount: number
  blockReason?: string
}

export interface ArbitrationEntry {
  model: ModelRole
  originalOutput: string
  finalOutput: string
  rationale: string
  patched: boolean
  winner: ModelRole | 'neither'
}

export interface SessionSummary {
  sessionId: string
  projectId: string
  totalResponses: number
  reviewsPassed: number
  reviewsFailed: number
  arbitrationsRun: number
  totalTokensUsed: number
  requiresArbitration: boolean
  completedAt: Date
}
