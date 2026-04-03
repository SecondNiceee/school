import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import { redirect } from 'next/navigation'
import React from 'react'
import Link from 'next/link'

import config from '@/payload.config'
import './styles.css'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  // Если пользователь залогинен - редирект в личный кабинет
  if (user) {
    redirect('/lk')
  }

  return (
    <div className="home">
      <div className="content">
        <h1>Добро пожаловать в онлайн-школу!</h1>
        <p className="subtitle">
          Увлекательное обучение для детей в удобном онлайн-формате
        </p>
        <div className="links">
          <Link href="/login" className="primary-btn">
            Войти
          </Link>
          <Link href="/register" className="secondary-btn">
            Зарегистрироваться
          </Link>
        </div>
      </div>
    </div>
  )
}
