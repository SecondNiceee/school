import type { Payload } from 'payload'

type SendVerificationCodeEmailParams = {
  payload: Payload
  email: string
  code: string
  name?: string
}

export async function sendVerificationCodeEmail({
  payload,
  email,
  code,
  name,
}: SendVerificationCodeEmailParams) {
  await payload.sendEmail({
    to: email,
    subject: 'Код подтверждения',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Подтверждение email</h1>
        <p>Здравствуйте${name ? `, ${name}` : ''}!</p>
        <p>Ваш код подтверждения:</p>
        <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #333;">${code}</span>
        </div>
        <p style="color: #666; font-size: 14px;">Код действителен 10 минут.</p>
        <p style="color: #999; font-size: 12px;">Если вы не запрашивали этот код, проигнорируйте это письмо.</p>
      </div>
    `,
  })
}
