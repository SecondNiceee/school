import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import { redirect } from 'next/navigation'
import React from 'react'
import Link from 'next/link'

import config from '@/payload.config'
import type { Material } from '@/payload-types'

export default async function LKPage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  // Если пользователь не залогинен - редирект на главную
  if (!user) {
    redirect('/')
  }

  // Получаем материалы, назначенные текущему пользователю
  const materialsResponse = await payload.find({
    collection: 'materials',
    where: {
      assignedTo: {
        contains: user.id,
      },
    },
    sort: '-createdAt',
  })

  const materials = materialsResponse.docs as Material[]

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
                    {getFileIcon(material.mimeType || '')}
                  </div>
                  <div className="material-info">
                    <h3 className="material-title">{material.title}</h3>
                    {material.description && (
                      <p className="material-description">{material.description}</p>
                    )}
                    <span className="material-date">
                      {new Date(material.createdAt).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <a
                    href={material.url || '#'}
                    className="material-download"
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Скачать
                  </a>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function getFileIcon(mimeType: string): string {
  if (mimeType.startsWith('image/')) return '🖼️'
  if (mimeType.startsWith('video/')) return '🎬'
  if (mimeType.startsWith('audio/')) return '🎵'
  if (mimeType.includes('pdf')) return '📄'
  if (mimeType.includes('word') || mimeType.includes('document')) return '📝'
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊'
  if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return '📽️'
  return '📁'
}
