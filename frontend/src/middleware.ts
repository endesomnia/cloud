import { NextRequest, NextResponse } from 'next/server'
import { auth } from './auth'
import Cookies from 'js-cookie'

export default async function Middleware(req: NextRequest) {
  const session = await auth()
  const userID = Cookies.get('userId')
  const token = Cookies.get('token')

  if (!session) {
    NextResponse.redirect(new URL('/', req.url))
  }

  if (!userID && !token) {
    NextResponse.redirect(new URL('/', req.url))
  }

  NextResponse.next()
}

export const config = {
  matcher: ['/:path*', '/((?!api/auth).*)', '/((?!login).*)'],
}
