import { NextResponse } from 'next/server';
import { verifyMagicToken, createSession } from '@/lib/auth';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');
  const redirect = searchParams.get('redirect') || '/stores';

  if (!token) {
    return NextResponse.redirect(new URL('/stores?error=missing_token', req.url));
  }

  const email = await verifyMagicToken(token);
  if (!email) {
    return NextResponse.redirect(new URL('/stores?error=invalid_token', req.url));
  }

  // Create session
  const sessionId = await createSession(email);

  // Set cookie and redirect
  const response = NextResponse.redirect(new URL(redirect, req.url));
  response.cookies.set('storeai_session', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  });

  return response;
}
