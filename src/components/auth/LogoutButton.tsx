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
      <div className="logout-confirm">
        <span className="logout-confirm-text">Выйти из аккаунта?</span>
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="logout-confirm-yes"
        >
          {isLoading ? 'Выход...' : 'Да'}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          disabled={isLoading}
          className="logout-confirm-no"
        >
          Нет
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="lk-logout"
    >
      Выйти
    </button>
  )
}
