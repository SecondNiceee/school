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

  const getScoreStyles = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 bg-green-500/10'
    if (percentage >= 60) return 'text-blue-600 bg-blue-500/10'
    if (percentage >= 40) return 'text-yellow-600 bg-yellow-500/10'
    return 'text-red-600 bg-red-500/10'
  }

  return (
    <div className={`bg-surface rounded-2xl p-5 shadow-[0_4px_20px_rgba(99,102,241,0.1)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] ${test.completed ? 'border-l-4 border-l-accent' : ''}`}>
      <div className="flex justify-between items-start gap-3 mb-3">
        <h3 className="m-0 text-base font-semibold text-text">{test.title}</h3>
        {test.completed && (
          <span className="shrink-0 py-1 px-2.5 text-xs font-medium text-accent bg-accent/10 rounded-full">
            Пройден
          </span>
        )}
      </div>

      {test.description && (
        <p className="m-0 mb-3 text-sm text-text-light line-clamp-2">{test.description}</p>
      )}

      <div className="mb-4">
        <span className="text-xs text-text-light">{test.questionsCount} вопросов</span>
      </div>

      {test.completed && test.result ? (
        <div className="pt-3 border-t border-gray-100">
          <div className={`inline-flex flex-col items-center p-3 rounded-xl mb-2 ${getScoreStyles(test.result.percentage)}`}>
            <span className="text-2xl font-bold">{test.result.percentage}%</span>
            <span className="text-xs opacity-80">
              {test.result.score} из {test.result.totalQuestions}
            </span>
          </div>
          <span className="block text-xs text-text-light">
            Пройден: {formatDate(test.result.completedAt)}
          </span>
        </div>
      ) : (
        <button 
          className="w-full py-3 px-4 text-sm font-semibold text-white bg-gradient-primary border-none rounded-xl cursor-pointer shadow-primary transition-all duration-200 hover:-translate-y-0.5 hover:shadow-primary-hover"
          onClick={() => onStart(test.id)}
        >
          Пройти тест
        </button>
      )}
    </div>
  )
}
