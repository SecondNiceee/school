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

  if (user) {
    redirect('/lk')
  }

  return (
    <div className="home">
      {/* Animated background */}
      <div className="bg-shapes" aria-hidden="true">
        <div className="shape shape-1" />
        <div className="shape shape-2" />
        <div className="shape shape-3" />
        <div className="shape shape-4" />
        <div className="shape shape-5" />
        <div className="shape shape-6" />
      </div>

      {/* Header */}
      <header className="home-header">
        <div className="home-logo">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="18" cy="18" r="17" stroke="url(#logoGrad)" strokeWidth="2"/>
            <circle cx="18" cy="18" r="5" fill="url(#logoGrad)"/>
            <ellipse cx="18" cy="18" rx="12" ry="5" stroke="url(#logoGrad)" strokeWidth="1.5"/>
            <ellipse cx="18" cy="18" rx="12" ry="5" stroke="url(#logoGrad)" strokeWidth="1.5" transform="rotate(60 18 18)"/>
            <ellipse cx="18" cy="18" rx="12" ry="5" stroke="url(#logoGrad)" strokeWidth="1.5" transform="rotate(120 18 18)"/>
            <defs>
              <linearGradient id="logoGrad" x1="1" y1="1" x2="35" y2="35" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6366f1"/>
                <stop offset="1" stopColor="#f472b6"/>
              </linearGradient>
            </defs>
          </svg>
          <span>Онлайн-школа</span>
        </div>
        <Link href="/login" className="header-login-btn">
          Войти
        </Link>
      </header>

      {/* Hero */}
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
