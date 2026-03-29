import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSession, deleteSession } from '@/lib/auth';

export async function GET() {
  const cookieStore = cookies();
  const sessionId = cookieStore.get('storeai_session')?.value;

  if (!sessionId) {
    return NextResponse.json({ email: null });
  }

  const email = await getSession(sessionId);
  if (!email) {
    // Session expired or invalid — clear the cookie
    const response = NextResponse.json({ email: null });
    response.cookies.delete('storeai_session');
    return response;
  }

  return NextResponse.json({ email });
}

export async function DELETE() {
  const cookieStore = cookies();
  const sessionId = cookieStore.get('storeai_session')?.value;

  if (sessionId) {
    await deleteSession(sessionId);
  }

  const response = NextResponse.json({ success: true });
  response.cookies.delete('storeai_session');
  return response;
}
