'use client'

import { useState, useEffect } from 'react'
import { getProxyFileUrl } from '@/lib/fileUrl'

interface BlobFile {
  url: string
  pathname: string
  size: number
  uploadedAt: string
}

interface BlobListResponse {
  blobs: BlobFile[]
  cursor?: string
  hasMore: boolean
}

export function FilesTab() {
  const [files, setFiles] = useState<BlobFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cursor, setCursor] = useState<string | undefined>(undefined)
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)

  const fetchFiles = async (cursorParam?: string, reset = false) => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({ limit: '10' })
      if (cursorParam) {
        params.set('cursor', cursorParam)
      }

      const response = await fetch(`/api/admin/files?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch files')
      }

      const data: BlobListResponse = await response.json()

      if (reset) {
        setFiles(data.blobs)
      } else {
        setFiles(data.blobs)
      }
      setCursor(data.cursor)
      setHasMore(data.hasMore)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFiles(undefined, true)
  }, [])

  const handleNextPage = () => {
    if (cursor && hasMore) {
      setPage((p) => p + 1)
      fetchFiles(cursor)
    }
  }

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(1)
      fetchFiles(undefined, true)
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getFileName = (pathname: string) => {
    return pathname.split('/').pop() || pathname
  }

  if (loading && files.length === 0) {
    return (
      <div className="files-loading">
        <div className="spinner"></div>
        <p>Загрузка файлов...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="files-error">
        <p>Ошибка: {error}</p>
        <button onClick={() => fetchFiles(undefined, true)}>Повторить</button>
      </div>
    )
  }

  return (
    <div className="files-tab">
      <div className="files-header">
        <h2>Файлы в хранилище</h2>
        <span className="files-count">Страница {page}</span>
      </div>

      {files.length === 0 ? (
        <div className="files-empty">
          <p>Файлов пока нет</p>
        </div>
      ) : (
        <>
          <div className="files-list">
            {files.map((file) => (
              <div key={file.url} className="file-item">
                <div className="file-icon">
                  {getFileIcon(getFileName(file.pathname))}
                </div>
                <div className="file-info">
                  <span className="file-name">{getFileName(file.pathname)}</span>
                  <span className="file-meta">
                    {formatSize(file.size)} • {formatDate(file.uploadedAt)}
                  </span>
                </div>
                <div className="file-actions">
                  <a
                    href={getProxyFileUrl(file.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="file-btn view"
                  >
                    Открыть
                  </a>
                  <a
                    href={getProxyFileUrl(file.url)}
                    download={getFileName(file.pathname)}
                    className="file-btn download"
                  >
                    Скачать
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="files-pagination">
            <button
              onClick={handlePrevPage}
              disabled={page === 1 || loading}
              className="pagination-btn"
            >
              В начало
            </button>
            <span className="pagination-info">Страница {page}</span>
            <button
              onClick={handleNextPage}
              disabled={!hasMore || loading}
              className="pagination-btn"
            >
              Далее
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function getFileIcon(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'pdf':
      return '📄'
    case 'doc':
    case 'docx':
      return '📝'
    case 'ppt':
    case 'pptx':
      return '📊'
    case 'xls':
    case 'xlsx':
      return '📈'
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
      return '🖼️'
    case 'mp4':
    case 'webm':
    case 'mov':
      return '🎬'
    case 'mp3':
    case 'wav':
    case 'ogg':
      return '🎵'
    default:
      return '📁'
  }
}
