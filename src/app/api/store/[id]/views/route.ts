import { NextResponse } from 'next/server';
import { incrementViews, getViews } from '@/lib/storage';

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const count = await incrementViews(params.id);
  return NextResponse.json({ views: count });
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const count = await getViews(params.id);
  return NextResponse.json({ views: count });
}
