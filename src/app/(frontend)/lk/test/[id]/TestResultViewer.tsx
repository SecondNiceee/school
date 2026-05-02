'use client'

import { useState } from 'react'
import { TestTaker } from '@/components/TestTaker'
import { useRouter } from 'next/navigation'

interface QuestionResult {
  questionText: string
  questionType: 'choice' | 'text'
  options?: string[]
  userAnswer: number | string
  userAnswerDisplay: string
  correctAnswerDisplay: string
  isCorrect: boolean
}

interface TestData {
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
  questions?: QuestionResult[] | null
}

interface TestResultViewerProps {
  test: TestData
  userId: number
}

export function TestResultViewer({ test, userId }: TestResultViewerProps) {
  const router = useRouter()
  const [showTestTaker, setShowTestTaker] = useState(false)
  const [showCorrectOnly, setShowCorrectOnly] = useState(false)

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
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

  const getScoreBg = (percentage: number) => {
    if (percentage >= 80) return 'bg-accent/10 border-accent/20'
    if (percentage >= 60) return 'bg-primary/10 border-primary/20'
    if (percentage >= 40) return 'bg-warning/10 border-warning/20'
    return 'bg-red-500/10 border-red-500/20'
  }

  const handleStartTest = () => {
    setShowTestTaker(true)
  }

  const handleCloseTest = () => {
    setShowTestTaker(false)
  }

  const handleTestComplete = () => {
    setShowTestTaker(false)
    router.refresh()
  }

  const filteredQuestions = showCorrectOnly
    ? test.questions?.filter((q) => !q.isCorrect)
    : test.questions

  if (showTestTaker) {
    return (
      <TestTaker
        testId={test.id}
        onClose={handleCloseTest}
        onComplete={handleTestComplete}
      />
    )
  }

  return (
    <div className="bg-surface rounded-2xl shadow-[0_4px_20px_rgba(99,102,241,0.1)] overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-text m-0">{test.title}</h1>
        {test.description && (
          <p className="text-text-light mt-2 m-0">{test.description}</p>
        )}
        <div className="flex items-center gap-4 mt-3 text-sm text-text-light">
          <span>{test.questionsCount} вопросов</span>
          {test.completed && test.result && (
            <>
              <span>|</span>
              <span>Пройден: {formatDate(test.result.completedAt)}</span>
            </>
          )}
        </div>
      </div>

      {test.completed && test.result ? (
        <>
          {/* Result Summary */}
          <div className="p-6 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-6">
                <div className={`w-24 h-24 rounded-2xl border-2 flex flex-col items-center justify-center ${getScoreBg(test.result.percentage)}`}>
                  <span className={`text-3xl font-bold ${getScoreColor(test.result.percentage)}`}>
                    {test.result.percentage}%
                  </span>
                </div>
                <div>
                  <div className="text-lg font-semibold text-text">
                    {test.result.score} из {test.result.totalQuestions}
                  </div>
                  <div className="text-text-light">правильных ответов</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-light">Показать только:</span>
                <button
                  onClick={() => setShowCorrectOnly(false)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    !showCorrectOnly
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-text-light hover:bg-gray-200'
                  }`}
                >
                  Все
                </button>
                <button
                  onClick={() => setShowCorrectOnly(true)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    showCorrectOnly
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-text-light hover:bg-gray-200'
                  }`}
                >
                  Ошибки
                </button>
              </div>
            </div>
          </div>

          {/* Questions Review */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-text mb-4">Разбор ответов</h2>
            
            {filteredQuestions && filteredQuestions.length > 0 ? (
              <div className="space-y-4">
                {filteredQuestions.map((question, index) => {
                  const originalIndex = test.questions?.indexOf(question) ?? index
                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-xl border-2 ${
                        question.isCorrect
                          ? 'border-accent/30 bg-accent/5'
                          : 'border-red-500/30 bg-red-500/5'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="font-medium text-text m-0">
                          <span className="text-text-light mr-2">#{originalIndex + 1}</span>
                          {question.questionText}
                        </h3>
                        {question.isCorrect ? (
                          <span className="shrink-0 px-3 py-1 text-xs font-medium bg-accent/10 text-accent rounded-full">
                            Верно
                          </span>
                        ) : (
                          <span className="shrink-0 px-3 py-1 text-xs font-medium bg-red-500/10 text-red-500 rounded-full">
                            Неверно
                          </span>
                        )}
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <span className="text-text-light shrink-0">Ваш ответ:</span>
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
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <span className="text-xs text-text-light block mb-2">Варианты:</span>
                          <div className="flex flex-wrap gap-2">
                            {question.options.map((opt, optIndex) => (
                              <span
                                key={optIndex}
                                className={`px-2 py-1 text-xs rounded ${
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
              <p className="text-center py-8 text-text-light">
                {showCorrectOnly ? 'Поздравляем! Все ответы правильные!' : 'Нет вопросов для отображения'}
              </p>
            )}
          </div>
        </>
      ) : (
        /* Not completed - show start button */
        <div className="p-12 text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-text mb-2">Тест ожидает прохождения</h2>
          <p className="text-text-light mb-6">
            Вам назначен этот тест. Нажмите кнопку ниже, чтобы начать.
          </p>
          <button
            onClick={handleStartTest}
            className="py-3 px-8 text-base font-semibold text-white bg-gradient-primary border-none rounded-xl cursor-pointer shadow-primary transition-all duration-200 hover:-translate-y-0.5 hover:shadow-primary-hover"
          >
            Начать тест
          </button>
        </div>
      )}
    </div>
  )
}
