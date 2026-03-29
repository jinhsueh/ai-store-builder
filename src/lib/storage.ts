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

// ——— Vercel KV (production) ———
const useKV = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

async function kvGet(key: string): Promise<StoreConfig | null> {
  const { kv } = await import('@vercel/kv');
  return kv.get<StoreConfig>(key);
}

async function kvSet(key: string, value: StoreConfig): Promise<void> {
  const { kv } = await import('@vercel/kv');
  await kv.set(key, value);
}

// ——— Filesystem (local dev) ———
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

// ——— Public API (async to support KV) ———
export async function saveStore(config: StoreConfig): Promise<void> {
  if (useKV) {
    await kvSet(`store:${config.id}`, config);
  } else {
    fsSet(config.id, config);
  }
}

export async function getStore(id: string): Promise<StoreConfig | null> {
  if (id === 'demo') return DEMO_STORE;

  if (useKV) {
    return kvGet(`store:${id}`);
  }
  return fsGet(id);
}

export async function updateStore(id: string, updates: Partial<StoreConfig>): Promise<StoreConfig | null> {
  const existing = await getStore(id);
  if (!existing) return null;
  const updated = { ...existing, ...updates };
  await saveStore(updated);
  return updated;
}
