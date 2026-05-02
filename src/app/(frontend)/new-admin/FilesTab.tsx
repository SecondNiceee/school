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
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-text-light">Загрузка файлов...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <p className="text-red-500">Ошибка: {error}</p>
        <button
          onClick={() => fetchFiles(undefined, true)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
        >
          Повторить
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text">Файлы в хранилище</h2>
        <span className="text-sm text-text-light">Страница {page}</span>
      </div>

      {files.length === 0 ? (
        <div className="text-center py-12 text-text-light">
          <p>Файлов пока нет</p>
        </div>
      ) : (
        <>
          <div className="bg-surface rounded-xl border border-gray-200 divide-y divide-gray-100">
            {files.map((file) => (
              <div key={file.url} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                <div className="text-2xl">{getFileIcon(getFileName(file.pathname))}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-text truncate">{getFileName(file.pathname)}</p>
                  <p className="text-sm text-text-light">
                    {formatSize(file.size)} • {formatDate(file.uploadedAt)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <a
                    href={getProxyFileUrl(file.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  >
                    Открыть
                  </a>
                  <a
                    href={getProxyFileUrl(file.url)}
                    download={getFileName(file.pathname)}
                    className="px-3 py-1.5 text-sm font-medium text-accent hover:bg-accent/10 rounded-lg transition-colors"
                  >
                    Скачать
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-6">
            <button
              onClick={handlePrevPage}
              disabled={page === 1 || loading}
              className="px-4 py-2 text-sm font-medium text-text-light hover:text-text disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              В начало
            </button>
            <span className="text-sm text-text-light">Страница {page}</span>
            <button
              onClick={handleNextPage}
              disabled={!hasMore || loading}
              className="px-4 py-2 text-sm font-medium text-primary hover:text-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
