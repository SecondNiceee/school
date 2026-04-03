'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Ошибка при входе')
        return
      }

      router.push('/lk')
      router.refresh()
    } catch {
      setError('Произошла ошибка. Попробуйте позже.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card-logo" aria-hidden="true">
          <svg width="40" height="40" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="18" cy="18" r="17" stroke="url(#lg1)" strokeWidth="2"/>
            <circle cx="18" cy="18" r="5" fill="url(#lg1)"/>
            <ellipse cx="18" cy="18" rx="12" ry="5" stroke="url(#lg1)" strokeWidth="1.5"/>
            <ellipse cx="18" cy="18" rx="12" ry="5" stroke="url(#lg1)" strokeWidth="1.5" transform="rotate(60 18 18)"/>
            <ellipse cx="18" cy="18" rx="12" ry="5" stroke="url(#lg1)" strokeWidth="1.5" transform="rotate(120 18 18)"/>
            <defs>
              <linearGradient id="lg1" x1="1" y1="1" x2="35" y2="35" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6366f1"/><stop offset="1" stopColor="#f472b6"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h1 className="auth-title">Войти</h1>
        <p className="auth-subtitle">Введите данные для входа в аккаунт</p>

        {error && <div className="message error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
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
              placeholder="Введите пароль"
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <p className="auth-link">
          Нет аккаунта? <Link href="/register">Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  )
}
