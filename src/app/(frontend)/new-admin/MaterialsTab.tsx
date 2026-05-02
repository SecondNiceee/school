'use client'

import { useState, useEffect } from 'react'
import { upload } from '@vercel/blob/client'
import { getProxyFileUrl } from '@/lib/fileUrl'

interface Student {
  id: number
  name: string
  email: string
}

interface Material {
  id: number
  title: string
  description?: string | null
  fileUrl: string
  fileName?: string | null
  fileSize?: number | null
  assignedTo: (number | { id: number; name?: string; email: string })[]
  createdAt: string
}

interface MaterialsTabProps {
  students: Student[]
}

export function MaterialsTab({ students }: MaterialsTabProps) {
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Create form state
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [selectedStudents, setSelectedStudents] = useState<number[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const fetchMaterials = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/materials')
      if (!response.ok) throw new Error('Failed to fetch materials')
      const data = await response.json()
      setMaterials(data.docs)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMaterials()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !title || selectedStudents.length === 0) {
      alert('Заполните все обязательные поля')
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      // Upload file to Vercel Blob
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/materials/upload',
        onUploadProgress: (progress) => {
          setUploadProgress(Math.round(progress.percentage))
        },
      })

      // Create material in Payload
      const response = await fetch('/api/admin/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: description || undefined,
          fileUrl: blob.url,
          fileName: file.name,
          fileSize: file.size,
          assignedTo: selectedStudents,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create material')
      }

      // Reset form and refresh list
      setTitle('')
      setDescription('')
      setFile(null)
      setSelectedStudents([])
      setShowForm(false)
      fetchMaterials()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка при создании материала')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleStudentToggle = (studentId: number) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    )
  }

  const selectAllStudents = () => {
    setSelectedStudents(students.map((s) => s.id))
  }

  const deselectAllStudents = () => {
    setSelectedStudents([])
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const getAssignedNames = (assignedTo: Material['assignedTo']) => {
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

  if (loading && materials.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-text-light">Загрузка материалов...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text">Материалы</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            showForm
              ? 'bg-gray-200 text-text-light hover:bg-gray-300'
              : 'bg-primary text-white hover:bg-primary-light'
          }`}
        >
          {showForm ? 'Отмена' : '+ Создать материал'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-surface rounded-xl border border-gray-200 p-6 mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1">Название *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Название материала"
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
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1">Файл *</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp,.mp4,.webm,.mp3,.wav"
              required
              className="w-full text-sm text-text-light file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-medium hover:file:bg-primary/20 file:cursor-pointer"
            />
            {file && <span className="block mt-1 text-sm text-accent">{file.name}</span>}
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

          {uploading && (
            <div className="space-y-2">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <span className="text-sm text-text-light">{uploadProgress}%</span>
            </div>
          )}

          <button
            type="submit"
            disabled={uploading}
            className="w-full py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? 'Загрузка...' : 'Создать материал'}
          </button>
        </form>
      )}

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">{error}</div>
      )}

      {materials.length === 0 && !showForm ? (
        <div className="text-center py-12 text-text-light">
          <p>Материалов пока нет</p>
        </div>
      ) : (
        <div className="space-y-4">
          {materials.map((material) => (
            <div
              key={material.id}
              className="bg-surface rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-text">{material.title}</h3>
                  {material.description && (
                    <p className="text-sm text-text-light mt-1">{material.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2 text-sm text-text-light">
                    <span>{formatDate(material.createdAt)}</span>
                    {material.fileName && (
                      <>
                        <span>•</span>
                        <span>{material.fileName}</span>
                      </>
                    )}
                  </div>
                </div>
                <a
                  href={getProxyFileUrl(material.fileUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-primary/10 text-primary font-medium rounded-lg hover:bg-primary/20 transition-colors whitespace-nowrap"
                >
                  Открыть
                </a>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <span className="text-sm font-medium text-text-light">Назначено: </span>
                <span className="text-sm text-text">{getAssignedNames(material.assignedTo)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
