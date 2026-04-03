import { type NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { sendVerificationCodeEmail } from '@/utils/sendVerificationCodeEmail'

type RegisterBody = {
  name?: string
  email: string
}

function generateVerificationCode(): string {
  return Math.floor(100 + Math.random() * 900).toString()
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RegisterBody
    const { name, email } = body

    if (!email) {
      return NextResponse.json({ message: 'Email обязателен' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
    })

    const candidate = existing.docs[0] as
      | (typeof existing.docs[0] & { verified?: boolean })
      | undefined

    if (candidate) {
      if (candidate.verified) {
        return NextResponse.json(
          { message: 'Пользователь с таким email уже существует' },
          { status: 409 },
        )
      }

      // User exists but not verified — generate new code and resend
      const verificationCode = generateVerificationCode()
      const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000)

      await payload.update({
        collection: 'users',
        id: candidate.id,
        data: {
          name: name ?? candidate.name ?? '',
          verificationCode,
          verificationCodeExpires: verificationCodeExpires.toISOString(),
        },
      })

      await sendVerificationCodeEmail({
        payload,
        email,
        code: verificationCode,
        name: name ?? (candidate.name as string),
      })

      return NextResponse.json(
        { message: 'Код подтверждения отправлен на вашу почту.', requiresVerification: true },
        { status: 200 },
      )
    }

    // Create new user (no password needed!)
    const verificationCode = generateVerificationCode()
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000)

    await payload.create({
      collection: 'users',
      data: {
        name: name ?? '',
        email,
        role: 'user',
        verified: false,
        verificationCode,
        verificationCodeExpires: verificationCodeExpires.toISOString(),
      },
    })

    await sendVerificationCodeEmail({
      payload,
      email,
      code: verificationCode,
      name,
    })

    return NextResponse.json(
      { message: 'Код подтверждения отправлен на вашу почту.', requiresVerification: true },
      { status: 201 },
    )
  } catch (error: unknown) {
    console.error('[register] Error:', error)
    return NextResponse.json(
      { message: 'Не удалось зарегистрировать пользователя' },
      { status: 500 },
    )
  }
}
