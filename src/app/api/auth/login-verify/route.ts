import { type NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { SignJWT } from 'jose'

type LoginVerifyBody = {
  email: string
  code: string
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LoginVerifyBody
    const { email, code } = body

    if (!email || !code) {
      return NextResponse.json({ message: 'Email и код обязательны' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
      showHiddenFields: true,
    })

    const user = existing.docs[0] as
      | (typeof existing.docs[0] & {
          _verified?: boolean
          verificationCode?: string
          verificationCodeExpires?: string
        })
      | undefined

    if (!user) {
      return NextResponse.json({ message: 'Пользователь не найден' }, { status: 404 })
    }

    if (!user.verificationCode || !user.verificationCodeExpires) {
      return NextResponse.json({ message: 'Код не найден. Запросите новый.' }, { status: 400 })
    }

    const codeExpires = new Date(user.verificationCodeExpires)
    if (codeExpires < new Date()) {
      return NextResponse.json({ message: 'Код истёк. Запросите новый.' }, { status: 400 })
    }

    if (user.verificationCode !== code) {
      return NextResponse.json({ message: 'Неверный код' }, { status: 400 })
    }

    // Clear the code
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        verificationCode: null,
        verificationCodeExpires: null,
      },
      overrideAccess: true,
    })

    // Generate JWT token manually using Payload's secret
    const secret = process.env.PAYLOAD_SECRET
    if (!secret) {
      return NextResponse.json({ message: 'Ошибка конфигурации сервера' }, { status: 500 })
    }

    const tokenExpiration = 60 * 60 * 24 * 7 // 7 days in seconds

    const secretKey = new TextEncoder().encode(secret)
    const token = await new SignJWT({
      id: user.id,
      email: user.email,
      collection: 'users',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(`${tokenExpiration}s`)
      .sign(secretKey)

    const response = NextResponse.json({
      message: 'Вход выполнен успешно',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })

    const isProduction = process.env.NODE_ENV === 'production'

    response.cookies.set({
      name: 'payload-token',
      value: token,
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: tokenExpiration,
    })

    return response
  } catch (error: unknown) {
    console.error('[login-verify] Error:', error)
    return NextResponse.json({ message: 'Ошибка при проверке кода' }, { status: 500 })
  }
}
