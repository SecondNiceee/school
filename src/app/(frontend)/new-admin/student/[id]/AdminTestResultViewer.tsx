'use client'

import { useState } from 'react'

interface QuestionResult {
  questionText: string
  questionType: 'choice' | 'text'
  options?: string[]
  userAnswer: number | string
  userAnswerDisplay: string
  correctAnswerDisplay: string
  isCorrect: boolean
}

interface TestResultData {
  id: number
  title: string
  score: number
  totalQuestions: number
  percentage: number
  completedAt: string
  questions: QuestionResult[]
}

interface AdminTestResultViewerProps {
  testResult: TestResultData
}

export function AdminTestResultViewer({ testResult }: AdminTestResultViewerProps) {
  const [showCorrectOnly, setShowCorrectOnly] = useState(true) // По умолчанию показываем только ошибки

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-accent'
    if (percentage >= 60) return 'text-primary'
    if (percentage >= 40) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getScoreBg = (percentage: number) => {
    if (percentage >= 80) return 'bg-accent/10 border-accent/20'
    if (percentage >= 60) return 'bg-primary/10 border-primary/20'
    if (percentage >= 40) return 'bg-yellow-500/10 border-yellow-500/20'
    return 'bg-red-500/10 border-red-500/20'
  }

  const filteredQuestions = showCorrectOnly
    ? testResult.questions.filter((q) => !q.isCorrect)
    : testResult.questions

  const errorCount = testResult.questions.filter((q) => !q.isCorrect).length

  return (
    <div className="mt-4 bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Result Summary */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-xl border-2 flex flex-col items-center justify-center ${getScoreBg(testResult.percentage)}`}>
              <span className={`text-xl font-bold ${getScoreColor(testResult.percentage)}`}>
                {testResult.percentage}%
              </span>
            </div>
            <div>
              <div className="font-semibold text-text">
                {testResult.score} из {testResult.totalQuestions}
              </div>
              <div className="text-sm text-text-light">правильных ответов</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-light">Показать:</span>
            <button
              onClick={() => setShowCorrectOnly(false)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                !showCorrectOnly
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-text-light hover:bg-gray-200'
              }`}
            >
              Все ({testResult.questions.length})
            </button>
            <button
              onClick={() => setShowCorrectOnly(true)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                showCorrectOnly
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-text-light hover:bg-gray-200'
              }`}
            >
              Ошибки ({errorCount})
            </button>
          </div>
        </div>
      </div>

      {/* Questions Review */}
      <div className="p-4">
        {filteredQuestions.length > 0 ? (
          <div className="space-y-3">
            {filteredQuestions.map((question, index) => {
              const originalIndex = testResult.questions.indexOf(question)
              return (
                <div
                  key={index}
                  className={`p-4 rounded-xl border-2 ${
                    question.isCorrect
                      ? 'border-accent/30 bg-accent/5'
                      : 'border-red-500/30 bg-red-500/5'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h4 className="font-medium text-text m-0 text-sm">
                      <span className="text-text-light mr-2">#{originalIndex + 1}</span>
                      {question.questionText}
                    </h4>
                    {question.isCorrect ? (
                      <span className="shrink-0 px-2 py-0.5 text-xs font-medium bg-accent/10 text-accent rounded-full">
                        Верно
                      </span>
                    ) : (
                      <span className="shrink-0 px-2 py-0.5 text-xs font-medium bg-red-500/10 text-red-500 rounded-full">
                        Неверно
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-text-light shrink-0">Ответ ученика:</span>
                      <span className={question.isCorrect ? 'text-accent font-medium' : 'text-red-500 font-medium'}>
                        {question.userAnswerDisplay}
                      </span>
                    </div>
                    {!question.isCorrect && (
                      <div className="flex items-start gap-2">
                        <span className="text-text-light shrink-0">Правильный ответ:</span>
                        <span className="text-accent font-medium">{question.correctAnswerDisplay}</span>
                      </div>
                    )}
                  </div>

                  {question.questionType === 'choice' && question.options && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <span className="text-xs text-text-light block mb-1">Варианты:</span>
                      <div className="flex flex-wrap gap-1">
                        {question.options.map((opt, optIndex) => (
                          <span
                            key={optIndex}
                            className={`px-2 py-0.5 text-xs rounded ${
                              opt === question.correctAnswerDisplay
                                ? 'bg-accent/10 text-accent'
                                : opt === question.userAnswerDisplay && !question.isCorrect
                                ? 'bg-red-500/10 text-red-500'
                                : 'bg-gray-100 text-text-light'
                            }`}
                          >
                            {opt}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-center py-6 text-text-light text-sm">
            {showCorrectOnly ? 'Все ответы правильные!' : 'Нет вопросов для отображения'}
          </p>
        )}
      </div>
    </div>
  )
}
