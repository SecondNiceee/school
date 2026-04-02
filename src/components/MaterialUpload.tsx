'use client'

import React, { useState } from 'react'
import { useField } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'

export const MaterialUploadField: TextFieldClientComponent = ({ path }) => {
  const { value, setValue } = useField<string>({ path: path || 'fileUrl' })
  const fileNameField = useField<string>({ path: 'fileName' })
  const fileSizeField = useField<string>({ path: 'fileSize' })
  
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

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
      fileSizeField.setValue(data.fileSize)
    } catch (err) {
      setError('Ошибка загрузки файла')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
        Файл материала
      </label>
      
      <input
        type="file"
        onChange={handleUpload}
        disabled={uploading}
        style={{ marginBottom: '0.5rem' }}
      />
      
      {uploading && <p style={{ color: '#666' }}>Загрузка...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {value && (
        <div style={{ marginTop: '0.5rem' }}>
          <p style={{ color: 'green', margin: 0 }}>Файл загружен</p>
          <a 
            href={value} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#0070f3', textDecoration: 'underline' }}
          >
            Открыть файл
          </a>
        </div>
      )}
    </div>
  )
}

export default MaterialUploadField
