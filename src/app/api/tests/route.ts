import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { verifyToken } from '@/utils/auth'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('user-token')?.value

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const tokenPayload = await verifyToken(token)
  if (!tokenPayload) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  try {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    // Get tests assigned to this user
    const tests = await payload.find({
      collection: 'tests',
      where: {
        assignedTo: { contains: Number(tokenPayload.id) },
      },
      depth: 0,
    })

    // Get user's test results
    const results = await payload.find({
      collection: 'test-results',
      where: {
        student: { equals: Number(tokenPayload.id) },
      },
    })

    // Map tests with completion status
    const testsWithStatus = tests.docs.map((test) => {
      const result = results.docs.find((r) => {
        const testRelation = r.test
        const testId = typeof testRelation === 'number' ? testRelation : testRelation?.id
        return testId === test.id
      })

      return {
        id: test.id,
        title: test.title,
        description: test.description,
        questionsCount: test.questions?.length || 0,
        completed: !!result,
        result: result
          ? {
              score: result.score,
              totalQuestions: result.totalQuestions,
              percentage: result.percentage,
              completedAt: result.completedAt,
            }
          : null,
      }
    })

    return NextResponse.json({ tests: testsWithStatus })
  } catch (error) {
    console.error('Error fetching tests:', error)
    return NextResponse.json({ error: 'Failed to fetch tests' }, { status: 500 })
  }
}
