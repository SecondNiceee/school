'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [step, setStep] = useState<'register' | 'verify'>('register')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const emailValue = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email: emailValue, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Ошибка при регистрации')
        return
      }

      if (data.requiresVerification) {
        setEmail(emailValue)
        setPassword(password) // Сохраняем пароль для автоматического логина после верификации
        setStep('verify')
      }
    } catch {
      setError('Произошла ошибка. Попробуйте позже.')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleVerify(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Шаг 1: Верификация кода
      const verifyResponse = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      })

      const verifyData = await verifyResponse.json()

      if (!verifyResponse.ok) {
        setError(verifyData.message || 'Ошибка при проверке кода')
        return
      }

      // Шаг 2: Автоматический вход после успешной верификации
      setSuccess('Email подтвержден! Выполняем вход...')
      
      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (loginResponse.ok) {
        // Успешный вход - перенаправляем в личный кабинет
        router.push('/lk')
        router.refresh() // Обновляем данные сессии
      } else {
        // Если автоматический вход не удался, отправляем на страницу логина
        setSuccess('Email подтвержден! Перенаправление на страницу входа...')
        setTimeout(() => router.push('/login'), 1500)
      }
    } catch {
      setError('Произошла ошибка. Попробуйте позже.')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleResendCode() {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: 'resend-placeholder' }),
      })

      const data = await response.json()

      if (response.ok) {
        setError(null)
        setSuccess('Новый код отправлен!')
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError(data.message)
      }
    } catch {
      setError('Не удалось отправить код')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card-logo" aria-hidden="true">
          <svg width="40" height="40" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="18" cy="18" r="17" stroke="url(#lg2)" strokeWidth="2"/>
            <circle cx="18" cy="18" r="5" fill="url(#lg2)"/>
            <ellipse cx="18" cy="18" rx="12" ry="5" stroke="url(#lg2)" strokeWidth="1.5"/>
            <ellipse cx="18" cy="18" rx="12" ry="5" stroke="url(#lg2)" strokeWidth="1.5" transform="rotate(60 18 18)"/>
            <ellipse cx="18" cy="18" rx="12" ry="5" stroke="url(#lg2)" strokeWidth="1.5" transform="rotate(120 18 18)"/>
            <defs>
              <linearGradient id="lg2" x1="1" y1="1" x2="35" y2="35" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6366f1"/><stop offset="1" stopColor="#f472b6"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h1 className="auth-title">{step === 'register' ? 'Регистрация' : 'Подтверждение'}</h1>
        <p className="auth-subtitle">
          {step === 'register' ? 'Создайте аккаунт для начала обучения' : 'Введите код из письма'}
        </p>

        {error && <div className="message error">{error}</div>}

        {success && (
          <div className="message success-prominent">
            <div className="success-icon" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="11" fill="#059669"/>
                <path d="M7 12.5l3.5 3.5 6.5-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span>{success}</span>
          </div>
        )}

        {step === 'register' && (
          <form onSubmit={handleRegister} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Имя</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Введите ваше имя"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Введите email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Пароль</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Минимум 8 символов"
                minLength={8}
                required
              />
            </div>

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>
        )}

        {step === 'verify' && !success && (
          <form onSubmit={handleVerify} className="auth-form">
            <p className="verify-info">
              Мы отправили 3-значный код на <strong>{email}</strong>
            </p>

            <div className="form-group">
              <label htmlFor="code">Код подтверждения</label>
              <input
                type="text"
                id="code"
                name="code"
                placeholder="000"
                maxLength={3}
                pattern="[0-9]{3}"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                className="code-input"
                required
                autoFocus
              />
            </div>

            <button type="submit" className="submit-btn" disabled={isLoading || code.length !== 3}>
              {isLoading ? 'Проверка...' : 'Подтвердить'}
            </button>

            <button
              type="button"
              className="resend-btn"
              onClick={handleResendCode}
              disabled={isLoading}
            >
              Отправить код повторно
            </button>
          </form>
        )}

        <p className="auth-link">
          Уже есть аккаунт? <Link href="/login">Войти</Link>
        </p>
      </div>
    </div>
  )
}
