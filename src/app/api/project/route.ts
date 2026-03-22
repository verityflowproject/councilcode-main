import { auth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongoose'
import { Project } from '@/lib/models/Project'
import { initProjectState } from '@/lib/utils/projectState'

export async function GET(_req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    await connectDB()
    const projects = await Project.find({ userId: session.user.id })
      .sort({ updatedAt: -1 })
      .lean()
    return NextResponse.json({ projects }, { status: 200 })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('[/api/project GET] error:', err)
    return NextResponse.json(
      { error: err.message ?? 'Internal error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await req.json()
  const { name, description, techStack } = body
  if (!name || !description) {
    return NextResponse.json(
      { error: 'name and description are required' },
      { status: 400 }
    )
  }
  try {
    await connectDB()
    const project = await Project.create({
      userId: session.user.id,
      name: name.trim().slice(0, 100),
      description: description.trim().slice(0, 1000),
      techStack: Array.isArray(techStack) ? techStack : [],
      status: 'draft',
      totalSessions: 0,
    })
    // Initialize empty ProjectState for this project
    await initProjectState(project._id.toString())
    return NextResponse.json({ project }, { status: 201 })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('[/api/project POST] error:', err)
    return NextResponse.json(
      { error: err.message ?? 'Internal error' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const projectId = req.nextUrl.searchParams.get('projectId')
  if (!projectId) {
    return NextResponse.json({ error: 'projectId required' }, { status: 400 })
  }
  try {
    await connectDB()
    await Project.findOneAndDelete({
      _id: projectId,
      userId: session.user.id,
    })
    return NextResponse.json({ success: true }, { status: 200 })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('[/api/project DELETE] error:', err)
    return NextResponse.json(
      { error: err.message ?? 'Internal error' },
      { status: 500 }
    )
  }
}
