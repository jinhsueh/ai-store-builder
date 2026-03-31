'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { StoreConfig } from '@/lib/types';

const STYLE_LABELS: Record<string, string> = {
  minimal: 'Minimal',
  vibrant: 'Vibrant',
  luxury: 'Luxury',
  bold: 'Bold',
  natural: 'Natural',
};

export default function StoresPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" /></div>}>
      <StoresContent />
    </Suspense>
  );
}

function StoresContent() {
  const searchParams = useSearchParams();
  const [stores, setStores] = useState<StoreConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [sendingLink, setSendingLink] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const [authError, setAuthError] = useState('');
  const [storeStats, setStoreStats] = useState<Record<string, { views: number; sales: number }>>({});

  const error = searchParams.get('error');

  const loadStores = useCallback((userEmail?: string) => {
    setLoading(true);
    const localStores: StoreConfig[] = [];
    const seenIds = new Set<string>();

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

    const url = userEmail
      ? `/api/stores/by-email?email=${encodeURIComponent(userEmail)}`
      : '/api/stores';

    fetch(url)
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
        // Fetch stats for all stores
        for (const s of merged) {
          Promise.all([
            fetch(`/api/store/${s.id}/views`).then(r => r.ok ? r.json() : null).catch(() => null),
            fetch(`/api/store/${s.id}/orders`).then(r => r.ok ? r.json() : null).catch(() => null),
          ]).then(([viewData, orderData]) => {
            setStoreStats(prev => ({
              ...prev,
              [s.id]: { views: viewData?.views || 0, sales: orderData?.salesCount || 0 },
            }));
          });
        }
      })
      .catch(() => setStores(localStores))
      .finally(() => setLoading(false));
  }, []);

  // Check session on mount
  useEffect(() => {
    fetch('/api/auth/session')
      .then(r => r.json())
      .then(data => {
        if (data.email) {
          setEmail(data.email);
          localStorage.setItem('storeai_email', data.email);
          loadStores(data.email);
        } else {
          // Check localStorage fallback
          const savedEmail = localStorage.getItem('storeai_email');
          if (savedEmail) {
            setEmail(savedEmail);
            loadStores(savedEmail);
          } else {
            loadStores();
          }
        }
      })
      .catch(() => loadStores());
  }, [loadStores]);

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setSendingLink(true);
    setAuthError('');
    try {
      const res = await fetch('/api/auth/send-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // If magicUrl returned (dev mode), auto-redirect
      if (data.magicUrl) {
        window.location.href = data.magicUrl;
        return;
      }
      setLinkSent(true);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Failed to send link');
    }
    setSendingLink(false);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/session', { method: 'DELETE' }).catch(() => {});
    localStorage.removeItem('storeai_email');
    setEmail(null);
    setLinkSent(false);
    setEmailInput('');
    loadStores();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">← Home</Link>
            <div className="h-4 w-px bg-gray-200" />
            <h1 className="text-lg font-bold text-gray-900">My Stores</h1>
          </div>
          <div className="flex items-center gap-3">
            {email && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">{email}</span>
                <button onClick={handleLogout} className="text-xs text-gray-400 hover:text-gray-600">Logout</button>
              </div>
            )}
            <Link
              href="/create"
              className="bg-gray-900 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              + New Store
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Auth errors from redirect */}
        {error === 'invalid_token' && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <p className="text-sm text-red-600">This login link has expired or already been used. Please request a new one.</p>
          </div>
        )}

        {/* Login form */}
        {!email && !linkSent && (
          <div className="mb-8 bg-white rounded-xl border border-gray-200 p-8 max-w-md mx-auto text-center">
            <div className="text-3xl mb-3">✦</div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">Welcome to StoreAI</h2>
            <p className="text-sm text-gray-400 mb-6">Enter your email to access your stores. We&apos;ll send you a sign-in link.</p>
            <form onSubmit={handleSendLink}>
              <input
                type="email"
                placeholder="you@example.com"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                required
                autoFocus
                className="w-full text-sm border border-gray-200 rounded-xl px-4 py-3 mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={sendingLink || !emailInput.trim()}
                className="w-full bg-gray-900 text-white text-sm font-semibold px-4 py-3 rounded-xl hover:bg-gray-700 disabled:opacity-40 transition-colors"
              >
                {sendingLink ? 'Sending...' : 'Send Sign-In Link'}
              </button>
            </form>
            {authError && <p className="text-xs text-red-500 mt-3">{authError}</p>}
            <p className="text-xs text-gray-300 mt-4">No password needed. We&apos;ll email you a one-click login link.</p>
          </div>
        )}

        {/* Link sent confirmation */}
        {!email && linkSent && (
          <div className="mb-8 bg-white rounded-xl border border-gray-200 p-8 max-w-md mx-auto text-center">
            <div className="text-3xl mb-3">📬</div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Check your email</h2>
            <p className="text-sm text-gray-500 mb-1">
              We sent a sign-in link to <span className="font-semibold text-gray-700">{emailInput}</span>
            </p>
            <p className="text-xs text-gray-400 mb-6">Click the link in the email to sign in. It expires in 15 minutes.</p>
            <button
              onClick={() => { setLinkSent(false); setEmailInput(''); }}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              Use a different email
            </button>
          </div>
        )}

        {/* Store list */}
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
            {stores.map(store => {
              const stats = storeStats[store.id];
              return (
                <div key={store.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all group relative">
                  <Link href={`/preview/${store.id}`}>
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
                      {stats && (stats.views > 0 || stats.sales > 0) && (
                        <div className="flex items-center gap-3 mt-2">
                          {stats.views > 0 && (
                            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{stats.views} views</span>
                          )}
                          {stats.sales > 0 && (
                            <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{stats.sales} sales</span>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                  {store.id !== 'demo' && (
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (!confirm(`Delete "${store.storeName}"? This cannot be undone.`)) return;
                        try { await fetch(`/api/store/${store.id}`, { method: 'DELETE' }); } catch {}
                        localStorage.removeItem(`store_${store.id}`);
                        setStores(prev => prev.filter(s => s.id !== store.id));
                      }}
                      className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 text-xs"
                      title="Delete store"
                    >
                      ✕
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
