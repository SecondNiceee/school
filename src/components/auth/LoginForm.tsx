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
    <div className="flex flex-col items-center justify-center min-h-screen p-6 max-w-[480px] mx-auto">
      <h1 className="mb-2 text-5xl leading-tight text-center text-gradient-primary max-[480px]:text-[40px] max-[480px]:leading-[48px]">
        {step === 'email' ? 'Войти' : 'Подтверждение'}
      </h1>
      <p className="text-base text-text-light text-center m-0 mb-7">
        {step === 'email' ? 'Введите ваш email для входа' : 'Введите код из письма'}
      </p>

      <div className="w-full p-10 bg-surface rounded-3xl border-2 border-primary/15 shadow-[0_4px_24px_rgba(99,102,241,0.08),0_1px_3px_rgba(0,0,0,0.05)] max-[480px]:p-7 max-[480px]:rounded-[20px]">
        {error && (
          <div className="w-full py-3.5 px-[18px] rounded-xl mb-5 text-sm font-medium text-center bg-red-500/[0.12] text-red-600 border border-red-500/25">
            {error}
          </div>
        )}

        {step === 'email' && (
          <form onSubmit={handleEmailSubmit} className="w-full flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-text">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Введите email"
                required
                autoFocus
                className="p-3.5 px-4 text-base border-2 border-primary/20 rounded-xl bg-surface text-text outline-none transition-all duration-200 placeholder:text-text-light focus:border-primary focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)]"
              />
            </div>

            <button
              type="submit"
              className="mt-2 py-3.5 px-6 text-base font-semibold text-white bg-gradient-primary border-none rounded-xl cursor-pointer shadow-primary transition-all duration-200 hover:not-disabled:-translate-y-0.5 hover:not-disabled:shadow-primary-hover active:not-disabled:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Отправка...' : 'Получить код'}
            </button>
          </form>
        )}

        {step === 'code' && (
          <form onSubmit={handleCodeSubmit} className="w-full flex flex-col gap-5">
            <p className="text-center text-sm text-text-light m-0 mb-2">
              Мы отправили 3-значный код на <strong className="text-primary">{email}</strong>
            </p>

            <div className="flex flex-col gap-2">
              <label htmlFor="code" className="text-sm font-medium text-text">
                Код подтверждения
              </label>
              <input
                type="text"
                id="code"
                name="code"
                placeholder="000"
                maxLength={3}
                pattern="[0-9]{3}"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                className="p-4 text-[32px] font-bold text-center tracking-[12px] text-primary border-2 border-primary/20 rounded-xl bg-surface outline-none transition-all duration-200 focus:border-primary focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)]"
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="mt-2 py-3.5 px-6 text-base font-semibold text-white bg-gradient-primary border-none rounded-xl cursor-pointer shadow-primary transition-all duration-200 hover:not-disabled:-translate-y-0.5 hover:not-disabled:shadow-primary-hover active:not-disabled:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isLoading || code.length !== 3}
            >
              {isLoading ? 'Проверка...' : 'Войти'}
            </button>

            <button
              type="button"
              className="py-3 px-6 text-sm text-text-light bg-transparent border-2 border-primary/20 rounded-xl cursor-pointer transition-all duration-200 hover:not-disabled:border-primary hover:not-disabled:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleResendCode}
              disabled={isLoading}
            >
              Отправить код повторно
            </button>

            <button
              type="button"
              className="py-2.5 px-6 text-[13px] text-text-light bg-transparent border-none rounded-xl cursor-pointer underline underline-offset-[3px] transition-colors duration-200 hover:not-disabled:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => { setStep('email'); setCode(''); setError(null) }}
              disabled={isLoading}
            >
              Изменить email
            </button>
          </form>
        )}

        <p className="mt-6 mb-0 text-sm text-text-light text-center">
          Нет аккаунта?{' '}
          <Link href="/register" className="text-primary no-underline font-semibold hover:underline">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  )
}
