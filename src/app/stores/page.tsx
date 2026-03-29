'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { StoreConfig } from '@/lib/types';

const STYLE_LABELS: Record<string, string> = {
  minimal: 'Minimal',
  vibrant: 'Vibrant',
  luxury: 'Luxury',
};

export default function StoresPage() {
  const [stores, setStores] = useState<StoreConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const localStores: StoreConfig[] = [];
    const seenIds = new Set<string>();

    // Collect from localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('store_')) {
        try {
          const data = JSON.parse(localStorage.getItem(key)!) as StoreConfig;
          if (data.id && data.storeName) {
            localStores.push(data);
            seenIds.add(data.id);
          }
        } catch {}
      }
    }

    // Fetch from server and merge
    fetch('/api/stores')
      .then(r => r.ok ? r.json() : [])
      .then((serverStores: StoreConfig[]) => {
        const merged = [...localStores];
        for (const s of serverStores) {
          if (!seenIds.has(s.id)) {
            merged.push(s);
            seenIds.add(s.id);
          }
        }
        merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setStores(merged);
      })
      .catch(() => setStores(localStores))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">← Home</Link>
            <div className="h-4 w-px bg-gray-200" />
            <h1 className="text-lg font-bold text-gray-900">My Stores</h1>
          </div>
          <Link
            href="/create"
            className="bg-gray-900 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            + New Store
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
          </div>
        ) : stores.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🏪</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No stores yet</h2>
            <p className="text-gray-500 mb-6">Create your first AI-powered store in 3 minutes.</p>
            <Link
              href="/create"
              className="inline-block bg-gray-900 text-white font-semibold px-6 py-3 rounded-full text-sm hover:bg-gray-700 transition-colors"
            >
              Create Store →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map(store => (
              <Link
                key={store.id}
                href={`/preview/${store.id}`}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all group"
              >
                {/* Preview header bar */}
                <div
                  className="h-2"
                  style={{ backgroundColor: store.primaryColor || '#1a1a1a' }}
                />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {store.storeName}
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">{store.tagline}</p>
                    </div>
                    <span className="text-xs font-medium bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full shrink-0">
                      {STYLE_LABELS[store.brandStyle] || store.brandStyle}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>{store.products.length} products</span>
                    <span>·</span>
                    <span>{new Date(store.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
