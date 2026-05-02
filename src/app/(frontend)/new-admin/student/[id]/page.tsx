import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'

import config from '@/payload.config'
import { StudentTestsList } from './StudentTestsList'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface QuestionResult {
  questionText: string
  questionType: 'choice' | 'text'
  options?: string[]
  userAnswer: number | string
  userAnswerDisplay: string
  correctAnswerDisplay: string
  isCorrect: boolean
}

interface TestResult {
  id: number
  test: {
    id: number
    title: string
  }
  score: number
  totalQuestions: number
  percentage: number
  completedAt: string
  questions?: QuestionResult[]
}

interface AssignedTest {
  id: number
  title: string
}

export default async function StudentProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const cookieStore = await cookies()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // Проверяем авторизацию через Payload CMS (как в /new-admin)
  let admin = null
  try {
    const result = await payload.auth({
      headers: new Headers({ cookie: cookieStore.toString() }),
    })
    if (result.user?.collection === 'admins') {
      admin = result.user
    }
  } catch {
    // Not authenticated
  }

  if (!admin) {
    redirect('/admin')
  }

  // Get student
  let student = null
  try {
    student = await payload.findByID({
      collection: 'users',
      id: Number(id),
    })
  } catch {
    notFound()
  }

  if (!student) {
    notFound()
  }

  // Get tests assigned to this student (with full question data)
  const testsResult = await payload.find({
    collection: 'tests',
    where: {
      assignedTo: { contains: student.id },
    },
    depth: 1,
  })

  const assignedTests: AssignedTest[] = testsResult.docs.map((t) => ({
    id: t.id,
    title: t.title,
  }))

  // Create a map of tests for later lookup
  const testsMap = new Map(testsResult.docs.map((t) => [t.id, t]))

  // Get student's test results
  const resultsResult = await payload.find({
    collection: 'test-results',
    where: {
      student: { equals: student.id },
    },
    depth: 1,
  })

  // Build test results with question details
  const testResults: TestResult[] = resultsResult.docs.map((r) => {
    const testId = typeof r.test === 'number' ? r.test : (r.test as any)?.id || 0
    const testData = testsMap.get(testId)
    const answers = Array.isArray(r.answers) ? r.answers : []

    // Build question results if we have the test data
    let questions: QuestionResult[] | undefined
    if (testData?.questions) {
      questions = testData.questions.map((question, index) => {
        const userAnswer = answers[index]
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

    return {
      id: r.id,
      test: {
        id: testId,
        title: typeof r.test === 'number' ? 'Тест' : (r.test as any)?.title || 'Тест',
      },
      score: r.score,
      totalQuestions: r.totalQuestions,
      percentage: r.percentage,
      completedAt: r.completedAt,
      questions,
    }
  })

  const avgScore =
    testResults.length > 0
      ? Math.round(testResults.reduce((sum, r) => sum + r.percentage, 0) / testResults.length)
      : 0

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-accent'
    if (percentage >= 60) return 'text-primary'
    if (percentage >= 40) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getScoreBg = (percentage: number) => {
    if (percentage >= 80) return 'bg-accent/10'
    if (percentage >= 60) return 'bg-primary/10'
    if (percentage >= 40) return 'bg-yellow-500/10'
    return 'bg-red-500/10'
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-surface border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-text">Панель управления</h1>
          <a
            href="/admin"
            className="px-4 py-2 text-sm font-medium text-primary hover:text-primary-light transition-colors"
          >
            Payload Admin
          </a>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <Link
          href="/new-admin"
          className="inline-flex items-center gap-2 text-text-light hover:text-text mb-6 transition-colors no-underline"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Назад к панели администратора</span>
        </Link>

        <div className="bg-surface rounded-2xl shadow-[0_4px_20px_rgba(99,102,241,0.1)] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary-light p-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {(student.name || student.email).charAt(0).toUpperCase()}
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-bold m-0">{student.name || 'Без имени'}</h1>
                <p className="opacity-90 m-0 mt-1">{student.email}</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 p-6 border-b border-gray-100">
            <div className="text-center p-4 bg-primary/5 rounded-xl">
              <div className="text-3xl font-bold text-primary">{assignedTests.length}</div>
              <div className="text-sm text-text-light mt-1">Назначено тестов</div>
            </div>
            <div className="text-center p-4 bg-accent/5 rounded-xl">
              <div className="text-3xl font-bold text-accent">{testResults.length}</div>
              <div className="text-sm text-text-light mt-1">Пройдено тестов</div>
            </div>
            <div className={`text-center p-4 rounded-xl ${getScoreBg(avgScore)}`}>
              <div className={`text-3xl font-bold ${getScoreColor(avgScore)}`}>{avgScore}%</div>
              <div className="text-sm text-text-light mt-1">Средний результат</div>
            </div>
          </div>

          {/* Tests List */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-text mb-4">Назначенные тесты</h2>
            <StudentTestsList assignedTests={assignedTests} testResults={testResults} />
          </div>
        </div>
      </div>
    </div>
  )
}
