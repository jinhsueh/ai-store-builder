import fs from 'fs';
import path from 'path';
import { StoreConfig } from './types';

const DATA_DIR = path.join(process.cwd(), 'data', 'stores');

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

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function saveStore(config: StoreConfig): void {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, `${config.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(config, null, 2), 'utf-8');
}

export function getStore(id: string): StoreConfig | null {
  if (id === 'demo') return DEMO_STORE;

  ensureDataDir();
  const filePath = path.join(DATA_DIR, `${id}.json`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as StoreConfig;
  } catch {
    return null;
  }
}

export function updateStore(id: string, updates: Partial<StoreConfig>): StoreConfig | null {
  const existing = getStore(id);
  if (!existing) return null;
  const updated = { ...existing, ...updates };
  saveStore(updated);
  return updated;
}
