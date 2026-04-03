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
      {/* Animated background elements */}
      <div className="animated-bg">
        <div className="floating-element atom">
          <svg viewBox="0 0 100 100" fill="none">
            <ellipse cx="50" cy="50" rx="45" ry="20" stroke="currentColor" strokeWidth="2"/>
            <ellipse cx="50" cy="50" rx="45" ry="20" stroke="currentColor" strokeWidth="2" transform="rotate(60 50 50)"/>
            <ellipse cx="50" cy="50" rx="45" ry="20" stroke="currentColor" strokeWidth="2" transform="rotate(120 50 50)"/>
            <circle cx="50" cy="50" r="8" fill="currentColor"/>
          </svg>
        </div>
        <div className="floating-element flask">
          <svg viewBox="0 0 100 100" fill="none">
            <path d="M35 10 L35 40 L15 85 Q12 95 25 95 L75 95 Q88 95 85 85 L65 40 L65 10" stroke="currentColor" strokeWidth="3" fill="none"/>
            <line x1="30" y1="10" x2="70" y2="10" stroke="currentColor" strokeWidth="3"/>
            <ellipse cx="50" cy="75" rx="20" ry="8" fill="currentColor" opacity="0.3"/>
          </svg>
        </div>
        <div className="floating-element book">
          <svg viewBox="0 0 100 100" fill="none">
            <path d="M10 20 Q10 10 25 15 L50 25 L75 15 Q90 10 90 20 L90 80 Q90 90 75 85 L50 75 L25 85 Q10 90 10 80 Z" stroke="currentColor" strokeWidth="3" fill="none"/>
            <line x1="50" y1="25" x2="50" y2="75" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </div>
        <div className="floating-element pi">
          <svg viewBox="0 0 100 100" fill="none">
            <text x="50" y="70" textAnchor="middle" fontSize="60" fill="currentColor" fontFamily="serif">π</text>
          </svg>
        </div>
        <div className="floating-element ruler">
          <svg viewBox="0 0 100 100" fill="none">
            <rect x="10" y="35" width="80" height="30" rx="3" stroke="currentColor" strokeWidth="3" fill="none"/>
            <line x1="25" y1="35" x2="25" y2="50" stroke="currentColor" strokeWidth="2"/>
            <line x1="40" y1="35" x2="40" y2="55" stroke="currentColor" strokeWidth="2"/>
            <line x1="55" y1="35" x2="55" y2="50" stroke="currentColor" strokeWidth="2"/>
            <line x1="70" y1="35" x2="70" y2="55" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </div>
        <div className="floating-element lightbulb">
          <svg viewBox="0 0 100 100" fill="none">
            <path d="M35 60 Q20 45 30 25 Q40 5 60 15 Q80 25 70 45 Q65 55 65 60" stroke="currentColor" strokeWidth="3" fill="none"/>
            <line x1="35" y1="65" x2="65" y2="65" stroke="currentColor" strokeWidth="3"/>
            <line x1="38" y1="72" x2="62" y2="72" stroke="currentColor" strokeWidth="3"/>
            <line x1="42" y1="79" x2="58" y2="79" stroke="currentColor" strokeWidth="3"/>
          </svg>
        </div>
      </div>

      {/* Header */}
      <header className="site-header">
        <Link href="/" className="logo">
          <svg viewBox="0 0 40 40" fill="none" className="logo-icon">
            <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2"/>
            <ellipse cx="20" cy="20" rx="16" ry="6" stroke="currentColor" strokeWidth="1.5"/>
            <ellipse cx="20" cy="20" rx="16" ry="6" stroke="currentColor" strokeWidth="1.5" transform="rotate(60 20 20)"/>
            <ellipse cx="20" cy="20" rx="16" ry="6" stroke="currentColor" strokeWidth="1.5" transform="rotate(120 20 20)"/>
            <circle cx="20" cy="20" r="4" fill="currentColor"/>
          </svg>
          <span className="logo-text">ScienceSchool</span>
        </Link>
        <Link href="/login" className="header-login-btn">
          Войти
        </Link>
      </header>

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
