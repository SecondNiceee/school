'use client'

import { useState } from 'react'

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  async function handleLogout() {
    setIsLoading(true)
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
      window.location.href = '/'
    } catch {
      setIsLoading(false)
      setShowConfirm(false)
    }
  }

  if (showConfirm) {
    return (
      <div className="flex items-center gap-3 max-sm:flex-col max-sm:gap-2">
        <span className="text-sm text-text-light">Выйти из аккаунта?</span>
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="py-2 px-4 text-[13px] font-medium text-white bg-red-500 border-none rounded-md cursor-pointer shadow-[0_2px_8px_rgba(239,68,68,0.3)] transition-all duration-200 hover:not-disabled:-translate-y-0.5 hover:not-disabled:shadow-[0_4px_12px_rgba(239,68,68,0.4)] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Выход...' : 'Да'}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          disabled={isLoading}
          className="py-2 px-4 text-[13px] font-medium text-text-light bg-transparent border border-gray-400/30 rounded-md cursor-pointer transition-all duration-200 hover:not-disabled:-translate-y-0.5 hover:not-disabled:border-primary hover:not-disabled:text-primary disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Нет
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="py-2.5 px-5 text-sm font-medium text-text-light bg-transparent border border-gray-400/30 rounded-lg cursor-pointer transition-all duration-200 hover:border-primary hover:text-primary"
    >
      Выйти
    </button>
  )
}
