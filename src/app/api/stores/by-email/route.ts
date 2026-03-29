import { NextResponse } from 'next/server';
import { getStoresByEmail } from '@/lib/storage';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 });
  }
  const stores = await getStoresByEmail(email);
  return NextResponse.json(stores);
}
