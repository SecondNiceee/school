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

  const getScoreClass = (percentage: number) => {
    if (percentage >= 80) return 'score-excellent'
    if (percentage >= 60) return 'score-good'
    if (percentage >= 40) return 'score-average'
    return 'score-poor'
  }

  if (selectedStudent) {
    const { student, assignedTests, testResults } = selectedStudent

    // Create a map of test results by test ID
    const resultsMap = new Map<number, TestResult>()
    testResults.forEach((r) => {
      const testId = typeof r.test === 'number' ? r.test : r.test?.id
      if (testId) resultsMap.set(testId, r)
    })

    return (
      <div className="student-profile">
        <button onClick={handleBack} className="back-btn">
          &larr; Назад к списку
        </button>

        <div className="profile-header">
          <div className="profile-avatar">
            {(student.name || student.email).charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h2>{student.name || 'Без имени'}</h2>
            <p className="profile-email">{student.email}</p>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-card">
            <span className="stat-value">{assignedTests.length}</span>
            <span className="stat-label">Назначено тестов</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{testResults.length}</span>
            <span className="stat-label">Пройдено тестов</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">
              {testResults.length > 0
                ? Math.round(testResults.reduce((sum, r) => sum + r.percentage, 0) / testResults.length)
                : 0}%
            </span>
            <span className="stat-label">Средний результат</span>
          </div>
        </div>

        <div className="profile-tests">
          <h3>Назначенные тесты</h3>
          {assignedTests.length === 0 ? (
            <p className="no-tests">Нет назначенных тестов</p>
          ) : (
            <div className="tests-results-list">
              {assignedTests.map((test) => {
                const result = resultsMap.get(test.id)
                return (
                  <div key={test.id} className="test-result-card">
                    <div className="test-result-info">
                      <h4>{test.title}</h4>
                      {result ? (
                        <div className="result-details">
                          <span className={`result-score ${getScoreClass(result.percentage)}`}>
                            {result.score} / {result.totalQuestions} ({result.percentage}%)
                          </span>
                          <span className="result-date">
                            Пройден: {formatDate(result.completedAt)}
                          </span>
                        </div>
                      ) : (
                        <span className="not-completed">Не пройден</span>
                      )}
                    </div>
                    <div className="test-result-status">
                      {result ? (
                        <span className="status-completed">Выполнено</span>
                      ) : (
                        <span className="status-pending">Ожидает</span>
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
    <div className="students-tab">
      <div className="students-header">
        <h2>Ученики</h2>
        <span className="students-count">{students.length} учеников</span>
      </div>

      {error && <div className="students-error">{error}</div>}

      {loading && (
        <div className="students-loading">
          <div className="spinner"></div>
          <p>Загрузка...</p>
        </div>
      )}

      {students.length === 0 ? (
        <div className="students-empty">
          <p>Нет зарегистрированных учеников</p>
        </div>
      ) : (
        <div className="students-grid">
          {students.map((student) => (
            <div
              key={student.id}
              className="student-card"
              onClick={() => fetchStudentDetails(student.id)}
            >
              <div className="student-avatar">
                {(student.name || student.email).charAt(0).toUpperCase()}
              </div>
              <div className="student-info">
                <span className="student-name">{student.name || 'Без имени'}</span>
                <span className="student-email">{student.email}</span>
              </div>
              <span className="view-profile">Профиль &rarr;</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
