import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Маршруты, требующие аутентификации
const protectedRoutes = ['/lk']
// Маршруты только для неаутентифицированных
const authRoutes = ['/login', '/register', '/verify-email']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('payload-token')?.value

  // Проверяем защищенные маршруты
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // Если пользователь не аутентифицирован и пытается получить доступ к защищенному маршруту
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Если пользователь аутентифицирован и пытается получить доступ к страницам входа/регистрации
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/lk', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Защищенные маршруты
    '/lk/:path*',
    // Auth маршруты
    '/login',
    '/register',
    '/verify-email',
  ],
}
