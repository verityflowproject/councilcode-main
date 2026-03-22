import { auth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import {
  getProjectState,
  setProjectState,
  mergeProjectState,
  initProjectState,
  withLock,
} from '@/lib/utils/projectState'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const projectId = req.nextUrl.searchParams.get('projectId')
  if (!projectId) {
    return NextResponse.json({ error: 'projectId required' }, { status: 400 })
  }

  const state = await getProjectState(projectId)
  if (!state) {
    return NextResponse.json({ error: 'ProjectState not found' }, { status: 404 })
  }

  return NextResponse.json({ state }, { status: 200 })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { projectId, action, patch } = body

  if (!projectId || !action) {
    return NextResponse.json({ error: 'projectId and action required' }, { status: 400 })
  }

  try {
    switch (action) {
      case 'init': {
        const state = await initProjectState(projectId)
        return NextResponse.json({ state }, { status: 201 })
      }
      case 'merge': {
        if (!patch) {
          return NextResponse.json({ error: 'patch required for merge' }, { status: 400 })
        }
        const state = await withLock(projectId, () =>
          mergeProjectState(projectId, patch)
        )
        return NextResponse.json({ state }, { status: 200 })
      }
      case 'replace': {
        if (!patch) {
          return NextResponse.json({ error: 'patch required for replace' }, { status: 400 })
        }
        await withLock(projectId, () => setProjectState(projectId, patch))
        return NextResponse.json({ success: true }, { status: 200 })
      }
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('[/api/project/state] error:', err)
    return NextResponse.json({ error: err.message ?? 'Internal error' }, { status: 500 })
  }
}
