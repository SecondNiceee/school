'use client'

import { useState } from 'react'
import Link from 'next/link'

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isVerified, setIsVerified] = useState(false)
  const [step, setStep] = useState<'register' | 'verify'>('register')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const emailValue = formData.get('email') as string

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email: emailValue }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Ошибка при регистрации')
        return
      }

      setEmail(emailValue)
      setStep('verify')
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
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Ошибка при проверке кода')
        return
      }

      // Token is set via cookie — redirect to lk
      setIsVerified(true)
      setSuccess('Email подтверждён! Перенаправление...')
      window.location.href = '/lk'
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
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setCode('')
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
    <div className="auth-form-container">
      <h1>{step === 'register' ? 'Регистрация' : 'Подтверждение'}</h1>
      <p className="auth-subtitle">
        {step === 'register' ? 'Создайте новый аккаунт' : 'Введите код из письма'}
      </p>

      <div className="auth-card">
        {error && <div className="message error">{error}</div>}
        {success && !isVerified && <div className="message success">{success}</div>}

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
                autoFocus
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

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>
        )}

        {step === 'verify' && !isVerified && (
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

            <button
              type="submit"
              className="submit-btn"
              disabled={isLoading || code.length !== 3}
            >
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

        {step === 'verify' && isVerified && (
          <div className="verify-success-state">
            <div className="success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12l2.5 2.5L16 9" />
              </svg>
            </div>
            <div className="message success">{success}</div>
            <p className="verify-redirect-hint">Перенаправление в личный кабинет...</p>
          </div>
        )}

        {!isVerified && (
          <p className="auth-link">
            Уже есть аккаунт? <Link href="/login">Войти</Link>
          </p>
        )}
      </div>
    </div>
  )
}
