import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import { redirect } from 'next/navigation'
import React from 'react'

import config from '@/payload.config'
import { LogoutButton } from '@/components/auth/LogoutButton'
import { MaterialCard } from '@/components/MaterialCard'
import { verifyToken } from '@/utils/auth'

// Принудительно динамический рендеринг - страница зависит от cookies
export const dynamic = 'force-dynamic'
// Отключаем кэширование данных
export const revalidate = 0

export default async function LKPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('user-token')?.value

  if (!token) {
    redirect('/login')
  }

  // Verify our custom JWT
  const tokenPayload = await verifyToken(token)

  if (!tokenPayload) {
    redirect('/login')
  }

  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // Get user from database
  const userResult = await payload.findByID({
    collection: 'users',
    id: tokenPayload.id,
  })

  if (!userResult) {
    redirect('/login')
  }

  const user = userResult

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
