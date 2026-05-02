'use client'

import { useState } from 'react'

interface FileViewerProps {
  fileUrl: string
  originalUrl?: string // Оригинальный URL для Office Viewer
  fileName: string
  onClose: () => void
}

export function FileViewer({ fileUrl, originalUrl, fileName, onClose }: FileViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  
  const ext = fileName.split('.').pop()?.toLowerCase() || ''
  
  // Определяем тип файла
  const isOfficeFile = ['ppt', 'pptx', 'doc', 'docx', 'xls', 'xlsx'].includes(ext)
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)
  const isVideo = ['mp4', 'webm', 'mov'].includes(ext)
  const isAudio = ['mp3', 'wav', 'ogg', 'flac'].includes(ext)
  
  // Для Office файлов используем Microsoft Office Online Viewer
  // Требуется публичный URL файла (прокси не подойдет)
  const getViewerUrl = () => {
    if (isOfficeFile) {
      // Microsoft Office Online Viewer требует публичный URL
      const publicUrl = originalUrl || fileUrl
      const encodedUrl = encodeURIComponent(publicUrl)
      return `https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`
    }
    return fileUrl
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setError(true)
  }

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1000] p-6"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-[1200px] h-[90vh] max-h-[900px] bg-surface rounded-2xl flex flex-col overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center py-4 px-6 border-b border-primary/10 shrink-0">
          <h3 className="m-0 text-base font-semibold text-text truncate">{fileName}</h3>
          <button 
            className="p-2 bg-transparent border-none text-text-light cursor-pointer rounded-lg transition-all duration-200 hover:bg-primary/10 hover:text-primary"
            onClick={onClose} 
            aria-label="Закрыть"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 relative overflow-hidden bg-slate-100">
          {isLoading && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4 text-text-light">
              <div className="w-10 h-10 border-[3px] border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="m-0">Загрузка файла...</p>
            </div>
          )}
          
          {error && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4 text-center text-text-light">
              <p className="m-0">Не удалось загрузить файл</p>
              <a 
                href={fileUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="py-2.5 px-5 text-sm font-medium text-primary bg-transparent border-2 border-primary rounded-lg no-underline transition-all duration-200 hover:bg-primary hover:text-white"
              >
                Открыть в новой вкладке
              </a>
            </div>
          )}
          
          {isOfficeFile && !error && (
            <iframe
              src={getViewerUrl()}
              className="w-full h-full border-none"
              onLoad={handleLoad}
              onError={handleError}
              title={fileName}
              allowFullScreen
            />
          )}
          
          {isImage && !error && (
            <img
              src={fileUrl}
              alt={fileName}
              className="max-w-full max-h-full object-contain absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              onLoad={handleLoad}
              onError={handleError}
            />
          )}
          
          {isVideo && !error && (
            <video
              src={fileUrl}
              controls
              className="max-w-full max-h-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              onLoadedData={handleLoad}
              onError={handleError}
            />
          )}
          
          {isAudio && !error && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-6 p-8 bg-surface rounded-2xl">
              <div className="text-6xl">🎵</div>
              <audio
                src={fileUrl}
                controls
                className="w-[300px]"
                onLoadedData={handleLoad}
                onError={handleError}
              />
            </div>
          )}
          
          {!isOfficeFile && !isImage && !isVideo && !isAudio && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4 text-center text-text-light">
              <p className="m-0">Предпросмотр недоступен для этого типа файла</p>
              <a 
                href={fileUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="py-2.5 px-5 text-sm font-medium text-primary bg-transparent border-2 border-primary rounded-lg no-underline transition-all duration-200 hover:bg-primary hover:text-white"
              >
                Открыть в новой вкладке
              </a>
            </div>
          )}
        </div>
        
        <div className="py-4 px-6 border-t border-primary/10 shrink-0 flex justify-center">
          <a
            href={fileUrl}
            download={fileName}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-6 text-sm font-medium text-white bg-gradient-primary rounded-lg no-underline transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(99,102,241,0.4)]"
          >
            Скачать файл
          </a>
        </div>
      </div>
    </div>
  )
}
