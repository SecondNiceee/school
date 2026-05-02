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

  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    field: 'text' | 'isCorrect',
    value: string | boolean
  ) => {
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
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-text-light">Загрузка тестов...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text">Тесты</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            showForm
              ? 'bg-gray-200 text-text-light hover:bg-gray-300'
              : 'bg-primary text-white hover:bg-primary-light'
          }`}
        >
          {showForm ? 'Отмена' : '+ Создать тест'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-surface rounded-xl border border-gray-200 p-6 mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1">Название теста *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Название теста"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1">Описание</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Описание (необязательно)"
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-text">Вопросы *</label>
              <button
                type="button"
                onClick={addQuestion}
                className="px-3 py-1 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
              >
                + Добавить вопрос
              </button>
            </div>

            {questions.length === 0 && (
              <p className="text-center py-4 text-text-light border border-dashed border-gray-300 rounded-lg">
                Добавьте хотя бы один вопрос
              </p>
            )}

            <div className="space-y-4">
              {questions.map((q, qIndex) => (
                <div key={qIndex} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-text">Вопрос {qIndex + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIndex)}
                      className="text-sm text-red-500 hover:text-red-600 transition-colors"
                    >
                      Удалить
                    </button>
                  </div>

                  <div className="space-y-3">
                    <input
                      type="text"
                      value={q.questionText}
                      onChange={(e) => updateQuestion(qIndex, 'questionText', e.target.value)}
                      placeholder="Текст вопроса"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    />

                    <select
                      value={q.questionType}
                      onChange={(e) => updateQuestion(qIndex, 'questionType', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white"
                    >
                      <option value="choice">С вариантами ответов</option>
                      <option value="text">Текстовый ответ</option>
                    </select>

                    {q.questionType === 'choice' && (
                      <div className="space-y-2">
                        {q.options?.map((opt, oIndex) => (
                          <div key={oIndex} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`correct-${qIndex}`}
                              checked={opt.isCorrect}
                              onChange={() => updateOption(qIndex, oIndex, 'isCorrect', true)}
                              title="Правильный ответ"
                              className="w-4 h-4 text-primary"
                            />
                            <input
                              type="text"
                              value={opt.text}
                              onChange={(e) => updateOption(qIndex, oIndex, 'text', e.target.value)}
                              placeholder={`Вариант ${oIndex + 1}`}
                              className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                            />
                            {q.options!.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeOption(qIndex, oIndex)}
                                className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                x
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addOption(qIndex)}
                          className="text-sm text-primary hover:text-primary-light transition-colors"
                        >
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1">Назначить ученикам *</label>
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={selectAllStudents}
                className="px-3 py-1 text-sm text-primary hover:bg-primary/10 rounded transition-colors"
              >
                Выбрать всех
              </button>
              <button
                type="button"
                onClick={deselectAllStudents}
                className="px-3 py-1 text-sm text-text-light hover:bg-gray-100 rounded transition-colors"
              >
                Снять выбор
              </button>
            </div>
            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-1">
              {students.map((student) => (
                <label
                  key={student.id}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                    selectedStudents.includes(student.id) ? 'bg-primary/10' : 'hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student.id)}
                    onChange={() => handleStudentToggle(student.id)}
                    className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                  />
                  <span className="font-medium text-text">{student.name}</span>
                  <span className="text-sm text-text-light">{student.email}</span>
                </label>
              ))}
              {students.length === 0 && (
                <p className="text-center py-4 text-text-light">Нет зарегистрированных учеников</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? 'Создание...' : 'Создать тест'}
          </button>
        </form>
      )}

      {error && <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">{error}</div>}

      {tests.length === 0 && !showForm ? (
        <div className="text-center py-12 text-text-light">
          <p>Тестов пока нет</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tests.map((test) => (
            <div
              key={test.id}
              className="bg-surface rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-text">{test.title}</h3>
                  {test.description && (
                    <p className="text-sm text-text-light mt-1">{test.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2 text-sm text-text-light">
                    <span>{formatDate(test.createdAt)}</span>
                    <span>•</span>
                    <span>{test.questions?.length || 0} вопросов</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(test.id)}
                  className="px-4 py-2 text-red-500 hover:bg-red-50 font-medium rounded-lg transition-colors whitespace-nowrap"
                >
                  Удалить
                </button>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <span className="text-sm font-medium text-text-light">Назначено: </span>
                <span className="text-sm text-text">{getAssignedNames(test.assignedTo || [])}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
