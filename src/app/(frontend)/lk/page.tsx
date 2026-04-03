import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import { redirect } from 'next/navigation'
import React from 'react'

import config from '@/payload.config'
import { LogoutButton } from '@/components/auth/LogoutButton'

// Принудительно динамический рендеринг - страница зависит от cookies
export const dynamic = 'force-dynamic'
// Отключаем кэширование данных
export const revalidate = 0

export default async function LKPage() {
  const cookieStore = await cookies()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  
  // Создаем headers объект из cookies для payload.auth()
  const token = cookieStore.get('payload-token')?.value
  
  if (!token) {
    redirect('/login')
  }
  
  // Создаем Headers объект для payload.auth()
  const headers = new Headers()
  headers.set('cookie', `payload-token=${token}`)
  
  const { user } = await payload.auth({ headers })

  if (!user) {
    redirect('/login')
  }

  const materialsResponse = await payload.find({
    collection: 'materials',
    where: {
      assignedTo: {
        contains: user.id,
      },
    },
    sort: '-createdAt',
  })

  const materials = materialsResponse.docs

  return (
    <div className="lk-page">
      <header className="lk-header">
        <div className="lk-greeting">
          <h1>Приветствую, <span>{user.name || 'друг'}</span>!</h1>
        </div>
        <LogoutButton />
      </header>

      <div className="lk-content">
        <nav className="lk-tabs">
          <button className="lk-tab active">Материалы</button>
        </nav>

        <section className="lk-materials">
          {materials.length === 0 ? (
            <div className="lk-empty">
              <p>У вас пока нет учебных материалов</p>
            </div>
          ) : (
            <div className="materials-list">
              {materials.map((material) => (
                <div key={material.id} className="material-card">
                  <div className="material-icon">
                    {getFileIcon(material.fileName || '')}
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
                    <a
                      href={material.fileUrl}
                      className="material-open"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Открыть
                    </a>
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
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
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
