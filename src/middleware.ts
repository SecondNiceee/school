import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SignJWT, jwtVerify } from 'jose'

const JWT_SECRET = process.env.PAYLOAD_SECRET || 'default-secret-change-me'
const TOKEN_EXPIRATION = 60 * 60 * 24 * 7 // 7 days in seconds
const USER_TOKEN_COOKIE = 'user-token'

// Маршруты, требующие аутентификации
const protectedRoutes = ['/lk']
// Маршруты только для неаутентифицированных
const authRoutes = ['/login', '/register', '/verify-email']

type TokenPayload = {
  id: string
  email: string
}

async function verifyAndRefreshToken(token: string): Promise<{ payload: TokenPayload; newToken: string } | null> {
  try {
    const secretKey = new TextEncoder().encode(JWT_SECRET)
    const { payload } = await jwtVerify(token, secretKey)
    
    const tokenPayload: TokenPayload = {
      id: payload.id as string,
      email: payload.email as string,
    }
    
    // Создаем новый токен с обновленным временем истечения
    const newToken = await new SignJWT({ ...tokenPayload })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(`${TOKEN_EXPIRATION}s`)
      .sign(secretKey)
    
    return { payload: tokenPayload, newToken }
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(USER_TOKEN_COOKIE)?.value

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

  // Если есть токен - проверяем и обновляем его
  if (token) {
    const result = await verifyAndRefreshToken(token)
    
    if (result) {
      // Токен валидный - обновляем его для продления сессии
      const response = NextResponse.next()
      const isProduction = process.env.NODE_ENV === 'production'
      
      response.cookies.set({
        name: USER_TOKEN_COOKIE,
        value: result.newToken,
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        path: '/',
        maxAge: TOKEN_EXPIRATION,
        expires: new Date(Date.now() + TOKEN_EXPIRATION * 1000),
      })
      
      return response
    } else {
      // Токен невалидный - удаляем его
      if (isProtectedRoute) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('from', pathname)
        const response = NextResponse.redirect(loginUrl)
        response.cookies.delete(USER_TOKEN_COOKIE)
        return response
      }
      
      // Для неprotected маршрутов просто удаляем невалидный токен
      const response = NextResponse.next()
      response.cookies.delete(USER_TOKEN_COOKIE)
      return response
    }
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
    // API маршруты (для обновления токена)
    '/api/tests/:path*',
    '/api/admin/:path*',
  ],
}
