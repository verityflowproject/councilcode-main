import { auth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { runOrchestrator } from '@/lib/orchestrator'
import { connectDB } from '@/lib/db/mongoose'
import { Project } from '@/lib/models/Project'
import { User } from '@/lib/models/User'
import { logUsage } from '@/lib/utils/usageLogger'
import { serializeError, UsageLimitError } from '@/lib/utils/errors'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { projectId, prompt, sessionId } = body

  if (!projectId || !prompt || !sessionId) {
    return NextResponse.json(
      { error: 'projectId, prompt, and sessionId are required' },
      { status: 400 }
    )
  }

  try {
    await connectDB()

    // Verify project belongs to user
    const project = await Project.findOne({
      _id: projectId,
      userId: session.user.id,
    })
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Check usage limits
    const user = await User.findById(session.user.id)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    if (user.modelCallsUsed >= user.modelCallsLimit) {
      throw new UsageLimitError()
    }

    // Run orchestrator
    const result = await runOrchestrator(projectId, prompt, sessionId)

    // Increment usage counter
    await User.findByIdAndUpdate(session.user.id, {
      $inc: { modelCallsUsed: result.responses.length },
    })

    // Log detailed usage
    const taskTypesForLog = result.responses.map((r) =>
      r.model === 'perplexity'
        ? 'research' as const
        : r.model === 'claude' && result.requiresArbitration
        ? 'arbitration' as const
        : 'implementation' as const
    )
    await logUsage({
      userId: session.user.id,
      projectId,
      sessionId,
      responses: result.responses,
      taskTypes: taskTypesForLog,
    })

    // Update project status
    await Project.findByIdAndUpdate(projectId, {
      status: result.requiresArbitration ? 'review' : 'building',
      activeSessionId: sessionId,
      lastBuiltAt: new Date(),
    })

    return NextResponse.json(
      {
        responses: result.responses,
        reviewedOutputs: result.reviewedOutputs,
        arbitrationResults: result.arbitrationResults,
        updatedState: result.updatedState,
        requiresArbitration: result.requiresArbitration,
        callsUsed: result.responses.length,
        reviewTokensUsed: result.reviewTokensUsed,
        arbitrationTokensUsed: result.arbitrationTokensUsed,
      },
      { status: 200 }
    )
  } catch (err: unknown) {
    console.error('[/api/orchestrator] error:', err)
    const { message, statusCode } = serializeError(err)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}
