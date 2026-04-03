'use client'

import { useState } from 'react'
import { FileViewer } from './FileViewer'

interface Material {
  id: string | number
  title: string
  description?: string | null
  fileName?: string | null
  fileUrl: string
  fileSize?: number | null
  createdAt: string
}

interface MaterialCardProps {
  material: Material
}

export function MaterialCard({ material }: MaterialCardProps) {
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  
  const fileName = material.fileName || 'file'
  const ext = fileName.split('.').pop()?.toLowerCase() || ''
  
  // Файлы, которые можно просмотреть в нашем viewer
  const canPreview = [
    'ppt', 'pptx', 'doc', 'docx', 'xls', 'xlsx', // Office
    'pdf', // PDF
    'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', // Images
    'mp4', 'webm', 'mov', // Video
    'mp3', 'wav', 'ogg', 'flac', // Audio
  ].includes(ext)

  const handleOpen = () => {
    if (canPreview) {
      setIsViewerOpen(true)
    } else {
      // Для остальных файлов - открываем в новой вкладке
      window.open(material.fileUrl, '_blank')
    }
  }

  return (
    <>
      <div className="material-card">
        <div className="material-icon">
          {getFileIcon(fileName)}
        </div>
        <div className="material-info">
          <h3 className="material-title">{material.title}</h3>
          {material.description && (
            <p className="material-description">{material.description}</p>
          )}
          {material.fileName && (
            <span className="material-filename">
              {material.fileName}
              {material.fileSize && ` (${formatFileSize(material.fileSize)})`}
            </span>
          )}
          <span className="material-date">
            {new Date(material.createdAt).toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>
        <div className="material-actions">
          <button
            onClick={handleOpen}
            className="material-open"
          >
            Открыть
          </button>
          <a
            href={material.fileUrl}
            className="material-download"
            download={material.fileName || 'file'}
            target="_blank"
            rel="noopener noreferrer"
          >
            Скачать
          </a>
        </div>
      </div>
      
      {isViewerOpen && (
        <FileViewer
          fileUrl={material.fileUrl}
          fileName={fileName}
          onClose={() => setIsViewerOpen(false)}
        />
      )}
    </>
  )
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function getFileIcon(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase() || ''
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return '🖼️'
  if (['mp4', 'webm', 'mov', 'avi'].includes(ext)) return '🎬'
  if (['mp3', 'wav', 'ogg', 'flac'].includes(ext)) return '🎵'
  if (ext === 'pdf') return '📄'
  if (['doc', 'docx'].includes(ext)) return '📝'
  if (['xls', 'xlsx'].includes(ext)) return '📊'
  if (['ppt', 'pptx'].includes(ext)) return '📽️'
  return '📁'
}
