import { type NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

type VerifyCodeBody = {
  email: string
  code: string
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as VerifyCodeBody
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

    if (user._verified) {
      return NextResponse.json({ message: 'Email уже подтвержден' }, { status: 400 })
    }

    if (!user.verificationCode || !user.verificationCodeExpires) {
      return NextResponse.json({ message: 'Код верификации не найден' }, { status: 400 })
    }

    const codeExpires = new Date(user.verificationCodeExpires)
    if (codeExpires < new Date()) {
      return NextResponse.json({ message: 'Код истек. Запросите новый.' }, { status: 400 })
    }

    if (user.verificationCode !== code) {
      return NextResponse.json({ message: 'Неверный код' }, { status: 400 })
    }

    // Verify the user
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        _verified: true,
        verificationCode: null,
        verificationCodeExpires: null,
      },
      overrideAccess: true,
    })

    return NextResponse.json({ message: 'Email успешно подтвержден!' }, { status: 200 })
  } catch (error: unknown) {
    console.error('[verify-code] Error:', error)
    return NextResponse.json({ message: 'Ошибка при проверке кода' }, { status: 500 })
  }
}
