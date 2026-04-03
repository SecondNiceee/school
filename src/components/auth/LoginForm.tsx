'use client'

import { useState } from 'react'
import Link from 'next/link'

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')

  async function handleEmailSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const emailValue = formData.get('email') as string

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailValue }),
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Ошибка при входе')
        return
      }

      setEmail(emailValue)
      setStep('code')
    } catch {
      setError('Произошла ошибка. Попробуйте позже.')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCodeSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/login-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Неверный код')
        return
      }

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
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Ошибка при отправке кода')
      } else {
        setCode('')
      }
    } catch {
      setError('Не удалось отправить код')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-form-container">
      <h1>{step === 'email' ? 'Войти' : 'Подтверждение'}</h1>
      <p className="auth-subtitle">
        {step === 'email' ? 'Введите ваш email для входа' : 'Введите код из письма'}
      </p>

      <div className="auth-card">
        {error && <div className="message error">{error}</div>}

        {step === 'email' && (
          <form onSubmit={handleEmailSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Введите email"
                required
                autoFocus
              />
            </div>

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Отправка...' : 'Получить код'}
            </button>
          </form>
        )}

        {step === 'code' && (
          <form onSubmit={handleCodeSubmit} className="auth-form">
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
              {isLoading ? 'Проверка...' : 'Войти'}
            </button>

            <button
              type="button"
              className="resend-btn"
              onClick={handleResendCode}
              disabled={isLoading}
            >
              Отправить код повторно
            </button>

            <button
              type="button"
              className="back-btn"
              onClick={() => { setStep('email'); setCode(''); setError(null) }}
              disabled={isLoading}
            >
              Изменить email
            </button>
          </form>
        )}

        <p className="auth-link">
          Нет аккаунта? <Link href="/register">Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  )
}
