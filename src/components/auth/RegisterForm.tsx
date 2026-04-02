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
    <div className="auth-form-container">
      <h1>{step === 'register' ? 'Регистрация' : 'Подтверждение'}</h1>

      {error && <div className="message error">{error}</div>}
      {success && <div className="message success">{success}</div>}

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
  )
}
