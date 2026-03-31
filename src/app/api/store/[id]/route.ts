import { NextResponse } from 'next/server';
import { getStore, updateStore, deleteStore } from '@/lib/storage';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const store = await getStore(params.id);
  if (!store) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(store);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const updates = await req.json();
    const updated = await updateStore(params.id, updates);
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, store: updated });
  } catch {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const deleted = await deleteStore(params.id);
    if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
