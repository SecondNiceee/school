'use client'

import { useState } from 'react'

interface FileViewerProps {
  fileUrl: string
  fileName: string
  onClose: () => void
}

export function FileViewer({ fileUrl, fileName, onClose }: FileViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  
  const ext = fileName.split('.').pop()?.toLowerCase() || ''
  
  // Определяем тип файла
  const isOfficeFile = ['ppt', 'pptx', 'doc', 'docx', 'xls', 'xlsx'].includes(ext)
  const isPdf = ext === 'pdf'
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)
  const isVideo = ['mp4', 'webm', 'mov'].includes(ext)
  const isAudio = ['mp3', 'wav', 'ogg', 'flac'].includes(ext)
  
  // Для Office файлов используем Microsoft Office Online Viewer
  // Требуется публичный URL файла
  const getViewerUrl = () => {
    if (isOfficeFile) {
      // Microsoft Office Online Viewer
      const encodedUrl = encodeURIComponent(fileUrl)
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
    <div className="file-viewer-overlay" onClick={onClose}>
      <div className="file-viewer-modal" onClick={(e) => e.stopPropagation()}>
        <div className="file-viewer-header">
          <h3 className="file-viewer-title">{fileName}</h3>
          <button className="file-viewer-close" onClick={onClose} aria-label="Закрыть">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="file-viewer-content">
          {isLoading && (
            <div className="file-viewer-loading">
              <div className="file-viewer-spinner" />
              <p>Загрузка файла...</p>
            </div>
          )}
          
          {error && (
            <div className="file-viewer-error">
              <p>Не удалось загрузить файл</p>
              <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="file-viewer-fallback">
                Открыть в новой вкладке
              </a>
            </div>
          )}
          
          {(isOfficeFile || isPdf) && !error && (
            <iframe
              src={getViewerUrl()}
              className="file-viewer-iframe"
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
              className="file-viewer-image"
              onLoad={handleLoad}
              onError={handleError}
            />
          )}
          
          {isVideo && !error && (
            <video
              src={fileUrl}
              controls
              className="file-viewer-video"
              onLoadedData={handleLoad}
              onError={handleError}
            />
          )}
          
          {isAudio && !error && (
            <div className="file-viewer-audio-container">
              <div className="file-viewer-audio-icon">🎵</div>
              <audio
                src={fileUrl}
                controls
                className="file-viewer-audio"
                onLoadedData={handleLoad}
                onError={handleError}
              />
            </div>
          )}
          
          {!isOfficeFile && !isPdf && !isImage && !isVideo && !isAudio && (
            <div className="file-viewer-unsupported">
              <p>Предпросмотр недоступен для этого типа файла</p>
              <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="file-viewer-fallback">
                Открыть в новой вкладке
              </a>
            </div>
          )}
        </div>
        
        <div className="file-viewer-footer">
          <a
            href={fileUrl}
            download={fileName}
            target="_blank"
            rel="noopener noreferrer"
            className="file-viewer-download"
          >
            Скачать файл
          </a>
        </div>
      </div>
    </div>
  )
}
