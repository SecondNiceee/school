import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { verifyToken } from '@/utils/auth'

export async function POST(request: Request) {
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
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    const body = await request.json()
    const { testId, answers } = body

    // Check if already submitted
    const existingResult = await payload.find({
      collection: 'test-results',
      where: {
        and: [
          { test: { equals: testId } },
          { student: { equals: Number(tokenPayload.id) } },
        ],
      },
    })

    if (existingResult.docs.length > 0) {
      return NextResponse.json({ error: 'Test already submitted' }, { status: 400 })
    }

    // Get the test
    const test = await payload.findByID({
      collection: 'tests',
      id: testId,
    })

    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 })
    }

    // Calculate score
    let score = 0
    const totalQuestions = test.questions?.length || 0

    test.questions?.forEach((question, index) => {
      const userAnswer = answers[index]

      if (question.questionType === 'choice') {
        // For choice questions, check if selected option is correct
        const correctOptionIndex = question.options?.findIndex((opt) => opt.isCorrect)
        if (userAnswer === correctOptionIndex) {
          score++
        }
      } else if (question.questionType === 'text') {
        // For text questions, compare answers (case insensitive, trimmed)
        const correctAnswer = question.correctAnswer?.toLowerCase().trim()
        const studentAnswer = userAnswer?.toString().toLowerCase().trim()
        if (correctAnswer === studentAnswer) {
          score++
        }
      }
    })

    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0

    // Save result
    const result = await payload.create({
      collection: 'test-results',
      data: {
        test: testId,
        student: Number(tokenPayload.id),
        answers,
        score,
        totalQuestions,
        percentage,
        completedAt: new Date().toISOString(),
      },
    })

    return NextResponse.json({
      success: true,
      score,
      totalQuestions,
      percentage,
      resultId: result.id,
    })
  } catch (error) {
    console.error('Error submitting test:', error)
    return NextResponse.json({ error: 'Failed to submit test' }, { status: 500 })
  }
}
