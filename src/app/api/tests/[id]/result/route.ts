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

    // Get the test result
    const results = await payload.find({
      collection: 'test-results',
      where: {
        and: [
          { test: { equals: Number(id) } },
          { student: { equals: Number(tokenPayload.id) } },
        ],
      },
      depth: 0,
    })

    if (results.docs.length === 0) {
      return NextResponse.json({ error: 'Result not found' }, { status: 404 })
    }

    const result = results.docs[0]

    // Get the full test with correct answers
    const test = await payload.findByID({
      collection: 'tests',
      id: Number(id),
    })

    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 })
    }

    // Build detailed results for each question
    const questionsWithResults = test.questions?.map((question, index) => {
      const userAnswer = result.answers[index]
      let isCorrect = false
      let correctAnswerDisplay = ''
      let userAnswerDisplay = ''

      if (question.questionType === 'choice') {
        const correctOptionIndex = question.options?.findIndex((opt) => opt.isCorrect) ?? -1
        isCorrect = userAnswer === correctOptionIndex
        correctAnswerDisplay = question.options?.[correctOptionIndex]?.text || ''
        userAnswerDisplay = question.options?.[userAnswer as number]?.text || 'Нет ответа'
      } else {
        const correctAnswer = question.correctAnswer?.toLowerCase().trim() || ''
        const studentAnswer = userAnswer?.toString().toLowerCase().trim() || ''
        isCorrect = correctAnswer === studentAnswer
        correctAnswerDisplay = question.correctAnswer || ''
        userAnswerDisplay = userAnswer?.toString() || 'Нет ответа'
      }

      return {
        questionText: question.questionText,
        questionType: question.questionType,
        options: question.questionType === 'choice' ? question.options?.map((opt) => opt.text) : undefined,
        userAnswer,
        userAnswerDisplay,
        correctAnswerDisplay,
        isCorrect,
      }
    })

    return NextResponse.json({
      id: test.id,
      title: test.title,
      description: test.description,
      score: result.score,
      totalQuestions: result.totalQuestions,
      percentage: result.percentage,
      completedAt: result.completedAt,
      questions: questionsWithResults,
    })
  } catch (error) {
    console.error('Error fetching test result:', error)
    return NextResponse.json({ error: 'Failed to fetch result' }, { status: 500 })
  }
}
