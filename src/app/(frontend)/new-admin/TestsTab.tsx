'use client'

import { useState, useEffect } from 'react'

interface Student {
  id: number
  name: string
  email: string
}

interface Question {
  questionText: string
  questionType: 'choice' | 'text'
  options?: { text: string; isCorrect: boolean }[]
  correctAnswer?: string
}

interface Test {
  id: number
  title: string
  description?: string | null
  questions: Question[]
  assignedTo: (number | { id: number; name?: string; email: string })[]
  createdAt: string
}

interface TestsTabProps {
  students: Student[]
}

export function TestsTab({ students }: TestsTabProps) {
  const [tests, setTests] = useState<Test[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [selectedStudents, setSelectedStudents] = useState<number[]>([])
  const [submitting, setSubmitting] = useState(false)

  const fetchTests = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/tests')
      if (!response.ok) throw new Error('Failed to fetch tests')
      const data = await response.json()
      setTests(data.docs)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTests()
  }, [])

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: '',
        questionType: 'choice',
        options: [{ text: '', isCorrect: false }],
        correctAnswer: '',
      },
    ])
  }

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const updateQuestion = (index: number, field: keyof Question, value: string | Question['options']) => {
    const updated = [...questions]
    if (field === 'questionType') {
      updated[index] = {
        ...updated[index],
        questionType: value as 'choice' | 'text',
        options: value === 'choice' ? [{ text: '', isCorrect: false }] : undefined,
        correctAnswer: value === 'text' ? '' : undefined,
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (updated[index] as any)[field] = value
    }
    setQuestions(updated)
  }

  const addOption = (questionIndex: number) => {
    const updated = [...questions]
    if (!updated[questionIndex].options) {
      updated[questionIndex].options = []
    }
    updated[questionIndex].options!.push({ text: '', isCorrect: false })
    setQuestions(updated)
  }

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updated = [...questions]
    updated[questionIndex].options = updated[questionIndex].options?.filter((_, i) => i !== optionIndex)
    setQuestions(updated)
  }

  const updateOption = (questionIndex: number, optionIndex: number, field: 'text' | 'isCorrect', value: string | boolean) => {
    const updated = [...questions]
    if (field === 'isCorrect') {
      // Only one option can be correct
      updated[questionIndex].options = updated[questionIndex].options?.map((opt, i) => ({
        ...opt,
        isCorrect: i === optionIndex ? (value as boolean) : false,
      }))
    } else {
      updated[questionIndex].options![optionIndex][field] = value as string
    }
    setQuestions(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || questions.length === 0 || selectedStudents.length === 0) {
      alert('Заполните все обязательные поля')
      return
    }

    // Validate questions
    for (const q of questions) {
      if (!q.questionText) {
        alert('Все вопросы должны иметь текст')
        return
      }
      if (q.questionType === 'choice') {
        if (!q.options || q.options.length < 2) {
          alert('Вопросы с вариантами должны иметь минимум 2 варианта')
          return
        }
        const hasCorrect = q.options.some((o) => o.isCorrect)
        if (!hasCorrect) {
          alert('Выберите правильный ответ для каждого вопроса')
          return
        }
      } else if (!q.correctAnswer) {
        alert('Укажите правильный ответ для текстовых вопросов')
        return
      }
    }

    setSubmitting(true)

    try {
      const response = await fetch('/api/admin/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: description || undefined,
          questions,
          assignedTo: selectedStudents,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create test')
      }

      // Reset form
      setTitle('')
      setDescription('')
      setQuestions([])
      setSelectedStudents([])
      setShowForm(false)
      fetchTests()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка при создании теста')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (testId: number) => {
    if (!confirm('Удалить тест? Все результаты также будут удалены.')) return

    try {
      const response = await fetch(`/api/admin/tests?id=${testId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete test')
      fetchTests()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка удаления')
    }
  }

  const handleStudentToggle = (studentId: number) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    )
  }

  const selectAllStudents = () => setSelectedStudents(students.map((s) => s.id))
  const deselectAllStudents = () => setSelectedStudents([])

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const getAssignedNames = (assignedTo: Test['assignedTo']) => {
    return assignedTo
      .map((item) => {
        if (typeof item === 'number') {
          const student = students.find((s) => s.id === item)
          return student?.name || `ID: ${item}`
        }
        return item.name || item.email
      })
      .join(', ')
  }

  if (loading && tests.length === 0) {
    return (
      <div className="tests-loading">
        <div className="spinner"></div>
        <p>Загрузка тестов...</p>
      </div>
    )
  }

  return (
    <div className="tests-tab">
      <div className="tests-header">
        <h2>Тесты</h2>
        <button onClick={() => setShowForm(!showForm)} className="create-test-btn">
          {showForm ? 'Отмена' : '+ Создать тест'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="test-form">
          <div className="form-group">
            <label>Название теста *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Название теста"
              required
            />
          </div>

          <div className="form-group">
            <label>Описание</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Описание (необязательно)"
              rows={2}
            />
          </div>

          <div className="form-group questions-section">
            <div className="questions-header">
              <label>Вопросы *</label>
              <button type="button" onClick={addQuestion} className="add-question-btn">
                + Добавить вопрос
              </button>
            </div>

            {questions.length === 0 && (
              <p className="no-questions">Добавьте хотя бы один вопрос</p>
            )}

            {questions.map((q, qIndex) => (
              <div key={qIndex} className="question-block">
                <div className="question-header">
                  <span className="question-number">Вопрос {qIndex + 1}</span>
                  <button type="button" onClick={() => removeQuestion(qIndex)} className="remove-btn">
                    Удалить
                  </button>
                </div>

                <div className="question-content">
                  <input
                    type="text"
                    value={q.questionText}
                    onChange={(e) => updateQuestion(qIndex, 'questionText', e.target.value)}
                    placeholder="Текст вопроса"
                    className="question-input"
                  />

                  <select
                    value={q.questionType}
                    onChange={(e) => updateQuestion(qIndex, 'questionType', e.target.value)}
                    className="question-type-select"
                  >
                    <option value="choice">С вариантами ответов</option>
                    <option value="text">Текстовый ответ</option>
                  </select>

                  {q.questionType === 'choice' && (
                    <div className="options-list">
                      {q.options?.map((opt, oIndex) => (
                        <div key={oIndex} className="option-row">
                          <input
                            type="radio"
                            name={`correct-${qIndex}`}
                            checked={opt.isCorrect}
                            onChange={() => updateOption(qIndex, oIndex, 'isCorrect', true)}
                            title="Правильный ответ"
                          />
                          <input
                            type="text"
                            value={opt.text}
                            onChange={(e) => updateOption(qIndex, oIndex, 'text', e.target.value)}
                            placeholder={`Вариант ${oIndex + 1}`}
                            className="option-input"
                          />
                          {q.options!.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeOption(qIndex, oIndex)}
                              className="remove-option-btn"
                            >
                              x
                            </button>
                          )}
                        </div>
                      ))}
                      <button type="button" onClick={() => addOption(qIndex)} className="add-option-btn">
                        + Вариант
                      </button>
                    </div>
                  )}

                  {q.questionType === 'text' && (
                    <input
                      type="text"
                      value={q.correctAnswer || ''}
                      onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                      placeholder="Правильный ответ"
                      className="correct-answer-input"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="form-group">
            <label>Назначить ученикам *</label>
            <div className="students-actions">
              <button type="button" onClick={selectAllStudents} className="select-all-btn">
                Выбрать всех
              </button>
              <button type="button" onClick={deselectAllStudents} className="select-all-btn">
                Снять выбор
              </button>
            </div>
            <div className="students-list">
              {students.map((student) => (
                <label key={student.id} className="student-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student.id)}
                    onChange={() => handleStudentToggle(student.id)}
                  />
                  <span className="student-name">{student.name}</span>
                  <span className="student-email">{student.email}</span>
                </label>
              ))}
              {students.length === 0 && (
                <p className="no-students">Нет зарегистрированных учеников</p>
              )}
            </div>
          </div>

          <button type="submit" disabled={submitting} className="submit-btn">
            {submitting ? 'Создание...' : 'Создать тест'}
          </button>
        </form>
      )}

      {error && <div className="tests-error">{error}</div>}

      {tests.length === 0 && !showForm ? (
        <div className="tests-empty">
          <p>Тестов пока нет</p>
        </div>
      ) : (
        <div className="tests-list">
          {tests.map((test) => (
            <div key={test.id} className="test-item">
              <div className="test-main">
                <h3>{test.title}</h3>
                {test.description && <p className="test-desc">{test.description}</p>}
                <div className="test-meta">
                  <span className="test-date">{formatDate(test.createdAt)}</span>
                  <span className="test-questions">{test.questions?.length || 0} вопросов</span>
                </div>
              </div>
              <div className="test-assigned">
                <span className="assigned-label">Назначено:</span>
                <span className="assigned-names">{getAssignedNames(test.assignedTo || [])}</span>
              </div>
              <div className="test-actions">
                <button onClick={() => handleDelete(test.id)} className="delete-test-btn">
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
