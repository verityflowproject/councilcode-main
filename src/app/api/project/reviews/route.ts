import { auth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongoose'
import { ReviewLog } from '@/lib/models/ReviewLog'
import { Project } from '@/lib/models/Project'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const projectId = req.nextUrl.searchParams.get('projectId')
  const sessionId = req.nextUrl.searchParams.get('sessionId')
  const limit = parseInt(req.nextUrl.searchParams.get('limit') ?? '20')

  if (!projectId) {
    return NextResponse.json({ error: 'projectId required' }, { status: 400 })
  }

  try {
    await connectDB()

    // Verify project ownership
    const project = await Project.findOne({
      _id: projectId,
      userId: session.user.id,
    })
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const query: Record<string, string> = { projectId }
    if (sessionId) query.sessionId = sessionId

    const reviews = await ReviewLog.find(query)
      .sort({ createdAt: -1 })
      .limit(Math.min(limit, 100))
      .lean()

    return NextResponse.json({ reviews }, { status: 200 })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('[/api/project/reviews] error:', err)
    return NextResponse.json(
      { error: err.message ?? 'Internal error' },
      { status: 500 }
    )
  }
}
