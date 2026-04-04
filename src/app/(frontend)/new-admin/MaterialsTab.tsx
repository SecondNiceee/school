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
      <div className="materials-loading">
        <div className="spinner"></div>
        <p>Загрузка материалов...</p>
      </div>
    )
  }

  return (
    <div className="materials-tab">
      <div className="materials-header">
        <h2>Материалы</h2>
        <button onClick={() => setShowForm(!showForm)} className="create-material-btn">
          {showForm ? 'Отмена' : '+ Создать материал'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="material-form">
          <div className="form-group">
            <label>Название *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Название материала"
              required
            />
          </div>

          <div className="form-group">
            <label>Описание</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Описание (необязательно)"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Файл *</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp,.mp4,.webm,.mp3,.wav"
              required
            />
            {file && <span className="file-selected">{file.name}</span>}
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

          {uploading && (
            <div className="upload-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
              </div>
              <span>{uploadProgress}%</span>
            </div>
          )}

          <button type="submit" disabled={uploading} className="submit-btn">
            {uploading ? 'Загрузка...' : 'Создать материал'}
          </button>
        </form>
      )}

      {error && <div className="materials-error">{error}</div>}

      {materials.length === 0 && !showForm ? (
        <div className="materials-empty">
          <p>Материалов пока нет</p>
        </div>
      ) : (
        <div className="materials-list">
          {materials.map((material) => (
            <div key={material.id} className="material-item">
              <div className="material-main">
                <h3>{material.title}</h3>
                {material.description && <p className="material-desc">{material.description}</p>}
                <div className="material-meta">
                  <span className="material-date">{formatDate(material.createdAt)}</span>
                  {material.fileName && (
                    <span className="material-file">{material.fileName}</span>
                  )}
                </div>
              </div>
              <div className="material-assigned">
                <span className="assigned-label">Назначено:</span>
                <span className="assigned-names">{getAssignedNames(material.assignedTo)}</span>
              </div>
              <div className="material-actions">
                <a
                  href={getProxyFileUrl(material.fileUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="material-btn"
                >
                  Открыть
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
