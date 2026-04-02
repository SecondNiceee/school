import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'

type PageProps = {
  searchParams: Promise<{ token?: string }>
}

export default async function VerifyEmailPage({ searchParams }: PageProps) {
  const { token } = await searchParams

  if (!token) {
    return (
      <div className="verify-page">
        <div className="verify-card error">
          <h1>Ошибка</h1>
          <p>Токен подтверждения отсутствует.</p>
          <Link href="/login" className="link">
            Перейти к входу
          </Link>
        </div>
      </div>
    )
  }

  try {
    const payload = await getPayload({ config })

    const result = await payload.verifyEmail({
      collection: 'users',
      token,
    })

    if (result) {
      return (
        <div className="verify-page">
          <div className="verify-card success">
            <h1>Email подтвержден</h1>
            <p>Ваш email успешно подтвержден. Теперь вы можете войти в систему.</p>
            <Link href="/login" className="link">
              Войти
            </Link>
          </div>
        </div>
      )
    }
  } catch {
    return (
      <div className="verify-page">
        <div className="verify-card error">
          <h1>Ошибка</h1>
          <p>Не удалось подтвердить email. Возможно, ссылка устарела или уже использована.</p>
          <Link href="/register" className="link">
            Зарегистрироваться снова
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="verify-page">
      <div className="verify-card error">
        <h1>Ошибка</h1>
        <p>Не удалось подтвердить email.</p>
        <Link href="/login" className="link">
          Перейти к входу
        </Link>
      </div>
    </div>
  )
}
