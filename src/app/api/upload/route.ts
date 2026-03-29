import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Max 2MB for base64 (reasonable for product images)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: 'File must be under 2MB' }, { status: 400 });
    }

    // Try Vercel Blob if token is available
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { put } = await import('@vercel/blob');
        const blob = await put(`products/${Date.now()}-${file.name}`, file, {
          access: 'public',
        });
        return NextResponse.json({ url: blob.url });
      } catch (err) {
        console.warn('Blob upload failed, falling back to base64:', err);
      }
    }

    // Fallback: convert to base64 data URL
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;
    return NextResponse.json({ url: dataUrl });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
