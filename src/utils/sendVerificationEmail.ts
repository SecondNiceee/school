import type { Payload } from 'payload'

type SendVerificationEmailArgs = {
  payload: Payload
  email: string
  token: string
  name?: string | null
}

export async function sendVerificationEmail({
  payload,
  email,
  token,
  name,
}: SendVerificationEmailArgs) {
  const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${token}`

  await payload.sendEmail({
    to: email,
    subject: 'Подтверждение email',
    html: `
      <h1>Подтвердите ваш email</h1>
      <p>Здравствуйте${name ? `, ${name}` : ''}!</p>
      <p>Пожалуйста, подтвердите ваш email, перейдя по ссылке:</p>
      <a href="${url}">${url}</a>
    `,
  })
}
