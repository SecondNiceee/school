import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import { redirect } from 'next/navigation'
import React from 'react'
import Link from 'next/link'

import config from '@/payload.config'

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Б'
  const k = 1024
  const sizes = ['Б', 'КБ', 'МБ', 'ГБ']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

function getFileIcon(mimeType: string | null | undefined): string {
  if (!mimeType) return '📄'
  if (mimeType.startsWith('image/')) return '🖼️'
  if (mimeType.startsWith('video/')) return '🎬'
  if (mimeType.startsWith('audio/')) return '🎵'
  if (mimeType.includes('pdf')) return '📕'
  if (mimeType.includes('word') || mimeType.includes('document')) return '📝'
  if (mimeType.includes('sheet') || mimeType.includes('excel')) return '📊'
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return '📽️'
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('archive')) return '📦'
  return '📄'
}

export default async function LKPage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  // Если пользователь не залогинен - редирект на главную
  if (!user) {
    redirect('/')
  }

  // Получаем файлы пользователя
  const { docs: userFiles } = await payload.find({
    collection: 'user-files',
    where: {
      user: {
        equals: user.id,
      },
    },
    sort: '-createdAt',
  })

  return (
    <div className="lk-page">
      <header className="lk-header">
        <div className="lk-greeting">
          <h1>Приветствую, <span>{user.name || 'друг'}</span>!</h1>
        </div>
        <Link href="/api/users/logout" className="lk-logout">
          Выйти
        </Link>
      </header>

      <main className="lk-content">
        <section className="lk-files-section">
          <h2>Мои материалы</h2>
          
          {userFiles.length === 0 ? (
            <div className="lk-files-empty">
              <p>У вас пока нет материалов</p>
              <span>Преподаватель добавит их позже</span>
            </div>
          ) : (
            <div className="lk-files-list">
              {userFiles.map((file) => (
                <div key={file.id} className="lk-file-card">
                  <div className="lk-file-icon">
                    {getFileIcon(file.mimeType)}
                  </div>
                  <div className="lk-file-info">
                    <h3>{file.filename}</h3>
                    {file.description && <p>{file.description}</p>}
                    <span className="lk-file-meta">
                      {formatFileSize(file.fileSize || 0)} • {new Date(file.createdAt).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                  <a 
                    href={`/api/files/download?id=${file.id}`}
                    className="lk-file-download"
                    download
                  >
                    Скачать
                  </a>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
