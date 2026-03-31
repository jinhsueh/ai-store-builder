import { StoreConfig } from './types';

const DEMO_STORE: StoreConfig = {
  id: 'demo',
  createdAt: '2026-03-29T00:00:00.000Z',
  storeName: 'Roast & Co.',
  tagline: 'Every cup tells a story.',
  category: 'specialty coffee',
  brandStyle: 'minimal',
  primaryColor: '#1a1a1a',
  fontPack: 'modern',
  products: [
    {
      id: 'demo-1',
      name: 'Premium Black Coffee',
      price: 280,
      imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800',
      description: 'A rich, full-bodied dark roast with notes of dark chocolate and toasted walnut. Sourced from single-estate farms in Colombia, each batch is carefully roasted to bring out a smooth, lingering finish that transforms your morning ritual.',
      stripePaymentLink: 'https://buy.stripe.com/test_demo_1',
    },
    {
      id: 'demo-2',
      name: 'Single Origin Ethiopia',
      price: 320,
      imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800',
      description: 'Bright and floral with delicate notes of jasmine and ripe blueberry. Hand-picked from Yirgacheffe highlands at 1,800 meters elevation, this light roast captures the essence of Ethiopian coffee tradition in every sip.',
      stripePaymentLink: 'https://buy.stripe.com/test_demo_2',
    },
    {
      id: 'demo-3',
      name: 'Cold Brew Pack',
      price: 240,
      imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800',
      description: 'Silky smooth and naturally sweet, our signature cold brew is steeped for 18 hours using a proprietary blend. Low acidity and refreshingly bold — perfect over ice on warm afternoons or as your daily grab-and-go companion.',
      stripePaymentLink: 'https://buy.stripe.com/test_demo_3',
    },
  ],
};

// ——— Redis (production) ———
let redisClient: import('ioredis').default | null = null;

async function getRedis() {
  if (redisClient) return redisClient;
  if (!process.env.REDIS_URL) return null;

  const Redis = (await import('ioredis')).default;
  redisClient = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 2,
    connectTimeout: 5000,
  });
  return redisClient;
}

// ——— Filesystem (local dev fallback) ———
function fsGet(id: string): StoreConfig | null {
  const fs = require('fs') as typeof import('fs');
  const path = require('path') as typeof import('path');
  const dir = path.join(process.cwd(), 'data', 'stores');
  const filePath = path.join(dir, `${id}.json`);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as StoreConfig;
  } catch {
    return null;
  }
}

function fsSet(id: string, config: StoreConfig): void {
  const fs = require('fs') as typeof import('fs');
  const path = require('path') as typeof import('path');
  const dir = path.join(process.cwd(), 'data', 'stores');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${id}.json`), JSON.stringify(config, null, 2), 'utf-8');
}

// ——— Public API ———
export async function saveStore(config: StoreConfig): Promise<void> {
  const redis = await getRedis();
  if (redis) {
    await redis.set(`store:${config.id}`, JSON.stringify(config));
    await redis.sadd('store:index', config.id);
    if (config.ownerEmail) {
      await redis.sadd(`email:${config.ownerEmail}`, config.id);
    }
    return;
  }
  fsSet(config.id, config);
}

export async function listStores(): Promise<StoreConfig[]> {
  const redis = await getRedis();
  if (redis) {
    const ids = await redis.smembers('store:index');
    if (ids.length === 0) return [];
    const pipeline = redis.pipeline();
    for (const id of ids) pipeline.get(`store:${id}`);
    const results = await pipeline.exec();
    if (!results) return [];
    return results
      .map(([err, data]) => {
        if (err || !data) return null;
        try { return JSON.parse(data as string) as StoreConfig; } catch { return null; }
      })
      .filter((s): s is StoreConfig => s !== null)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  // Filesystem fallback
  const fs = require('fs') as typeof import('fs');
  const path = require('path') as typeof import('path');
  const dir = path.join(process.cwd(), 'data', 'stores');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((f: string) => f.endsWith('.json'))
    .map((f: string) => { try { return JSON.parse(fs.readFileSync(path.join(dir, f), 'utf-8')); } catch { return null; } })
    .filter((s: StoreConfig | null): s is StoreConfig => s !== null)
    .sort((a: StoreConfig, b: StoreConfig) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getStore(id: string): Promise<StoreConfig | null> {
  if (id === 'demo') return DEMO_STORE;

  const redis = await getRedis();
  if (redis) {
    const data = await redis.get(`store:${id}`);
    if (!data) return null;
    return JSON.parse(data) as StoreConfig;
  }
  return fsGet(id);
}

export async function incrementViews(id: string): Promise<number> {
  const redis = await getRedis();
  if (redis) {
    return redis.incr(`views:${id}`);
  }
  return 0;
}

export async function getViews(id: string): Promise<number> {
  const redis = await getRedis();
  if (redis) {
    const count = await redis.get(`views:${id}`);
    return count ? parseInt(count, 10) : 0;
  }
  return 0;
}

export async function getStoresByEmail(email: string): Promise<StoreConfig[]> {
  const redis = await getRedis();
  if (redis) {
    const ids = await redis.smembers(`email:${email}`);
    if (ids.length === 0) return [];
    const pipeline = redis.pipeline();
    for (const id of ids) pipeline.get(`store:${id}`);
    const results = await pipeline.exec();
    if (!results) return [];
    return results
      .map(([err, data]) => {
        if (err || !data) return null;
        try { return JSON.parse(data as string) as StoreConfig; } catch { return null; }
      })
      .filter((s): s is StoreConfig => s !== null)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  return [];
}

export async function deleteStore(id: string): Promise<boolean> {
  if (id === 'demo') return false;
  const redis = await getRedis();
  if (redis) {
    const data = await redis.get(`store:${id}`);
    if (!data) return false;
    try {
      const store = JSON.parse(data) as StoreConfig;
      if (store.ownerEmail) {
        await redis.srem(`email:${store.ownerEmail}`, id);
      }
    } catch {}
    await redis.del(`store:${id}`);
    await redis.srem('store:index', id);
    await redis.del(`views:${id}`);
    return true;
  }
  // Filesystem fallback
  const fs = require('fs') as typeof import('fs');
  const path = require('path') as typeof import('path');
  const filePath = path.join(process.cwd(), 'data', 'stores', `${id}.json`);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }
  return false;
}

export async function updateStore(id: string, updates: Partial<StoreConfig>): Promise<StoreConfig | null> {
  const existing = await getStore(id);
  if (!existing) return null;
  const updated = { ...existing, ...updates };
  await saveStore(updated);
  return updated;
}
