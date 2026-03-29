'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import StorefrontRenderer from '@/components/StorefrontRenderer';
import type { StoreConfig, FontPack, BrandStyle, Currency } from '@/lib/types';

export default function PreviewPage() {
  const { id } = useParams<{ id: string }>();
  const [config, setConfig] = useState<StoreConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileView, setMobileView] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: 0, imageUrl: '', description: '' });
  const [uploading, setUploading] = useState(false);
  const [views, setViews] = useState<number | null>(null);
  const [sales, setSales] = useState<number | null>(null);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [emailInput, setEmailInput] = useState('');

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

    // Fetch view count + sales
    fetch(`/api/store/${id}/views`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setViews(data.views); })
      .catch(() => {});
    fetch(`/api/store/${id}/orders`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setSales(data.salesCount); })
      .catch(() => {});
  }, [id]);

  const updateColor = (color: string) => setConfig(c => c ? { ...c, primaryColor: color } : c);
  const updateFont = (font: FontPack) => setConfig(c => c ? { ...c, fontPack: font } : c);

  const encodeConfig = (c: StoreConfig): string => {
    return btoa(unescape(encodeURIComponent(JSON.stringify(c))));
  };

  const saveAndPublish = async (email?: string) => {
    if (!config) return;
    const finalEmail = email || localStorage.getItem('storeai_email') || undefined;
    const configToSave = finalEmail ? { ...config, ownerEmail: finalEmail } : config;
    if (finalEmail) {
      localStorage.setItem('storeai_email', finalEmail);
      setConfig(configToSave);
    }
    // Save to localStorage
    localStorage.setItem(`store_${id}`, JSON.stringify(configToSave));
    // Best-effort server save
    fetch(`/api/store/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(configToSave),
    }).catch(() => {});
    setSaved(true);
    setShowEmailCapture(false);
  };

  const handlePublishClick = () => {
    const hasEmail = localStorage.getItem('storeai_email');
    if (hasEmail) {
      saveAndPublish();
    } else {
      setShowEmailCapture(true);
    }
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
          {views !== null && views > 0 && (
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{views} views</span>
          )}
          {sales !== null && sales > 0 && (
            <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{sales} sales</span>
          )}
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
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Template</p>
            <div className="grid grid-cols-3 gap-2">
              {([
                { value: 'minimal' as BrandStyle, label: 'Minimal', icon: '◻' },
                { value: 'vibrant' as BrandStyle, label: 'Vibrant', icon: '◆' },
                { value: 'luxury' as BrandStyle, label: 'Luxury', icon: '✦' },
                { value: 'bold' as BrandStyle, label: 'Bold', icon: '■' },
                { value: 'natural' as BrandStyle, label: 'Natural', icon: '🌿' },
              ]).map(t => (
                <button
                  key={t.value}
                  onClick={() => setConfig(c => c ? { ...c, brandStyle: t.value } : c)}
                  className={`py-2 px-2 rounded-lg text-xs font-medium border transition-colors text-center ${
                    config.brandStyle === t.value
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <span className="block text-base mb-0.5">{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>
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
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Currency</p>
            <div className="grid grid-cols-5 gap-1">
              {([
                { value: 'USD' as Currency, label: '$' },
                { value: 'TWD' as Currency, label: 'NT$' },
                { value: 'EUR' as Currency, label: '€' },
                { value: 'GBP' as Currency, label: '£' },
                { value: 'JPY' as Currency, label: '¥' },
              ]).map(c => (
                <button
                  key={c.value}
                  onClick={() => setConfig(cfg => cfg ? { ...cfg, currency: c.value } : cfg)}
                  className={`py-1.5 px-1 rounded-md text-xs font-medium border transition-colors text-center ${
                    (config.currency || 'USD') === c.value
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                  title={c.value}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Products ({config.products.length})</p>
            <div className="space-y-2">
              {config.products.map(p => (
                <div key={p.id} className="flex items-center gap-2">
                  <label className="w-8 h-8 rounded bg-gray-100 overflow-hidden shrink-0 cursor-pointer relative group" title="Change image">
                    {p.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="flex items-center justify-center w-full h-full text-xs text-gray-400">+</span>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-[10px]">Edit</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const form = new FormData();
                        form.append('file', file);
                        try {
                          const res = await fetch('/api/upload', { method: 'POST', body: form });
                          const data = await res.json();
                          if (data.url) {
                            setConfig(c => c ? { ...c, products: c.products.map(x => x.id === p.id ? { ...x, imageUrl: data.url } : x) } : c);
                          }
                        } catch {}
                        e.target.value = '';
                      }}
                    />
                  </label>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 truncate">{p.name}</p>
                    <p className="text-xs text-gray-400">{{ USD: '$', TWD: 'NT$', EUR: '€', GBP: '£', JPY: '¥' }[config.currency || 'USD']}{p.price}</p>
                  </div>
                  <button
                    onClick={() => setConfig(c => c ? { ...c, products: c.products.filter(x => x.id !== p.id) } : c)}
                    className="text-xs text-red-400 hover:text-red-600 shrink-0"
                    title="Remove product"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
            {!showAddProduct ? (
              <button
                onClick={() => setShowAddProduct(true)}
                className="mt-3 w-full text-xs text-indigo-600 hover:text-indigo-800 font-medium py-1.5 border border-dashed border-indigo-300 rounded-lg hover:border-indigo-400 transition-colors"
              >
                + Add Product
              </button>
            ) : (
              <div className="mt-3 space-y-2 p-3 bg-gray-50 rounded-lg">
                <input
                  type="text"
                  placeholder="Product name"
                  value={newProduct.name}
                  onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))}
                  className="w-full text-xs border border-gray-200 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={newProduct.price || ''}
                  onChange={e => setNewProduct(p => ({ ...p, price: Number(e.target.value) }))}
                  className="w-full text-xs border border-gray-200 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <div className="space-y-1">
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={newProduct.imageUrl}
                    onChange={e => setNewProduct(p => ({ ...p, imageUrl: e.target.value }))}
                    className="w-full text-xs border border-gray-200 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <label className={`block w-full text-center text-xs font-medium py-1.5 rounded-md border border-dashed cursor-pointer transition-colors ${uploading ? 'border-gray-300 text-gray-400' : 'border-indigo-300 text-indigo-600 hover:border-indigo-400'}`}>
                    {uploading ? 'Uploading...' : 'or upload image'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploading}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploading(true);
                        try {
                          const form = new FormData();
                          form.append('file', file);
                          const res = await fetch('/api/upload', { method: 'POST', body: form });
                          const data = await res.json();
                          if (data.url) setNewProduct(p => ({ ...p, imageUrl: data.url }));
                        } catch {}
                        setUploading(false);
                        e.target.value = '';
                      }}
                    />
                  </label>
                </div>
                <input
                  type="text"
                  placeholder="Description"
                  value={newProduct.description}
                  onChange={e => setNewProduct(p => ({ ...p, description: e.target.value }))}
                  className="w-full text-xs border border-gray-200 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (!newProduct.name || !newProduct.price) return;
                      const product = {
                        id: `p-${Date.now()}`,
                        name: newProduct.name,
                        price: newProduct.price,
                        imageUrl: newProduct.imageUrl,
                        description: newProduct.description || newProduct.name,
                      };
                      setConfig(c => c ? { ...c, products: [...c.products, product] } : c);
                      setNewProduct({ name: '', price: 0, imageUrl: '', description: '' });
                      setShowAddProduct(false);
                    }}
                    className="flex-1 text-xs bg-indigo-600 text-white font-medium py-1.5 rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setShowAddProduct(false)}
                    className="flex-1 text-xs bg-gray-200 text-gray-600 font-medium py-1.5 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="p-5 mt-auto">
            {saved ? (
              <div className="text-center">
                <div className="text-green-600 font-semibold text-sm mb-3">✓ Store published!</div>
                <button
                  onClick={copyLink}
                  className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl text-sm hover:bg-indigo-700 transition-colors"
                >
                  {copied ? '✓ Link Copied!' : 'Copy Store Link'}
                </button>
                <a
                  href={`/store/${id}`}
                  target="_blank"
                  className="block text-center text-xs text-indigo-600 mt-3 hover:underline"
                >
                  Open live store →
                </a>
              </div>
            ) : showEmailCapture ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">Almost there!</p>
                  <p className="text-xs text-gray-400">Enter your email to save and manage this store later.</p>
                </div>
                <input
                  type="email"
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  placeholder="you@example.com"
                  autoFocus
                  onKeyDown={e => { if (e.key === 'Enter' && emailInput.trim()) saveAndPublish(emailInput.trim()); }}
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={() => saveAndPublish(emailInput.trim())}
                  disabled={!emailInput.trim()}
                  className="w-full bg-gray-900 text-white font-semibold py-3 rounded-xl text-sm hover:bg-gray-700 disabled:opacity-40 transition-colors"
                >
                  Save & Publish →
                </button>
                <button
                  onClick={() => saveAndPublish()}
                  className="w-full text-xs text-gray-400 hover:text-gray-600 py-1"
                >
                  Skip, publish without account
                </button>
              </div>
            ) : (
              <button
                onClick={handlePublishClick}
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
