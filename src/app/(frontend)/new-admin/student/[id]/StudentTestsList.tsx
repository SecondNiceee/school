'use client'

import { useState } from 'react'
import { AdminTestResultViewer } from './AdminTestResultViewer'

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

interface StudentTestsListProps {
  assignedTests: AssignedTest[]
  testResults: TestResult[]
}

export function StudentTestsList({ assignedTests, testResults }: StudentTestsListProps) {
  const [expandedTestId, setExpandedTestId] = useState<number | null>(null)

  const resultsMap = new Map<number, TestResult>()
  testResults.forEach((r) => {
    resultsMap.set(r.test.id, r)
  })

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

  const toggleExpand = (testId: number) => {
    setExpandedTestId(expandedTestId === testId ? null : testId)
  }

  if (assignedTests.length === 0) {
    return <p className="text-center py-8 text-text-light">Нет назначенных тестов</p>
  }

  return (
    <div className="space-y-3">
      {assignedTests.map((test) => {
        const result = resultsMap.get(test.id)
        const isExpanded = expandedTestId === test.id
        const hasQuestions = result?.questions && result.questions.length > 0
        const errorCount = result?.questions?.filter((q) => !q.isCorrect).length || 0

        return (
          <div key={test.id} className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
            <div
              className={`flex items-center justify-between p-4 ${
                result && hasQuestions ? 'cursor-pointer hover:bg-gray-100 transition-colors' : ''
              }`}
              onClick={() => result && hasQuestions && toggleExpand(test.id)}
            >
              <div className="flex-1">
                <h4 className="font-medium text-text m-0">{test.title}</h4>
                {result ? (
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`font-semibold ${getScoreColor(result.percentage)}`}>
                      {result.score} / {result.totalQuestions} ({result.percentage}%)
                    </span>
                    {errorCount > 0 && (
                      <span className="text-sm text-red-500">
                        {errorCount} {errorCount === 1 ? 'ошибка' : errorCount < 5 ? 'ошибки' : 'ошибок'}
                      </span>
                    )}
                    <span className="text-sm text-text-light">
                      {formatDate(result.completedAt)}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-text-light mt-1 block">Не пройден</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {result ? (
                  <>
                    <span className="px-4 py-2 bg-accent/10 text-accent text-sm font-medium rounded-full">
                      Выполнено
                    </span>
                    {hasQuestions && (
                      <svg
                        className={`w-5 h-5 text-text-light transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </>
                ) : (
                  <span className="px-4 py-2 bg-yellow-500/10 text-yellow-600 text-sm font-medium rounded-full">
                    Ожидает
                  </span>
                )}
              </div>
            </div>

            {/* Expanded content */}
            {isExpanded && result && result.questions && (
              <AdminTestResultViewer
                testResult={{
                  id: result.id,
                  title: test.title,
                  score: result.score,
                  totalQuestions: result.totalQuestions,
                  percentage: result.percentage,
                  completedAt: result.completedAt,
                  questions: result.questions,
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
