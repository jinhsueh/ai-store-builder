import fs from 'fs';
import path from 'path';
import { StoreConfig } from './types';

const DATA_DIR = path.join(process.cwd(), 'data', 'stores');

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
