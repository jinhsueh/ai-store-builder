import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { saveStore } from '@/lib/storage';
import type { StoreConfig } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const config: StoreConfig = {
      ...body,
      id: nanoid(10),
      createdAt: new Date().toISOString(),
    };
    await saveStore(config);
    return NextResponse.json({ id: config.id, success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Save failed' }, { status: 500 });
  }
}
