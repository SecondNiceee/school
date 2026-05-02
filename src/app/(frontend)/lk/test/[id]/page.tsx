import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import { getPayload } from 'payload'
import Link from 'next/link'

import config from '@/payload.config'
import { verifyToken } from '@/utils/auth'
import { TestResultViewer } from './TestResultViewer'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function TestPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const cookieStore = await cookies()
  const token = cookieStore.get('user-token')?.value

  if (!token) {
    redirect('/login')
  }

  const tokenPayload = await verifyToken(token)
  if (!tokenPayload) {
    redirect('/login')
  }

  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // Get user
  const user = await payload.findByID({
    collection: 'users',
    id: tokenPayload.id,
  })

  if (!user) {
    redirect('/login')
  }

  // Get the test
  const test = await payload.findByID({
    collection: 'tests',
    id: Number(id),
  })

  if (!test) {
    notFound()
  }

  // Check if user is assigned to this test
  const isAssigned = test.assignedTo?.some((assigned) => {
    const assignedId = typeof assigned === 'number' ? assigned : assigned?.id
    return assignedId === Number(tokenPayload.id)
  })

  if (!isAssigned) {
    redirect('/lk')
  }

  // Get test result if exists
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

  const hasResult = results.docs.length > 0
  const result = hasResult ? results.docs[0] : null

  // Build detailed results for each question if completed
  let questionsWithResults = null
  if (result) {
    questionsWithResults = test.questions?.map((question, index) => {
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
        questionType: question.questionType as 'choice' | 'text',
        options: question.questionType === 'choice' ? question.options?.map((opt) => opt.text) : undefined,
        userAnswer,
        userAnswerDisplay,
        correctAnswerDisplay,
        isCorrect,
      }
    })
  }

  const testData = {
    id: test.id,
    title: test.title,
    description: test.description,
    questionsCount: test.questions?.length || 0,
    completed: hasResult,
    result: result
      ? {
          score: result.score,
          totalQuestions: result.totalQuestions,
          percentage: result.percentage,
          completedAt: result.completedAt,
        }
      : null,
    questions: questionsWithResults,
  }

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/lk"
          className="inline-flex items-center gap-2 text-text-light hover:text-text mb-6 transition-colors no-underline"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Назад в личный кабинет</span>
        </Link>

        <TestResultViewer test={testData} userId={user.id} />
      </div>
    </div>
  )
}
