'use client'

import React, { useState } from 'react'
import { useField } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'
import { upload } from '@vercel/blob/client'

export const MaterialUploadField: TextFieldClientComponent = ({ path }) => {
  const { value, setValue } = useField<string>({ path: path || 'fileUrl' })
  const fileNameField = useField<string>({ path: 'fileName' })
  const fileSizeField = useField<string>({ path: 'fileSize' })
  
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)
    setProgress(0)

    try {
      // Client-side upload напрямую в Blob Storage
      // Это обходит лимит 4.5MB Vercel Serverless Functions
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/materials/upload',
        onUploadProgress: (progressEvent) => {
          setProgress(Math.round((progressEvent.loaded / progressEvent.total) * 100))
        },
      })

      setValue(blob.url)
      fileNameField.setValue(file.name)
      fileSizeField.setValue(String(file.size))
    } catch (err) {
      setError('Ошибка загрузки файла')
      console.error(err)
    } finally {
      setUploading(false)
      setProgress(0)
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
      
      {uploading && (
        <div style={{ marginTop: '0.5rem' }}>
          <p style={{ color: '#666', margin: 0 }}>Загрузка... {progress}%</p>
          <div style={{ 
            width: '100%', 
            height: '4px', 
            backgroundColor: '#e0e0e0', 
            borderRadius: '2px',
            marginTop: '4px'
          }}>
            <div style={{ 
              width: `${progress}%`, 
              height: '100%', 
              backgroundColor: '#0070f3',
              borderRadius: '2px',
              transition: 'width 0.2s'
            }} />
          </div>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {value && !uploading && (
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
