import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

async function verifyAdmin() {
  const cookieStore = await cookies()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  try {
    const result = await payload.auth({
      headers: new Headers({ cookie: cookieStore.toString() }),
    })
    if (result.user?.collection === 'admins') {
      return { payload, admin: result.user }
    }
  } catch {
    // Not authenticated
  }
  return { payload, admin: null }
}

export async function GET() {
  const { payload, admin } = await verifyAdmin()

  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const tests = await payload.find({
      collection: 'tests',
      limit: 1000,
      sort: '-createdAt',
      depth: 1,
    })

    return NextResponse.json(tests)
  } catch (error) {
    console.error('Error fetching tests:', error)
    return NextResponse.json({ error: 'Failed to fetch tests' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const { payload, admin } = await verifyAdmin()

  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()

    const test = await payload.create({
      collection: 'tests',
      data: {
        title: body.title,
        description: body.description,
        questions: body.questions,
        assignedTo: body.assignedTo,
      },
    })

    return NextResponse.json(test)
  } catch (error) {
    console.error('Error creating test:', error)
    return NextResponse.json({ error: 'Failed to create test' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const { payload, admin } = await verifyAdmin()

  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Test ID required' }, { status: 400 })
    }

    await payload.delete({
      collection: 'tests',
      id: Number(id),
    })

    // Also delete all results for this test
    await payload.delete({
      collection: 'test-results',
      where: {
        test: { equals: Number(id) },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting test:', error)
    return NextResponse.json({ error: 'Failed to delete test' }, { status: 500 })
  }
}
