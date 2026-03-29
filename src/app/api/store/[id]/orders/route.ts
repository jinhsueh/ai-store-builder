import { NextResponse } from 'next/server';

async function getRedis() {
  if (!process.env.REDIS_URL) return null;
  const Redis = (await import('ioredis')).default;
  return new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 2,
    connectTimeout: 5000,
  });
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const redis = await getRedis();
  if (!redis) {
    return NextResponse.json({ orders: [], salesCount: 0 });
  }

  const [rawOrders, salesCount] = await Promise.all([
    redis.lrange(`orders:${params.id}`, 0, 49),
    redis.get(`sales:${params.id}`),
  ]);
  redis.disconnect();

  const orders = rawOrders.map(o => {
    try { return JSON.parse(o); } catch { return null; }
  }).filter(Boolean);

  return NextResponse.json({
    orders,
    salesCount: salesCount ? parseInt(salesCount, 10) : 0,
  });
}
