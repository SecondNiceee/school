import { put } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

export async function POST(request: NextRequest) {
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

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const blob = await put(`materials/${Date.now()}-${file.name}`, file, {
      access: 'public',
    })

    return NextResponse.json({
      url: blob.url,
      fileName: file.name,
      fileSize: file.size,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
