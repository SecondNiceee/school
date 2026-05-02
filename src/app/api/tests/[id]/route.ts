import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { verifyToken } from '@/utils/auth'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies()
  const token = cookieStore.get('user-token')?.value

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const tokenPayload = await verifyToken(token)
  if (!tokenPayload) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  try {
    const { id } = await params
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    // Get the test
    const test = await payload.findByID({
      collection: 'tests',
      id: Number(id),
    })

    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 })
    }

    // Check if user is assigned to this test
    const isAssigned = test.assignedTo?.some((assigned) => {
      const assignedId = typeof assigned === 'number' ? assigned : assigned?.id
      return assignedId === Number(tokenPayload.id)
    })

    if (!isAssigned) {
      return NextResponse.json({ error: 'Not assigned to this test' }, { status: 403 })
    }

    // Check if already completed
    const existingResult = await payload.find({
      collection: 'test-results',
      where: {
        and: [
          { test: { equals: Number(id) } },
          { student: { equals: Number(tokenPayload.id) } },
        ],
      },
    })

    if (existingResult.docs.length > 0) {
      return NextResponse.json({
        error: 'Test already completed',
        result: existingResult.docs[0],
      }, { status: 400 })
    }

    // Return test without correct answers
    const safeQuestions = test.questions?.map((q) => ({
      questionText: q.questionText,
      questionType: q.questionType,
      options: q.questionType === 'choice' 
        ? q.options?.map((opt) => ({ text: opt.text })) 
        : undefined,
    }))

    return NextResponse.json({
      id: test.id,
      title: test.title,
      description: test.description,
      questions: safeQuestions,
    })
  } catch (error) {
    console.error('Error fetching test:', error)
    return NextResponse.json({ error: 'Failed to fetch test' }, { status: 500 })
  }
}
