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

  // /api/auth는 Next.js API Route가 처리하므로 middleware에서 건드리지 않음
  // 나머지 /api/*는 next.config.ts의 rewrites가 처리

  return NextResponse.next()
}

export const config = {
  matcher: ['/compose/tweet', '/home', '/explore', '/messages', '/search'],
}
