import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import { redirect } from 'next/navigation'
import React from 'react'

import config from '@/payload.config'
import { LogoutButton } from '@/components/auth/LogoutButton'
import { MaterialCard } from '@/components/MaterialCard'

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
                <MaterialCard
                  key={material.id}
                  material={{
                    id: material.id,
                    title: material.title,
                    description: material.description,
                    fileName: material.fileName,
                    fileUrl: material.fileUrl,
                    fileSize: material.fileSize,
                    createdAt: material.createdAt,
                  }}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
