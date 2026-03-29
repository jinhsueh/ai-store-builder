'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import StorefrontRenderer from '@/components/StorefrontRenderer';
import type { StoreConfig } from '@/lib/types';

export default function StorePage() {
  const { id } = useParams<{ id: string }>();
  const [config, setConfig] = useState<StoreConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Try URL hash (shared links carry full config)
    if (window.location.hash.length > 1) {
      try {
        const encoded = window.location.hash.slice(1);
        const json = decodeURIComponent(escape(atob(encoded)));
        const data: StoreConfig = JSON.parse(json);
        setConfig(data);
        // Cache in localStorage for future visits
        localStorage.setItem(`store_${id}`, JSON.stringify(data));
        setLoading(false);
        return;
      } catch {
        // Invalid hash, continue to next source
      }
    }

    // 2. Try localStorage
    const stored = localStorage.getItem(`store_${id}`);
    if (stored) {
      try {
        setConfig(JSON.parse(stored));
        setLoading(false);
        return;
      } catch {}
    }

    // 3. Fall back to API (local dev / demo store)
    fetch(`/api/store/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data && !data.error) setConfig(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin"></div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-center p-8">
        <div>
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Store not found</h1>
          <p className="text-gray-500 mb-6 max-w-md">
            This store may have expired or the link is incomplete.<br />
            Store data is included in the full share link.
          </p>
          <a
            href="/create"
            className="inline-block bg-gray-900 text-white font-semibold px-6 py-3 rounded-full text-sm hover:bg-gray-700 transition-colors"
          >
            Create Your Own Store →
          </a>
        </div>
      </div>
    );
  }

  return <StorefrontRenderer config={config} editable={false} />;
}
