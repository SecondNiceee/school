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
    <div className="min-h-screen p-8 bg-background">
      <header className="flex justify-between items-center max-w-[1200px] mx-auto mb-10 p-5 px-6 bg-surface rounded-2xl shadow-[0_4px_20px_rgba(99,102,241,0.1)] max-sm:flex-col max-sm:gap-4 max-sm:text-center">
        <div>
          <h1 className="m-0 text-[28px] text-text">
            Приветствую, <span className="text-gradient-primary">{user.name || 'друг'}</span>!
          </h1>
        </div>
        <LogoutButton />
      </header>

      <LKTabs materials={materials} MaterialCard={MaterialCard} />
    </div>
  )
}
