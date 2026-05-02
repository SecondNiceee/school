import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import { redirect } from 'next/navigation'
import config from '@/payload.config'
import { AdminTabs } from './AdminTabs'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function NewAdminPage() {
  const cookieStore = await cookies()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // Check admin auth via Payload
  let admin = null
  try {
    const result = await payload.auth({
      headers: new Headers({ cookie: cookieStore.toString() }),
    })
    if (result.user?.collection === 'admins') {
      admin = result.user
    }
  } catch {
    // Not authenticated
  }

  if (!admin) {
    redirect('/admin')
  }

  // Fetch all users (students)
  const usersResponse = await payload.find({
    collection: 'users',
    where: {
      role: { equals: 'user' },
    },
    limit: 1000,
    sort: 'name',
  })

  const students = usersResponse.docs.map((user) => ({
    id: user.id,
    name: user.name || user.email,
    email: user.email,
  }))

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-surface border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Панель управления</h1>
        <a
          href="/admin"
          className="px-4 py-2 text-sm font-medium text-primary hover:text-primary-light transition-colors"
        >
          Payload Admin
        </a>
      </header>
      <AdminTabs students={students} />
    </div>
  )
}
