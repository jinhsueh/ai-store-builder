import { NextResponse } from 'next/server';

async function getRedis() {
  if (!process.env.REDIS_URL) return null;
  const Redis = (await import('ioredis')).default;
  return new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 2,
    connectTimeout: 5000,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature');

    // If we have a webhook secret, verify the signature
    let event;
    if (process.env.STRIPE_WEBHOOK_SECRET && sig) {
      const stripe = new (await import('stripe')).default(process.env.STRIPE_SECRET_KEY!);
      event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } else {
      event = JSON.parse(body);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const order = {
        id: session.id,
        email: session.customer_details?.email || '',
        amount: session.amount_total,
        currency: session.currency,
        status: session.payment_status,
        createdAt: new Date().toISOString(),
        metadata: session.metadata || {},
      };

      const redis = await getRedis();
      if (redis) {
        // Store order and add to store's order list if store ID in metadata
        await redis.lpush('orders:all', JSON.stringify(order));
        if (order.metadata.storeId) {
          await redis.lpush(`orders:${order.metadata.storeId}`, JSON.stringify(order));
          await redis.incr(`sales:${order.metadata.storeId}`);

          // Notify store owner via email
          if (process.env.RESEND_API_KEY) {
            try {
              const storeData = await redis.get(`store:${order.metadata.storeId}`);
              if (storeData) {
                const store = JSON.parse(storeData);
                if (store.ownerEmail) {
                  const { Resend } = await import('resend');
                  const resend = new Resend(process.env.RESEND_API_KEY);
                  const amount = order.amount ? `${(order.amount / 100).toFixed(2)} ${(order.currency || 'usd').toUpperCase()}` : 'N/A';
                  await resend.emails.send({
                    from: process.env.RESEND_FROM_EMAIL || 'StoreAI <noreply@storeai.app>',
                    to: store.ownerEmail,
                    subject: `New order for ${store.storeName}!`,
                    html: `
                      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
                        <h2 style="color: #111;">New Sale on ${store.storeName}</h2>
                        <p style="color: #555;">You just received a new order:</p>
                        <div style="background: #f9fafb; border-radius: 12px; padding: 20px; margin: 16px 0;">
                          <p style="margin: 0 0 8px;"><strong>Amount:</strong> ${amount}</p>
                          <p style="margin: 0 0 8px;"><strong>Customer:</strong> ${order.email || 'N/A'}</p>
                          <p style="margin: 0;"><strong>Time:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
                        </div>
                        <p style="color: #999; font-size: 12px;">Powered by StoreAI</p>
                      </div>
                    `,
                  });
                }
              }
            } catch (emailErr) {
              console.error('Order notification email failed:', emailErr);
            }
          }
        }
        redis.disconnect();
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 400 });
  }
}
