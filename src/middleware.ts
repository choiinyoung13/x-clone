import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from './auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 인증 체크가 필요한 페이지
  if (
    ['/compose/tweet', '/home', '/explore', '/messages', '/search'].includes(
      pathname
    )
  ) {
    const session = await auth()
    if (!session) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/i/flow/login`
      )
    }
  }

  // /api/auth를 제외한 모든 /api/* 경로를 백엔드로 프록시
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth')) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    if (baseUrl) {
      try {
        const url = new URL(pathname + request.nextUrl.search, baseUrl)

        // 요청 본문 읽기
        let body: ReadableStream | null = null
        if (request.method !== 'GET' && request.method !== 'HEAD') {
          body = request.body
        }

        // 헤더 복사 (중요한 헤더만)
        const headers = new Headers()
        request.headers.forEach((value, key) => {
          // 호스트 헤더는 제외
          if (key.toLowerCase() !== 'host') {
            headers.set(key, value)
          }
        })

        const response = await fetch(url, {
          method: request.method,
          headers: headers,
          body: body,
        })

        const data = await response.text()

        // 응답 헤더 복사
        const responseHeaders = new Headers()
        response.headers.forEach((value, key) => {
          // CORS 관련 헤더는 제거 (Next.js가 처리)
          if (!key.toLowerCase().startsWith('access-control-')) {
            responseHeaders.set(key, value)
          }
        })

        return new NextResponse(data, {
          status: response.status,
          statusText: response.statusText,
          headers: responseHeaders,
        })
      } catch (error) {
        console.error('Proxy error:', error)
        return NextResponse.next()
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/compose/tweet',
    '/home',
    '/explore',
    '/messages',
    '/search',
    '/api/:path*',
  ],
}
