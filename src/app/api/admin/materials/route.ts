import { type NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { cookies } from 'next/headers'

export async function GET(): Promise<NextResponse> {
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

    // Fetch all materials with populated assignedTo
    const materials = await payload.find({
      collection: 'materials',
      limit: 1000,
      sort: '-createdAt',
      depth: 1, // Populate relationships
    })

    return NextResponse.json(materials)
  } catch (error) {
    console.error('Materials fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch materials' }, { status: 500 })
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
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

    const body = await request.json()
    const { title, description, fileUrl, fileName, fileSize, assignedTo } = body

    if (!title || !fileUrl || !assignedTo || assignedTo.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create material
    const material = await payload.create({
      collection: 'materials',
      data: {
        title,
        description: description || null,
        fileUrl,
        fileName: fileName || null,
        fileSize: fileSize || null,
        assignedTo,
      },
    })

    return NextResponse.json(material)
  } catch (error) {
    console.error('Material create error:', error)
    return NextResponse.json({ error: 'Failed to create material' }, { status: 500 })
  }
}
