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

  const getScoreClass = (percentage: number) => {
    if (percentage >= 80) return 'score-excellent'
    if (percentage >= 60) return 'score-good'
    if (percentage >= 40) return 'score-average'
    return 'score-poor'
  }

  if (loading) {
    return (
      <div className="test-taker-overlay">
        <div className="test-taker-modal">
          <div className="test-loading">
            <div className="spinner"></div>
            <p>Загрузка теста...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="test-taker-overlay">
        <div className="test-taker-modal">
          <div className="test-error">
            <p>{error}</p>
            <button onClick={onClose} className="close-btn">
              Закрыть
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (result) {
    return (
      <div className="test-taker-overlay">
        <div className="test-taker-modal">
          <div className="test-result-view">
            <h2>Тест завершен!</h2>
            <div className={`result-circle ${getScoreClass(result.percentage)}`}>
              <span className="result-percentage">{result.percentage}%</span>
            </div>
            <p className="result-text">
              Правильных ответов: {result.score} из {result.totalQuestions}
            </p>
            <button onClick={handleFinish} className="finish-btn">
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
    <div className="test-taker-overlay">
      <div className="test-taker-modal">
        <div className="test-taker-header">
          <h2>{test.title}</h2>
          <button onClick={onClose} className="close-test-btn" title="Закрыть">
            &times;
          </button>
        </div>

        <div className="test-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((currentQuestion + 1) / test.questions.length) * 100}%` }}
            ></div>
          </div>
          <span className="progress-text">
            Вопрос {currentQuestion + 1} из {test.questions.length}
          </span>
        </div>

        <div className="question-view">
          <h3 className="question-text">{question.questionText}</h3>

          {question.questionType === 'choice' && question.options && (
            <div className="options-view">
              {question.options.map((opt, index) => (
                <label key={index} className={`option-label ${answers[currentQuestion] === index ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    checked={answers[currentQuestion] === index}
                    onChange={() => handleAnswerChange(currentQuestion, index)}
                  />
                  <span className="option-text">{opt.text}</span>
                </label>
              ))}
            </div>
          )}

          {question.questionType === 'text' && (
            <input
              type="text"
              className="text-answer-input"
              value={answers[currentQuestion] as string || ''}
              onChange={(e) => handleAnswerChange(currentQuestion, e.target.value)}
              placeholder="Введите ваш ответ"
            />
          )}
        </div>

        <div className="test-navigation">
          <button
            onClick={() => setCurrentQuestion((prev) => prev - 1)}
            disabled={currentQuestion === 0}
            className="nav-btn prev-btn"
          >
            Назад
          </button>

          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              disabled={!canProceed || submitting}
              className="nav-btn submit-btn"
            >
              {submitting ? 'Отправка...' : 'Завершить тест'}
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion((prev) => prev + 1)}
              disabled={!canProceed}
              className="nav-btn next-btn"
            >
              Далее
            </button>
          )}
        </div>

        <div className="questions-dots">
          {test.questions.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentQuestion ? 'active' : ''} ${answers[index] !== null && answers[index] !== '' ? 'answered' : ''}`}
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
