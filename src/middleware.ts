import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from './auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 인증 체크가 필요한 페이지
  if (['/compose/tweet', '/home', '/explore', '/messages', '/search'].includes(pathname)) {
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
      const url = request.nextUrl.clone()
      url.href = `${baseUrl}${pathname}${url.search}`
      
      return NextResponse.rewrite(url)
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
