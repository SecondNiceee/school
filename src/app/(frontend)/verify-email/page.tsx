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
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="max-w-[400px] p-8 rounded-xl text-center bg-red-500/10 border border-red-500/30">
          <h1 className="m-0 mb-4 text-2xl leading-8 text-red-300">Ошибка</h1>
          <p className="m-0 mb-6 text-sm text-white/70">Токен подтверждения отсутствует.</p>
          <Link 
            href="/login" 
            className="inline-block py-3 px-6 text-sm font-medium no-underline rounded-lg bg-red-500 text-white transition-opacity hover:opacity-90"
          >
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
        <div className="flex items-center justify-center min-h-screen p-6">
          <div className="max-w-[400px] p-8 rounded-xl text-center bg-green-500/10 border border-green-500/30">
            <h1 className="m-0 mb-4 text-2xl leading-8 text-green-300">Email подтвержден</h1>
            <p className="m-0 mb-6 text-sm text-white/70">
              Ваш email успешно подтвержден. Теперь вы можете войти в систему.
            </p>
            <Link 
              href="/login" 
              className="inline-block py-3 px-6 text-sm font-medium no-underline rounded-lg bg-green-500 text-white transition-opacity hover:opacity-90"
            >
              Войти
            </Link>
          </div>
        </div>
      )
    }
  } catch {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="max-w-[400px] p-8 rounded-xl text-center bg-red-500/10 border border-red-500/30">
          <h1 className="m-0 mb-4 text-2xl leading-8 text-red-300">Ошибка</h1>
          <p className="m-0 mb-6 text-sm text-white/70">
            Не удалось подтвердить email. Возможно, ссылка устарела или уже использована.
          </p>
          <Link 
            href="/register" 
            className="inline-block py-3 px-6 text-sm font-medium no-underline rounded-lg bg-red-500 text-white transition-opacity hover:opacity-90"
          >
            Зарегистрироваться снова
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <div className="max-w-[400px] p-8 rounded-xl text-center bg-red-500/10 border border-red-500/30">
        <h1 className="m-0 mb-4 text-2xl leading-8 text-red-300">Ошибка</h1>
        <p className="m-0 mb-6 text-sm text-white/70">Не удалось подтвердить email.</p>
        <Link 
          href="/login" 
          className="inline-block py-3 px-6 text-sm font-medium no-underline rounded-lg bg-red-500 text-white transition-opacity hover:opacity-90"
        >
          Перейти к входу
        </Link>
      </div>
    </div>
  )
}
