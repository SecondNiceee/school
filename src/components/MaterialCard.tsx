'use client'

import { useState } from 'react'
import { FileViewer } from './FileViewer'
import { getProxyFileUrl } from '@/lib/fileUrl'

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
  
  // PDF и неподдерживаемые форматы — сразу в новую вкладку
  const openInNewTab = [
    'pdf',
  ].includes(ext)

  // Файлы, которые открываются в нашем viewer (только Office + медиа)
  const canPreview = [
    'ppt', 'pptx', 'doc', 'docx', 'xls', 'xlsx', // Office
    'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', // Images
    'mp4', 'webm', 'mov', // Video
    'mp3', 'wav', 'ogg', 'flac', // Audio
  ].includes(ext)

  // Используем прокси URL для обхода блокировок
  const proxyUrl = getProxyFileUrl(material.fileUrl)

  const handleOpen = () => {
    if (openInNewTab || !canPreview) {
      // PDF и остальные — открываем в новой вкладке на весь экран
      window.open(proxyUrl, '_blank', 'noopener,noreferrer')
    } else {
      setIsViewerOpen(true)
    }
  }

  return (
    <>
      <div className="flex items-center gap-4 p-4 px-5 bg-background rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(99,102,241,0.15)] max-sm:flex-col max-sm:text-center">
        <div className="text-[32px] shrink-0">
          {getFileIcon(fileName)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="m-0 text-base font-semibold text-text">{material.title}</h3>
          {material.description && (
            <p className="m-0 text-sm text-text-light line-clamp-2">{material.description}</p>
          )}
          {material.fileName && (
            <span className="block text-xs text-primary font-mono mb-0 break-all">
              {material.fileName}
              {material.fileSize && ` (${formatFileSize(material.fileSize)})`}
            </span>
          )}
          <span className="text-xs text-text-light opacity-70">
            {new Date(material.createdAt).toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>
        <div className="flex gap-2 shrink-0 max-sm:w-full max-sm:justify-center">
          <button
            onClick={handleOpen}
            className="py-2.5 px-5 text-sm font-medium text-primary bg-transparent border-2 border-primary rounded-lg no-underline transition-all duration-200 cursor-pointer hover:bg-primary hover:text-white"
          >
            Открыть
          </button>
          <a
            href={proxyUrl}
            className="shrink-0 py-2.5 px-5 text-sm font-medium text-white bg-gradient-primary rounded-lg no-underline transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(99,102,241,0.4)]"
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
          fileUrl={proxyUrl}
          originalUrl={material.fileUrl}
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
