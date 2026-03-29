import { NextResponse } from 'next/server';
import { createMagicToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    const token = await createMagicToken(email.trim().toLowerCase());
    const origin = req.headers.get('origin') || req.headers.get('referer')?.replace(/\/[^/]*$/, '') || '';
    const magicUrl = `${origin}/api/auth/verify?token=${token}`;

    // Send email via Resend if configured
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'StoreAI <noreply@resend.dev>',
          to: email.trim(),
          subject: 'Sign in to StoreAI',
          html: `
            <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
              <h2 style="font-size: 20px; font-weight: 600; color: #111;">Sign in to StoreAI</h2>
              <p style="color: #666; font-size: 14px; line-height: 1.6;">
                Click the button below to sign in. This link expires in 15 minutes.
              </p>
              <a href="${magicUrl}" style="display: inline-block; background: #111; color: #fff; font-weight: 600; font-size: 14px; padding: 12px 28px; border-radius: 8px; text-decoration: none; margin: 20px 0;">
                Sign In →
              </a>
              <p style="color: #999; font-size: 12px; margin-top: 24px;">
                If you didn't request this, you can safely ignore this email.
              </p>
            </div>
          `,
        });
        return NextResponse.json({ sent: true });
      } catch (err) {
        console.error('Email send failed:', err);
      }
    }

    // Fallback: return the magic link directly (for dev/testing)
    return NextResponse.json({ sent: true, magicUrl });
  } catch (err) {
    console.error('Send link error:', err);
    return NextResponse.json({ error: 'Failed to send link' }, { status: 500 });
  }
}
