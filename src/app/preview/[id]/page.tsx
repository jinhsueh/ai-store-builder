'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import StorefrontRenderer from '@/components/StorefrontRenderer';
import type { StoreConfig, FontPack } from '@/lib/types';

export default function PreviewPage() {
  const { id } = useParams<{ id: string }>();
  const [config, setConfig] = useState<StoreConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileView, setMobileView] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Try localStorage first (primary storage on Vercel)
    const stored = localStorage.getItem(`store_${id}`);
    if (stored) {
      try {
        setConfig(JSON.parse(stored));
        setLoading(false);
        return;
      } catch {}
    }
    // Fall back to API (works in local dev)
    fetch(`/api/store/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data && !data.error) setConfig(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const updateColor = (color: string) => setConfig(c => c ? { ...c, primaryColor: color } : c);
  const updateFont = (font: FontPack) => setConfig(c => c ? { ...c, fontPack: font } : c);

  const encodeConfig = (c: StoreConfig): string => {
    return btoa(unescape(encodeURIComponent(JSON.stringify(c))));
  };

  const saveAndPublish = async () => {
    if (!config) return;
    // Save to localStorage
    localStorage.setItem(`store_${id}`, JSON.stringify(config));
    // Best-effort server save
    fetch(`/api/store/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    }).catch(() => {});
    setSaved(true);
  };

  const copyLink = () => {
    if (!config) return;
    const encoded = encodeConfig(config);
    navigator.clipboard.writeText(`${window.location.origin}/store/${id}#${encoded}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin"></div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center">
        <div>
          <p className="text-gray-500 mb-4">Store not found.</p>
          <Link href="/create" className="text-indigo-600 underline">Create a new store</Link>
        </div>
      </div>
    );
  }

  const colors = [
    { value: '#1a1a1a', label: 'Black' },
    { value: '#6366f1', label: 'Indigo' },
    { value: '#10b981', label: 'Emerald' },
    { value: '#f43f5e', label: 'Rose' },
    { value: '#f59e0b', label: 'Amber' },
    { value: '#8b5cf6', label: 'Violet' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between gap-4 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1">
            ← Back
          </Link>
          <div className="h-4 w-px bg-gray-200"></div>
          <span className="text-sm font-semibold text-gray-800">{config.storeName}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileView(v => !v)}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${mobileView ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {mobileView ? '🖥 Desktop' : '📱 Mobile'}
          </button>
          <button
            onClick={copyLink}
            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            {copied ? '✓ Copied!' : '🔗 Copy Link'}
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-1 overflow-hidden">
        {/* Preview */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className={mobileView ? 'max-w-[390px] mx-auto border-4 border-gray-800 rounded-[40px] shadow-2xl overflow-hidden' : 'rounded-xl overflow-hidden shadow-sm border border-gray-200'}>
            <StorefrontRenderer config={config} editable={true} onUpdate={setConfig} />
          </div>
        </div>

        {/* Edit Sidebar */}
        <div className="w-72 bg-white border-l border-gray-200 flex flex-col overflow-y-auto">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-sm">Edit Store</h3>
          </div>

          <div className="p-5 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Theme Color</p>
            <div className="flex gap-2 flex-wrap">
              {colors.map(c => (
                <button
                  key={c.value}
                  onClick={() => updateColor(c.value)}
                  title={c.label}
                  className={`w-8 h-8 rounded-full transition-all ${config.primaryColor === c.value ? 'ring-2 ring-offset-2 ring-gray-900 scale-110' : 'hover:scale-105'}`}
                  style={{ backgroundColor: c.value }}
                />
              ))}
            </div>
          </div>

          <div className="p-5 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Font Style</p>
            <div className="grid grid-cols-3 gap-2">
              {(['modern', 'classic', 'playful'] as FontPack[]).map(f => (
                <button
                  key={f}
                  onClick={() => updateFont(f)}
                  className={`py-2 px-2 rounded-lg text-xs font-medium border transition-colors capitalize ${
                    config.fontPack === f
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Products ({config.products.length})</p>
            <div className="space-y-2">
              {config.products.map(p => (
                <div key={p.id} className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 truncate">{p.name}</p>
                    <p className="text-xs text-gray-400">NT${p.price}</p>
                  </div>
                  {p.stripePaymentLink ? (
                    <span className="text-xs text-green-600 shrink-0">✓ Stripe</span>
                  ) : (
                    <span className="text-xs text-gray-400 shrink-0">No checkout</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 mt-auto">
            {saved ? (
              <div className="text-center">
                <div className="text-green-600 font-semibold text-sm mb-3">✓ Store saved!</div>
                <button
                  onClick={copyLink}
                  className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl text-sm hover:bg-indigo-700 transition-colors"
                >
                  {copied ? '✓ Link Copied!' : 'Copy Store Link 🔗'}
                </button>
                <a
                  href={`/store/${id}`}
                  target="_blank"
                  className="block text-center text-xs text-indigo-600 mt-3 hover:underline"
                >
                  Open live store →
                </a>
              </div>
            ) : (
              <button
                onClick={saveAndPublish}
                className="w-full bg-gray-900 text-white font-semibold py-3 rounded-xl text-sm hover:bg-gray-700 transition-colors"
              >
                Save & Publish →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
