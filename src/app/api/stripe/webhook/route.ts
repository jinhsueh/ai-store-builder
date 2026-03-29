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
