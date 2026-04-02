import { put } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(request: NextRequest) {
  try {
    // Проверяем авторизацию
    const headers = await getHeaders()
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })
    const { user } = await payload.auth({ headers })

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const userId = formData.get('userId') as string
    const description = formData.get('description') as string

    if (!file) {
      return NextResponse.json({ error: 'Файл не предоставлен' }, { status: 400 })
    }

    if (!userId) {
      return NextResponse.json({ error: 'ID пользователя не указан' }, { status: 400 })
    }

    // Загружаем файл в Vercel Blob (private для безопасности)
    const blob = await put(`user-files/${userId}/${Date.now()}-${file.name}`, file, {
      access: 'private',
    })

    // Сохраняем информацию о файле в Payload
    const userFile = await payload.create({
      collection: 'user-files',
      data: {
        filename: file.name,
        description: description || '',
        blobPathname: blob.pathname,
        blobUrl: blob.url,
        mimeType: file.type,
        fileSize: file.size,
        user: userId,
      },
    })

    return NextResponse.json({ 
      success: true, 
      file: userFile,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Ошибка загрузки файла' }, { status: 500 })
  }
}
