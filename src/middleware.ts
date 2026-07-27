import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const headers = new Headers(request.headers)
  headers.set('x-pathname', request.nextUrl.pathname)

  return NextResponse.next({ request: { headers } })
}

export const config = {
  matcher: ['/((?!admin|api|_next/static|_next/image|favicon.svg).*)'],
}
