import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import { redirect } from 'next/navigation'
import React from 'react'
import Link from 'next/link'

import config from '@/payload.config'

export default async function HomePage() {
  // Проверяем наличие необходимых переменных окружения
  if (process.env.PAYLOAD_SECRET && process.env.DATABASE_URL) {
    try {
      const headers = await getHeaders()
      const payloadConfig = await config
      const payload = await getPayload({ config: payloadConfig })
      const { user } = await payload.auth({ headers })

      // Если пользователь залогинен - редирект в личный кабинет
      if (user) {
        redirect('/lk')
      }
    } catch (error) {
      // Если ошибка при инициализации Payload, просто показываем главную страницу
      console.log('[v0] Payload initialization error:', error)
    }
  }

  return (
    <div className="relative flex flex-col justify-center items-center min-h-screen px-6 py-24 pt-[100px] max-w-[1024px] mx-auto text-center max-[400px]:pt-20 max-[400px]:px-6">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute opacity-15 text-primary w-[120px] h-[120px] top-[10%] left-[5%] animate-float [animation-duration:25s]">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            <ellipse cx="50" cy="50" rx="45" ry="20" stroke="currentColor" strokeWidth="2"/>
            <ellipse cx="50" cy="50" rx="45" ry="20" stroke="currentColor" strokeWidth="2" transform="rotate(60 50 50)"/>
            <ellipse cx="50" cy="50" rx="45" ry="20" stroke="currentColor" strokeWidth="2" transform="rotate(120 50 50)"/>
            <circle cx="50" cy="50" r="8" fill="currentColor"/>
          </svg>
        </div>
        <div className="absolute opacity-15 text-secondary w-20 h-20 top-[20%] right-[10%] animate-float [animation-delay:-5s] [animation-duration:22s]">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            <path d="M35 10 L35 40 L15 85 Q12 95 25 95 L75 95 Q88 95 85 85 L65 40 L65 10" stroke="currentColor" strokeWidth="3" fill="none"/>
            <line x1="30" y1="10" x2="70" y2="10" stroke="currentColor" strokeWidth="3"/>
            <ellipse cx="50" cy="75" rx="20" ry="8" fill="currentColor" opacity="0.3"/>
          </svg>
        </div>
        <div className="absolute opacity-15 text-accent w-[100px] h-[100px] bottom-[20%] left-[8%] animate-float [animation-delay:-10s] [animation-duration:28s]">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            <path d="M10 20 Q10 10 25 15 L50 25 L75 15 Q90 10 90 20 L90 80 Q90 90 75 85 L50 75 L25 85 Q10 90 10 80 Z" stroke="currentColor" strokeWidth="3" fill="none"/>
            <line x1="50" y1="25" x2="50" y2="75" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </div>
        <div className="absolute opacity-15 text-primary w-[60px] h-[60px] top-[60%] right-[15%] animate-float [animation-delay:-3s] [animation-duration:20s]">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            <text x="50" y="70" textAnchor="middle" fontSize="60" fill="currentColor" fontFamily="serif">π</text>
          </svg>
        </div>
        <div className="absolute opacity-15 text-warning w-[90px] h-[90px] bottom-[30%] right-[5%] animate-float [animation-delay:-8s] [animation-duration:24s]">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            <rect x="10" y="35" width="80" height="30" rx="3" stroke="currentColor" strokeWidth="3" fill="none"/>
            <line x1="25" y1="35" x2="25" y2="50" stroke="currentColor" strokeWidth="2"/>
            <line x1="40" y1="35" x2="40" y2="55" stroke="currentColor" strokeWidth="2"/>
            <line x1="55" y1="35" x2="55" y2="50" stroke="currentColor" strokeWidth="2"/>
            <line x1="70" y1="35" x2="70" y2="55" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </div>
        <div className="absolute opacity-15 text-secondary w-[70px] h-[70px] top-[40%] left-[15%] animate-float [animation-delay:-12s] [animation-duration:26s]">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            <path d="M35 60 Q20 45 30 25 Q40 5 60 15 Q80 25 70 45 Q65 55 65 60" stroke="currentColor" strokeWidth="3" fill="none"/>
            <line x1="35" y1="65" x2="65" y2="65" stroke="currentColor" strokeWidth="3"/>
            <line x1="38" y1="72" x2="62" y2="72" stroke="currentColor" strokeWidth="3"/>
            <line x1="42" y1="79" x2="58" y2="79" stroke="currentColor" strokeWidth="3"/>
          </svg>
        </div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 flex justify-between items-center px-8 py-4 bg-background/90 backdrop-blur-md z-[100] border-b border-primary/10 max-sm:px-4 max-sm:py-3">
        <Link href="/" className="flex items-center gap-2.5 no-underline text-primary">
          <svg viewBox="0 0 40 40" fill="none" className="w-9 h-9 text-primary" aria-hidden="true">
            <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2"/>
            <ellipse cx="20" cy="20" rx="16" ry="6" stroke="currentColor" strokeWidth="1.5"/>
            <ellipse cx="20" cy="20" rx="16" ry="6" stroke="currentColor" strokeWidth="1.5" transform="rotate(60 20 20)"/>
            <ellipse cx="20" cy="20" rx="16" ry="6" stroke="currentColor" strokeWidth="1.5" transform="rotate(120 20 20)"/>
            <circle cx="20" cy="20" r="4" fill="currentColor"/>
          </svg>
          <span className="text-xl font-bold text-gradient-primary max-[480px]:hidden">Погружение в науку</span>
        </Link>
        <Link 
          href="/login" 
          className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-primary rounded-[10px] no-underline shadow-primary-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(99,102,241,0.4)]"
        >
          Войти
        </Link>
      </header>

      <div className="relative z-[1] flex flex-col items-center justify-center">
        <h1 className="text-center mb-4 text-gradient-primary">
          Онлайн школа «Погружение в науку»
        </h1>
        <p className="text-xl text-text-light m-0 mb-10 max-w-[500px] max-md:text-base">
          Увлекательное обучение для детей с <strong>Ириной Титовой</strong> в удобном онлайн-формате
        </p>
        <div className="flex items-center gap-4 flex-wrap justify-center">
          <Link 
            href="/login" 
            className="no-underline px-8 py-3.5 rounded-xl font-semibold text-base transition-all duration-200 hover:-translate-y-0.5 text-white bg-gradient-primary shadow-primary hover:shadow-primary-hover"
          >
            Войти
          </Link>
          <Link 
            href="/register" 
            className="no-underline px-8 py-3.5 rounded-xl font-semibold text-base transition-all duration-200 hover:-translate-y-0.5 text-primary bg-surface border-2 border-primary hover:bg-primary/5"
          >
            Зарегистрироваться
          </Link>
        </div>
      </div>
    </div>
  )
}
