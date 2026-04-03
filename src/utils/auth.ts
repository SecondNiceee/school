import { SignJWT, jwtVerify } from 'jose'

const JWT_SECRET = process.env.PAYLOAD_SECRET || 'default-secret-change-me'
const TOKEN_EXPIRATION = 60 * 60 * 24 * 7 // 7 days in seconds

type TokenPayload = {
  id: string
  email: string
}

export async function createToken(payload: TokenPayload): Promise<string> {
  const secretKey = new TextEncoder().encode(JWT_SECRET)
  
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${TOKEN_EXPIRATION}s`)
    .sign(secretKey)
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const secretKey = new TextEncoder().encode(JWT_SECRET)
    const { payload } = await jwtVerify(token, secretKey)
    
    return {
      id: payload.id as string,
      email: payload.email as string,
    }
  } catch {
    return null
  }
}

export const USER_TOKEN_COOKIE = 'user-token'

export function getTokenCookieOptions(isProduction: boolean) {
  return {
    name: USER_TOKEN_COOKIE,
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: TOKEN_EXPIRATION,
  }
}
