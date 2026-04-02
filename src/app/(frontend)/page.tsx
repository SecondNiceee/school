import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import React from 'react'
import Link from 'next/link'

import config from '@/payload.config'
import './styles.css'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  return (
    <div className="home">
      <div className="content">
        {user ? (
          <>
            <h1>Добро пожаловать!</h1>
            <div className="user-info">
              <p className="user-name">{user.name || 'Пользователь'}</p>
              <p className="user-email">{user.email}</p>
            </div>
            <div className="links">
              <Link href="/api/users/logout" className="admin">
                Выйти
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1>Добро пожаловать!</h1>
            <div className="links">
              <Link href="/login" className="admin">
                Войти
              </Link>
              <Link href="/register" className="docs">
                Зарегистрироваться
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
