import { get } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(request: NextRequest) {
  try {
    // Проверяем авторизацию
    const headers = await getHeaders()
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })
    const { user } = await payload.auth({ headers })

    if (!user) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }

    const fileId = request.nextUrl.searchParams.get('id')

    if (!fileId) {
      return NextResponse.json({ error: 'ID файла не указан' }, { status: 400 })
    }

    // Получаем информацию о файле из Payload
    const userFile = await payload.findByID({
      collection: 'user-files',
      id: fileId,
    })

    if (!userFile) {
      return NextResponse.json({ error: 'Файл не найден' }, { status: 404 })
    }

    // Проверяем доступ: пользователь может скачать только свои файлы (или админ - любые)
    const fileUserId = typeof userFile.user === 'object' ? userFile.user.id : userFile.user
    if (user.role !== 'admin' && fileUserId !== user.id) {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 })
    }

    // Получаем файл из Vercel Blob
    const result = await get(userFile.blobPathname, {
      access: 'private',
      ifNoneMatch: request.headers.get('if-none-match') ?? undefined,
    })

    if (!result) {
      return NextResponse.json({ error: 'Файл не найден в хранилище' }, { status: 404 })
    }

    // Blob hasn't changed — tell the browser to use its cached copy
    if (result.statusCode === 304) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          ETag: result.blob.etag,
          'Cache-Control': 'private, no-cache',
        },
      })
    }

    return new NextResponse(result.stream, {
      headers: {
        'Content-Type': result.blob.contentType,
        'Content-Disposition': `attachment; filename="${encodeURIComponent(userFile.filename)}"`,
        ETag: result.blob.etag,
        'Cache-Control': 'private, no-cache',
      },
    })
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json({ error: 'Ошибка скачивания файла' }, { status: 500 })
  }
}
