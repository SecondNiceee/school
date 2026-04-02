import { type NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

type LoginBody = {
  email: string
  password: string
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LoginBody
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ message: 'Email и пароль обязательны' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    const result = await payload.login({
      collection: 'users',
      data: {
        email,
        password,
      },
    })

    if (!result.token) {
      return NextResponse.json({ message: 'Неверный email или пароль' }, { status: 401 })
    }

    const response = NextResponse.json({
      message: 'Вход выполнен успешно',
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
      },
    })

    // Set HTTP-only cookie with the token
    response.cookies.set('payload-token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error: unknown) {
    console.error('[login] Error:', error)

    // Check if it's a verification error
    const errorMessage = error instanceof Error ? error.message : ''
    if (errorMessage.includes('verify') || errorMessage.includes('verified')) {
      return NextResponse.json(
        { message: 'Пожалуйста, подтвердите ваш email перед входом' },
        { status: 403 },
      )
    }

    return NextResponse.json({ message: 'Неверный email или пароль' }, { status: 401 })
  }
}
