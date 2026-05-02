'use client'

interface TestCardProps {
  test: {
    id: number
    title: string
    description?: string | null
    questionsCount: number
    completed: boolean
    result?: {
      score: number
      totalQuestions: number
      percentage: number
      completedAt: string
    } | null
  }
  onStart: (testId: number) => void
}

export function TestCard({ test, onStart }: TestCardProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const getScoreClass = (percentage: number) => {
    if (percentage >= 80) return 'score-excellent'
    if (percentage >= 60) return 'score-good'
    if (percentage >= 40) return 'score-average'
    return 'score-poor'
  }

  return (
    <div className={`test-card ${test.completed ? 'completed' : ''}`}>
      <div className="test-card-header">
        <h3>{test.title}</h3>
        {test.completed && <span className="completed-badge">Пройден</span>}
      </div>

      {test.description && <p className="test-card-desc">{test.description}</p>}

      <div className="test-card-meta">
        <span className="questions-count">{test.questionsCount} вопросов</span>
      </div>

      {test.completed && test.result ? (
        <div className="test-card-result">
          <div className={`result-score ${getScoreClass(test.result.percentage)}`}>
            <span className="score-value">{test.result.percentage}%</span>
            <span className="score-detail">
              {test.result.score} из {test.result.totalQuestions}
            </span>
          </div>
          <span className="result-date">Пройден: {formatDate(test.result.completedAt)}</span>
        </div>
      ) : (
        <button className="start-test-btn" onClick={() => onStart(test.id)}>
          Пройти тест
        </button>
      )}
    </div>
  )
}
