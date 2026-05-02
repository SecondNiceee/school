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

export async function GET(request: Request) {
  const { payload, admin } = await verifyAdmin()

  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('id')

    if (studentId) {
      // Get single student with their test results
      const student = await payload.findByID({
        collection: 'users',
        id: Number(studentId),
      })

      if (!student) {
        return NextResponse.json({ error: 'Student not found' }, { status: 404 })
      }

      // Get all tests assigned to this student
      const assignedTests = await payload.find({
        collection: 'tests',
        where: {
          assignedTo: { contains: Number(studentId) },
        },
        depth: 0,
      })

      // Get all test results for this student
      const testResults = await payload.find({
        collection: 'test-results',
        where: {
          student: { equals: Number(studentId) },
        },
        depth: 1,
      })

      return NextResponse.json({
        student,
        assignedTests: assignedTests.docs,
        testResults: testResults.docs,
      })
    }

    // Get all students
    const students = await payload.find({
      collection: 'users',
      where: {
        role: { equals: 'user' },
      },
      limit: 1000,
      sort: 'name',
    })

    return NextResponse.json(students)
  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 })
  }
}
