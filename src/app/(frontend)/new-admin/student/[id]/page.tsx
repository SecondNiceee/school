import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'

import config from '@/payload.config'

export const dynamic = 'force-dynamic'
export const revalidate = 0

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

  // Get tests assigned to this student
  const testsResult = await payload.find({
    collection: 'tests',
    where: {
      assignedTo: { contains: student.id },
    },
    depth: 0,
  })

  const assignedTests: AssignedTest[] = testsResult.docs.map((t) => ({
    id: t.id,
    title: t.title,
  }))

  // Get student's test results
  const resultsResult = await payload.find({
    collection: 'test-results',
    where: {
      student: { equals: student.id },
    },
    depth: 1,
  })

  const testResults: TestResult[] = resultsResult.docs.map((r) => ({
    id: r.id,
    test: {
      id: typeof r.test === 'number' ? r.test : (r.test as any)?.id || 0,
      title: typeof r.test === 'number' ? 'Тест' : (r.test as any)?.title || 'Тест',
    },
    score: r.score,
    totalQuestions: r.totalQuestions,
    percentage: r.percentage,
    completedAt: r.completedAt,
  }))

  // Create a map of test results by test ID
  const resultsMap = new Map<number, TestResult>()
  testResults.forEach((r) => {
    resultsMap.set(r.test.id, r)
  })

  const avgScore =
    testResults.length > 0
      ? Math.round(testResults.reduce((sum, r) => sum + r.percentage, 0) / testResults.length)
      : 0

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

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
      <header className="bg-surface border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Панель управления</h1>
        <a
          href="/admin"
          className="px-4 py-2 text-sm font-medium text-primary hover:text-primary-light transition-colors"
        >
          Payload Admin
        </a>
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

            {assignedTests.length === 0 ? (
              <p className="text-center py-8 text-text-light">Нет назначенных тестов</p>
            ) : (
              <div className="space-y-3">
                {assignedTests.map((test) => {
                  const result = resultsMap.get(test.id)
                  return (
                    <div
                      key={test.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-primary/20 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-text m-0">{test.title}</h4>
                        {result ? (
                          <div className="flex items-center gap-3 mt-2">
                            <span className={`font-semibold ${getScoreColor(result.percentage)}`}>
                              {result.score} / {result.totalQuestions} ({result.percentage}%)
                            </span>
                            <span className="text-sm text-text-light">
                              {formatDate(result.completedAt)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-text-light mt-1 block">Не пройден</span>
                        )}
                      </div>
                      <div>
                        {result ? (
                          <span className="px-4 py-2 bg-accent/10 text-accent text-sm font-medium rounded-full">
                            Выполнено
                          </span>
                        ) : (
                          <span className="px-4 py-2 bg-yellow-500/10 text-yellow-600 text-sm font-medium rounded-full">
                            Ожидает
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
