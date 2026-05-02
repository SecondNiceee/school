'use client'

import { useState } from 'react'

interface Student {
  id: number
  name: string
  email: string
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
}

interface AssignedTest {
  id: number
  title: string
}

interface StudentDetails {
  student: Student
  assignedTests: AssignedTest[]
  testResults: TestResult[]
}

interface StudentsTabProps {
  students: Student[]
}

export function StudentsTab({ students }: StudentsTabProps) {
  const [selectedStudent, setSelectedStudent] = useState<StudentDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStudentDetails = async (studentId: number) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/admin/students?id=${studentId}`)
      if (!response.ok) throw new Error('Failed to fetch student details')
      const data = await response.json()
      setSelectedStudent(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    setSelectedStudent(null)
    setError(null)
  }

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
    if (percentage >= 40) return 'text-warning'
    return 'text-red-500'
  }

  if (selectedStudent) {
    const { student, assignedTests, testResults } = selectedStudent

    // Create a map of test results by test ID
    const resultsMap = new Map<number, TestResult>()
    testResults.forEach((r) => {
      const testId = typeof r.test === 'number' ? r.test : r.test?.id
      if (testId) resultsMap.set(testId, r)
    })

    const avgScore =
      testResults.length > 0
        ? Math.round(testResults.reduce((sum, r) => sum + r.percentage, 0) / testResults.length)
        : 0

    return (
      <div>
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-text-light hover:text-text mb-6 transition-colors"
        >
          <span>&larr;</span>
          <span>Назад к списку</span>
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {(student.name || student.email).charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-text">{student.name || 'Без имени'}</h2>
            <p className="text-text-light">{student.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-surface rounded-xl border border-gray-200 p-4 text-center">
            <div className="text-3xl font-bold text-primary">{assignedTests.length}</div>
            <div className="text-sm text-text-light">Назначено тестов</div>
          </div>
          <div className="bg-surface rounded-xl border border-gray-200 p-4 text-center">
            <div className="text-3xl font-bold text-accent">{testResults.length}</div>
            <div className="text-sm text-text-light">Пройдено тестов</div>
          </div>
          <div className="bg-surface rounded-xl border border-gray-200 p-4 text-center">
            <div className={`text-3xl font-bold ${getScoreColor(avgScore)}`}>{avgScore}%</div>
            <div className="text-sm text-text-light">Средний результат</div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-text mb-4">Назначенные тесты</h3>
          {assignedTests.length === 0 ? (
            <p className="text-center py-8 text-text-light">Нет назначенных тестов</p>
          ) : (
            <div className="space-y-3">
              {assignedTests.map((test) => {
                const result = resultsMap.get(test.id)
                return (
                  <div
                    key={test.id}
                    className="bg-surface rounded-xl border border-gray-200 p-4 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-medium text-text">{test.title}</h4>
                      {result ? (
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`font-semibold ${getScoreColor(result.percentage)}`}>
                            {result.score} / {result.totalQuestions} ({result.percentage}%)
                          </span>
                          <span className="text-sm text-text-light">
                            Пройден: {formatDate(result.completedAt)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-text-light">Не пройден</span>
                      )}
                    </div>
                    <div>
                      {result ? (
                        <span className="px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full">
                          Выполнено
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-warning/10 text-warning text-sm font-medium rounded-full">
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
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text">Ученики</h2>
        <span className="text-sm text-text-light">{students.length} учеников</span>
      </div>

      {error && <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">{error}</div>}

      {loading && (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-text-light">Загрузка...</p>
        </div>
      )}

      {students.length === 0 ? (
        <div className="text-center py-12 text-text-light">
          <p>Нет зарегистрированных учеников</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((student) => (
            <div
              key={student.id}
              onClick={() => fetchStudentDetails(student.id)}
              className="bg-surface rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-primary/30 cursor-pointer transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
                  {(student.name || student.email).charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-text truncate">{student.name || 'Без имени'}</p>
                  <p className="text-sm text-text-light truncate">{student.email}</p>
                </div>
                <span className="text-primary text-sm whitespace-nowrap">Профиль &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
