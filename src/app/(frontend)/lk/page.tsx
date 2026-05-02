import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import { redirect } from 'next/navigation'
import React from 'react'

import config from '@/payload.config'
import { LogoutButton } from '@/components/auth/LogoutButton'
import { MaterialCard } from '@/components/MaterialCard'
import { verifyToken } from '@/utils/auth'
import { LKTabs } from './LKTabs'

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

  const materials = materialsResponse.docs.map((m) => ({
    id: m.id,
    title: m.title,
    description: m.description,
    fileName: m.fileName,
    fileUrl: m.fileUrl,
    fileSize: m.fileSize,
    createdAt: m.createdAt,
  }))

  return (
    <div className="lk-page">
      <header className="lk-header">
        <div className="lk-greeting">
          <h1>Приветствую, <span>{user.name || 'друг'}</span>!</h1>
        </div>
        <LogoutButton />
      </header>

      <LKTabs materials={materials} MaterialCard={MaterialCard} />
    </div>
  )
}
