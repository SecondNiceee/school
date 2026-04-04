import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { type NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody

  try {
    const payload = await getPayload({ config: configPromise })

    // Check auth
    const authHeader = request.headers.get('authorization')
    let user = null

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      try {
        const result = await payload.auth({
          headers: new Headers({ Authorization: `JWT ${token}` }),
        })
        user = result.user
      } catch {
        // Token invalid
      }
    }

    // Try cookie auth
    if (!user) {
      const cookieHeader = request.headers.get('cookie')
      if (cookieHeader) {
        try {
          const result = await payload.auth({
            headers: new Headers({ cookie: cookieHeader }),
          })
          user = result.user
        } catch {
          // Cookie invalid
        }
      }
    }

    if (!user || user.collection !== 'admins') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Генерируем токен для загрузки - здесь можно добавить проверки
        return {
          allowedContentTypes: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'video/mp4',
            'video/webm',
            'audio/mpeg',
            'audio/wav',
          ],
          maximumSizeInBytes: 100 * 1024 * 1024, // 100MB лимит
          tokenPayload: JSON.stringify({
            uploadedBy: user.id,
          }),
        }
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Вызывается после успешной загрузки
        console.log('Upload completed:', blob.url)
        // Здесь можно сохранить информацию о файле в БД если нужно
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
