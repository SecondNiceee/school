'use client'

import { useState, useEffect } from 'react'

interface Question {
  questionText: string
  questionType: 'choice' | 'text'
  options?: { text: string }[]
}

interface Test {
  id: number
  title: string
  description?: string | null
  questions: Question[]
}

interface TestResult {
  score: number
  totalQuestions: number
  percentage: number
}

interface TestTakerProps {
  testId: number
  onClose: () => void
  onComplete: () => void
}

export function TestTaker({ testId, onClose, onComplete }: TestTakerProps) {
  const [test, setTest] = useState<Test | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [answers, setAnswers] = useState<(number | string)[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<TestResult | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await fetch(`/api/tests/${testId}`)
        if (!response.ok) {
          const data = await response.json()
          if (data.error === 'Test already completed') {
            setError('Вы уже прошли этот тест')
            return
          }
          throw new Error(data.error || 'Failed to fetch test')
        }
        const data = await response.json()
        setTest(data)
        setAnswers(new Array(data.questions.length).fill(null))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки теста')
      } finally {
        setLoading(false)
      }
    }

    fetchTest()
  }, [testId])

  const handleAnswerChange = (questionIndex: number, value: number | string) => {
    const newAnswers = [...answers]
    newAnswers[questionIndex] = value
    setAnswers(newAnswers)
  }

  const handleSubmit = async () => {
    if (!test) return

    // Check all questions answered
    const unanswered = answers.findIndex((a) => a === null || a === '')
    if (unanswered !== -1) {
      setCurrentQuestion(unanswered)
      alert(`Ответьте на вопрос ${unanswered + 1}`)
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('/api/tests/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testId,
          answers,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to submit test')
      }

      const data = await response.json()
      setResult({
        score: data.score,
        totalQuestions: data.totalQuestions,
        percentage: data.percentage,
      })
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка отправки')
    } finally {
      setSubmitting(false)
    }
  }

  const handleFinish = () => {
    onComplete()
    onClose()
  }

  const getScoreStyles = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 border-green-500'
    if (percentage >= 60) return 'text-blue-600 border-blue-500'
    if (percentage >= 40) return 'text-yellow-600 border-yellow-500'
    return 'text-red-600 border-red-500'
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1000] p-6">
        <div className="w-full max-w-3xl bg-surface rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-text-light">
            <div className="w-10 h-10 border-[3px] border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="m-0">Загрузка теста...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1000] p-6">
        <div className="w-full max-w-3xl bg-surface rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-center p-6">
            <p className="text-text-light m-0">{error}</p>
            <button 
              onClick={onClose} 
              className="py-3 px-6 text-sm font-medium text-text-light bg-transparent border border-gray-400/30 rounded-lg cursor-pointer transition-colors hover:border-primary hover:text-primary"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (result) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1000] p-6">
        <div className="w-full max-w-3xl bg-surface rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <h2 className="text-2xl font-bold text-text mb-6">Тест завершен!</h2>
            <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center mb-6 ${getScoreStyles(result.percentage)}`}>
              <span className="text-4xl font-bold">{result.percentage}%</span>
            </div>
            <p className="text-text-light mb-8">
              Правильных ответов: {result.score} из {result.totalQuestions}
            </p>
            <button 
              onClick={handleFinish} 
              className="py-3 px-8 text-base font-semibold text-white bg-gradient-primary border-none rounded-xl cursor-pointer shadow-primary transition-all duration-200 hover:-translate-y-0.5 hover:shadow-primary-hover"
            >
              Завершить
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!test) return null

  const question = test.questions[currentQuestion]
  const isLastQuestion = currentQuestion === test.questions.length - 1
  const canProceed = answers[currentQuestion] !== null && answers[currentQuestion] !== ''

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1000] p-6">
      <div className="w-full max-w-3xl max-h-[90vh] bg-surface rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-5 px-6 border-b border-primary/10 shrink-0">
          <h2 className="m-0 text-lg font-semibold text-text truncate">{test.title}</h2>
          <button 
            onClick={onClose} 
            className="w-8 h-8 flex items-center justify-center text-2xl text-text-light bg-transparent border-none rounded-lg cursor-pointer transition-colors hover:bg-primary/10 hover:text-primary"
            title="Закрыть"
          >
            &times;
          </button>
        </div>

        <div className="p-6 shrink-0">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-primary transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / test.questions.length) * 100}%` }}
            />
          </div>
          <span className="text-xs text-text-light">
            Вопрос {currentQuestion + 1} из {test.questions.length}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-6 pt-0">
          <h3 className="text-lg font-medium text-text mb-6">{question.questionText}</h3>

          {question.questionType === 'choice' && question.options && (
            <div className="flex flex-col gap-3">
              {question.options.map((opt, index) => (
                <label 
                  key={index} 
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    answers[currentQuestion] === index 
                      ? 'border-primary bg-primary/5' 
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    checked={answers[currentQuestion] === index}
                    onChange={() => handleAnswerChange(currentQuestion, index)}
                    className="sr-only"
                  />
                  <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    answers[currentQuestion] === index 
                      ? 'border-primary bg-primary' 
                      : 'border-gray-300'
                  }`}>
                    {answers[currentQuestion] === index && (
                      <span className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </span>
                  <span className="text-text">{opt.text}</span>
                </label>
              ))}
            </div>
          )}

          {question.questionType === 'text' && (
            <input
              type="text"
              className="w-full p-4 text-base border-2 border-primary/20 rounded-xl bg-surface text-text outline-none transition-all duration-200 placeholder:text-text-light focus:border-primary focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)]"
              value={answers[currentQuestion] as string || ''}
              onChange={(e) => handleAnswerChange(currentQuestion, e.target.value)}
              placeholder="Введите ваш ответ"
            />
          )}
        </div>

        <div className="flex justify-between items-center p-6 border-t border-primary/10 shrink-0">
          <button
            onClick={() => setCurrentQuestion((prev) => prev - 1)}
            disabled={currentQuestion === 0}
            className="py-2.5 px-5 text-sm font-medium text-text-light bg-transparent border border-gray-300 rounded-lg cursor-pointer transition-all duration-200 hover:not-disabled:border-primary hover:not-disabled:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Назад
          </button>

          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              disabled={!canProceed || submitting}
              className="py-2.5 px-6 text-sm font-semibold text-white bg-accent border-none rounded-lg cursor-pointer shadow-[0_2px_10px_rgba(52,211,153,0.3)] transition-all duration-200 hover:not-disabled:-translate-y-0.5 hover:not-disabled:shadow-[0_4px_15px_rgba(52,211,153,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Отправка...' : 'Завершить тест'}
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion((prev) => prev + 1)}
              disabled={!canProceed}
              className="py-2.5 px-6 text-sm font-semibold text-white bg-gradient-primary border-none rounded-lg cursor-pointer shadow-primary-sm transition-all duration-200 hover:not-disabled:-translate-y-0.5 hover:not-disabled:shadow-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Далее
            </button>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-2 p-4 border-t border-primary/10 shrink-0">
          {test.questions.map((_, index) => (
            <button
              key={index}
              className={`w-8 h-8 text-xs font-medium rounded-full border-none cursor-pointer transition-all duration-200 ${
                index === currentQuestion 
                  ? 'bg-primary text-white' 
                  : answers[index] !== null && answers[index] !== ''
                    ? 'bg-accent text-white'
                    : 'bg-gray-200 text-text-light hover:bg-gray-300'
              }`}
              onClick={() => setCurrentQuestion(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
