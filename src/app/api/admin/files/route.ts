import { list } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const payload = await getPayload({ config: configPromise })
    const cookieStore = await cookies()

    // Check admin auth
    let admin = null
    try {
      const result = await payload.auth({
        headers: new Headers({ cookie: cookieStore.toString() }),
      })
      if (result.user?.collection === 'admins') {
        admin = result.user
      }
    } catch {
      // Not authenticated
    }

    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get pagination params
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const cursor = searchParams.get('cursor') || undefined

    // List blobs from Vercel Blob storage
    const { blobs, cursor: nextCursor, hasMore } = await list({
      limit,
      cursor,
    })

    return NextResponse.json({
      blobs: blobs.map((blob) => ({
        url: blob.url,
        pathname: blob.pathname,
        size: blob.size,
        uploadedAt: blob.uploadedAt,
      })),
      cursor: nextCursor,
      hasMore,
    })
  } catch (error) {
    console.error('Files list error:', error)
    return NextResponse.json({ error: 'Failed to list files' }, { status: 500 })
  }
}
