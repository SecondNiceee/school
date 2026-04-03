import { type NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { sendVerificationCodeEmail } from '@/utils/sendVerificationCodeEmail'

type LoginBody = {
  email: string
}

function generateVerificationCode(): string {
  return Math.floor(100 + Math.random() * 900).toString()
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LoginBody
    const { email } = body

    if (!email) {
      return NextResponse.json({ message: 'Email обязателен' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
      showHiddenFields: true,
    })

    const user = existing.docs[0] as
      | (typeof existing.docs[0] & { _verified?: boolean; name?: string })
      | undefined

    if (!user) {
      return NextResponse.json({ message: 'Пользователь с таким email не найден' }, { status: 404 })
    }

    if (!user._verified) {
      return NextResponse.json(
        { message: 'Email не подтверждён. Пройдите регистрацию.' },
        { status: 403 },
      )
    }

    // Generate and save login code
    const verificationCode = generateVerificationCode()
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        verificationCode,
        verificationCodeExpires: verificationCodeExpires.toISOString(),
      },
      overrideAccess: true,
    })

    await sendVerificationCodeEmail({
      payload,
      email,
      code: verificationCode,
      name: user.name ?? '',
    })

    return NextResponse.json(
      { message: 'Код отправлен на вашу почту.', requiresCode: true },
      { status: 200 },
    )
  } catch (error: unknown) {
    console.error('[login] Error:', error)
    return NextResponse.json({ message: 'Произошла ошибка. Попробуйте позже.' }, { status: 500 })
  }
}
