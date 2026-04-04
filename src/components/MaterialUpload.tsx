'use client'

import React, { useState, useRef } from 'react'
import { useField } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'

export const MaterialUploadField: TextFieldClientComponent = ({ path }) => {
  const { value, setValue } = useField<string>({ path: path || 'fileUrl' })
  const fileNameField = useField<string>({ path: 'fileName' })
  const fileSizeField = useField<string>({ path: 'fileSize' })
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle file selection (no upload yet)
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setSelectedFile(file)
    setError(null)
  }

  // Upload file to blob storage only when button is clicked
  const handleUpload = async () => {
    if (!selectedFile) return
    
    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch('/api/materials/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      setValue(data.url)
      fileNameField.setValue(data.fileName)
      fileSizeField.setValue(String(data.fileSize))
      setSelectedFile(null)
    } catch (err) {
      setError('Ошибка загрузки файла')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const clearFile = () => {
    setSelectedFile(null)
    setValue('')
    fileNameField.setValue('')
    fileSizeField.setValue('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
        Файл материала *
      </label>
      
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        disabled={uploading}
        style={{ marginBottom: '0.5rem' }}
      />
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {selectedFile && !value && (
        <div style={{ marginTop: '0.5rem', padding: '0.75rem', backgroundColor: '#f5f5f5', borderRadius: '4px', border: '1px solid #ddd' }}>
          <p style={{ color: '#333', margin: 0 }}>
            Выбран: <strong>{selectedFile.name}</strong> ({(selectedFile.size / 1024).toFixed(1)} KB)
          </p>
          <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
            <button 
              type="button" 
              onClick={handleUpload}
              disabled={uploading}
              style={{ 
                padding: '0.5rem 1rem', 
                cursor: uploading ? 'not-allowed' : 'pointer',
                backgroundColor: '#0070f3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontWeight: 500,
              }}
            >
              {uploading ? 'Загрузка...' : 'Загрузить файл'}
            </button>
            <button 
              type="button" 
              onClick={clearFile}
              disabled={uploading}
              style={{ 
                padding: '0.5rem 1rem', 
                cursor: 'pointer',
                backgroundColor: '#eee',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            >
              Отмена
            </button>
          </div>
        </div>
      )}
      
      {value && (
        <div style={{ marginTop: '0.5rem', padding: '0.75rem', backgroundColor: '#e8f5e9', borderRadius: '4px', border: '1px solid #c8e6c9' }}>
          <p style={{ color: '#2e7d32', margin: 0, fontWeight: 500 }}>Файл загружен</p>
          <div style={{ marginTop: '0.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <a 
              href={value} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#0070f3', textDecoration: 'underline' }}
            >
              Открыть файл
            </a>
            <button 
              type="button" 
              onClick={clearFile}
              style={{ 
                padding: '0.25rem 0.5rem', 
                cursor: 'pointer',
                backgroundColor: 'transparent',
                border: '1px solid #999',
                borderRadius: '4px',
                fontSize: '0.875rem',
              }}
            >
              Заменить файл
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MaterialUploadField
