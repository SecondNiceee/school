import { NextResponse } from 'next/server'

function createLogoutResponse(isRedirect: boolean = false) {
  const response = isRedirect
    ? NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'))
    : NextResponse.json({ message: 'Выход выполнен успешно' })

  response.cookies.set('user-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })

  return response
}

export async function GET() {
  return createLogoutResponse(true)
}

export async function POST() {
  return createLogoutResponse(false)
}
