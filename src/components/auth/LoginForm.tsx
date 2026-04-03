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
        credentials: 'include', // Важно для работы с cookies
      })

      const data = await response.json()
      console.log('[v0] Login response:', data)
      console.log('[v0] Response cookies:', document.cookie)

      if (!response.ok) {
        setError(data.message || 'Ошибка при входе')
        return
      }

      // Даем время на установку cookie перед переходом
      await new Promise(resolve => setTimeout(resolve, 100))
      
      router.push('/lk')
      router.refresh()
    } catch {
      setError('Произошла ошибка. Попробуйте позже.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-form-container">
      <h1>Войти</h1>
      <p className="auth-subtitle">Войдите в свой аккаунт</p>

      <div className="auth-card">
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
