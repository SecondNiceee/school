import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')
  
  if (!url) {
    return NextResponse.json({ error: 'URL parameter required' }, { status: 400 })
  }

  // Проверяем что это URL от Vercel Blob
  if (!url.includes('blob.vercel-storage.com') && !url.includes('public.blob.vercel-storage.com')) {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; FileProxy/1.0)',
      },
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch file' }, { status: response.status })
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream'
    const contentLength = response.headers.get('content-length')
    const contentDisposition = response.headers.get('content-disposition')

    const headers = new Headers({
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Access-Control-Allow-Origin': '*',
    })

    if (contentLength) {
      headers.set('Content-Length', contentLength)
    }
    
    if (contentDisposition) {
      headers.set('Content-Disposition', contentDisposition)
    }

    return new NextResponse(response.body, {
      status: 200,
      headers,
    })
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json({ error: 'Proxy failed' }, { status: 500 })
  }
}
