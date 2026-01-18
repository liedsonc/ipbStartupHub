import { auth } from '@/lib/auth/config'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const session = await auth()
  const path = request.nextUrl.pathname

  if (path.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  if (path.startsWith('/login') || path.startsWith('/register')) {
    if (session) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  if (path.startsWith('/admin')) {
    if (!session || session.user.role !== 'Admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  if (path.startsWith('/submit') || path.startsWith('/profile')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
  }

  if (path.startsWith('/api/ideas') || path.startsWith('/api/interests') || path.startsWith('/api/users') || path.startsWith('/api/notifications')) {
    if (!session && (request.method === 'POST' || request.method === 'PUT' || request.method === 'DELETE' || request.method === 'PATCH')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/submit/:path*',
    '/profile/:path*',
    '/inbox/:path*',
    '/api/ideas/:path*',
    '/api/interests/:path*',
    '/api/users/:path*',
    '/api/notifications/:path*',
    '/login',
    '/register'
  ]
}

