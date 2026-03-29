'use client';

import { useState, useCallback } from 'react';
import type { StoreConfig, Product, Currency } from '@/lib/types';

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  TWD: 'NT$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
};

function formatPrice(price: number, currency?: Currency): string {
  const sym = CURRENCY_SYMBOLS[currency || 'USD'];
  return `${sym}${price}`;
}

interface Props {
  config: StoreConfig;
  editable?: boolean;
  onUpdate?: (config: StoreConfig) => void;
}

function EditableText({
  value,
  onSave,
  className,
  tag: Tag = 'span',
  editable = false,
  style,
}: {
  value: string;
  onSave: (v: string) => void;
  className?: string;
  tag?: keyof JSX.IntrinsicElements;
  editable?: boolean;
  style?: React.CSSProperties;
}) {
  if (!editable) {
    return <Tag className={className} style={style}>{value}</Tag>;
  }
  return (
    <Tag
      className={className}
      style={style}
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => onSave((e.target as HTMLElement).innerText)}
      dangerouslySetInnerHTML={{ __html: value }}
    />
  );
}

function BuyButton({
  product,
  className,
  children,
  style,
}: {
  product: Product;
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const link = product.stripePaymentLink;
  const isDemo = !link || link.includes('test_demo');

  if (isDemo) {
    return (
      <button
        className={className}
        style={style}
        onClick={() => alert('This is a demo store!\nCreate your own store at StoreAI to enable real Stripe checkout.')}
      >
        {children}
      </button>
    );
  }
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={style}
    >
      {children}
    </a>
  );
}

function ProductImageWithFallback({
  src,
  alt,
  className,
  style,
}: {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [errored, setErrored] = useState(false);
  if (!src || errored) {
    return (
      <div className={`${className ?? ''} bg-gray-200 flex items-center justify-center text-4xl`} style={style}>
        🛍️
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={`${className ?? ''} object-cover`}
      style={style}
      onError={() => setErrored(true)}
    />
  );
}

export default function StorefrontRenderer({ config, editable = false, onUpdate }: Props) {
  const update = useCallback((updates: Partial<StoreConfig>) => {
    if (onUpdate) onUpdate({ ...config, ...updates });
  }, [config, onUpdate]);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    if (!onUpdate) return;
    onUpdate({
      ...config,
      products: config.products.map(p => p.id === id ? { ...p, ...updates } : p),
    });
  }, [config, onUpdate]);

  const { brandStyle, storeName, tagline, products, primaryColor } = config;

  // ————— MINIMAL TEMPLATE —————
  if (brandStyle === 'minimal') {
    return (
      <div className="min-h-screen bg-white font-sans">
        {/* Header */}
        <header className="border-b border-gray-100 px-8 py-5">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <EditableText
              tag="div"
              value={storeName}
              onSave={(v) => update({ storeName: v })}
              editable={editable}
              className="text-lg font-semibold tracking-tight text-gray-900"
            />
            <nav className="flex gap-6 text-xs text-gray-400 tracking-wider uppercase">
              <span>Shop</span>
              <span>About</span>
            </nav>
          </div>
        </header>

        {/* Hero */}
        <section className="py-24 px-8 text-center border-b border-gray-100">
          <div className="max-w-3xl mx-auto">
            <EditableText
              tag="h1"
              value={storeName}
              onSave={(v) => update({ storeName: v })}
              editable={editable}
              className="text-6xl md:text-8xl font-thin tracking-tighter text-gray-900 mb-6"
            />
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="flex-1 h-px bg-gray-200 max-w-24"></div>
              <EditableText
                tag="span"
                value={tagline}
                onSave={(v) => update({ tagline: v })}
                editable={editable}
                className="text-xs font-medium tracking-[0.3em] uppercase text-gray-400"
              />
              <div className="flex-1 h-px bg-gray-200 max-w-24"></div>
            </div>
          </div>
        </section>

        {/* Products */}
        <section className="py-16 px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <div key={product.id} className="group">
                  <div className="aspect-square overflow-hidden bg-gray-50 mb-4">
                    <ProductImageWithFallback
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex items-start justify-between mb-2">
                    <EditableText
                      tag="h3"
                      value={product.name}
                      onSave={(v) => updateProduct(product.id, { name: v })}
                      editable={editable}
                      className="text-sm font-medium text-gray-900 tracking-wide uppercase"
                    />
                    <span className="text-sm text-gray-400 ml-2 shrink-0">{formatPrice(product.price, config.currency)}</span>
                  </div>
                  <EditableText
                    tag="p"
                    value={product.description}
                    onSave={(v) => updateProduct(product.id, { description: v })}
                    editable={editable}
                    className="text-xs text-gray-400 leading-relaxed mb-4 line-clamp-3"
                  />
                  <BuyButton
                    product={product}
                    className="text-xs font-medium text-gray-900 hover:text-gray-500 transition-colors tracking-wider uppercase"
                  >
                    Buy Now →
                  </BuyButton>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-100 py-12 px-8 text-center">
          <p className="text-xs text-gray-300 tracking-widest uppercase">{storeName}</p>
          <p className="text-xs text-gray-200 mt-1">Powered by StoreAI</p>
        </footer>
      </div>
    );
  }

  // ————— VIBRANT TEMPLATE —————
  if (brandStyle === 'vibrant') {
    const gradientStyle: React.CSSProperties = { background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)` };
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        {/* Header */}
        <header className="bg-white shadow-sm px-6 py-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <EditableText
              tag="div"
              value={storeName}
              onSave={(v) => update({ storeName: v })}
              editable={editable}
              className="text-xl font-extrabold text-gray-900"
              style={{ borderLeft: `4px solid ${primaryColor}`, paddingLeft: '12px' }}
            />
            <a
              href="#products"
              className="text-sm font-bold text-white px-4 py-2 rounded-full transition-opacity hover:opacity-90"
              style={{ backgroundColor: primaryColor }}
            >
              Shop Now
            </a>
          </div>
        </header>

        {/* Hero Banner */}
        <section className="px-6 pt-0" style={gradientStyle}>
          <div className="max-w-5xl mx-auto py-16 md:py-24 text-center relative">
            <EditableText
              tag="h1"
              value={storeName}
              onSave={(v) => update({ storeName: v })}
              editable={editable}
              className="text-5xl md:text-7xl font-extrabold text-white mb-4 tracking-tight"
            />
            <EditableText
              tag="p"
              value={tagline}
              onSave={(v) => update({ tagline: v })}
              editable={editable}
              className="text-white/80 text-lg md:text-xl mb-8 font-medium"
            />
            <a
              href="#products"
              className="inline-block bg-white font-bold px-8 py-4 rounded-full text-sm hover:shadow-lg transition-all hover:scale-105"
              style={{ color: primaryColor }}
            >
              Shop Collection →
            </a>
          </div>
          <div className="h-12 bg-gray-50 rounded-t-[50%]"></div>
        </section>

        {/* Products */}
        <section id="products" className="pb-16 px-6 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-8 text-center">Our Collection</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 group">
                  <div className="relative aspect-square overflow-hidden">
                    <ProductImageWithFallback
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                    <div
                      className="absolute top-3 right-3 text-white text-xs font-bold px-3 py-1 rounded-full"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {formatPrice(product.price, config.currency)}
                    </div>
                  </div>
                  <div className="p-4">
                    <EditableText
                      tag="h3"
                      value={product.name}
                      onSave={(v) => updateProduct(product.id, { name: v })}
                      editable={editable}
                      className="font-bold text-gray-900 mb-1 text-sm"
                    />
                    <EditableText
                      tag="p"
                      value={product.description}
                      onSave={(v) => updateProduct(product.id, { description: v })}
                      editable={editable}
                      className="text-xs text-gray-400 mb-4 line-clamp-2 leading-relaxed"
                    />
                    <BuyButton
                      product={product}
                      className="block w-full text-center text-white font-bold py-2.5 rounded-full text-sm transition-opacity hover:opacity-90"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Add to Cart
                    </BuyButton>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-10 px-6 text-center text-white" style={{ backgroundColor: primaryColor }}>
          <p className="font-extrabold text-xl mb-1">{storeName}</p>
          <p className="text-white/60 text-xs">Powered by StoreAI</p>
        </footer>
      </div>
    );
  }

  // ————— LUXURY TEMPLATE —————
  return (
    <div
      className="min-h-screen"
      style={{ background: '#0c0c0c', color: '#e8e0d0', fontFamily: "'Playfair Display', Georgia, serif" }}
    >
      {/* Header */}
      <header style={{ borderBottom: '1px solid #c9a84c22', padding: '24px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ color: '#c9a84c', fontSize: '20px' }}>✦</span>
            <EditableText
              tag="span"
              value={storeName.toUpperCase()}
              onSave={(v) => update({ storeName: v })}
              editable={editable}
              style={{ letterSpacing: '0.3em', fontSize: '14px', fontWeight: 400, color: '#e8e0d0' }}
            />
            <span style={{ color: '#c9a84c', fontSize: '20px' }}>✦</span>
          </div>
          <nav style={{ display: 'flex', gap: '32px', fontSize: '11px', letterSpacing: '0.2em', color: '#666', textTransform: 'uppercase' as const }}>
            <span>Collection</span>
            <span>Atelier</span>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section style={{ minHeight: '85vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 40px', textAlign: 'center' }}>
        <div style={{ width: '40px', height: '1px', background: '#c9a84c', margin: '0 auto 32px' }}></div>
        <EditableText
          tag="h1"
          value={storeName}
          onSave={(v) => update({ storeName: v })}
          editable={editable}
          style={{ fontSize: 'clamp(48px, 8vw, 96px)', fontWeight: 400, letterSpacing: '-0.02em', color: '#e8e0d0', lineHeight: 1.1, marginBottom: '24px' }}
        />
        <div style={{ width: '80px', height: '1px', background: '#c9a84c55', margin: '0 auto 24px' }}></div>
        <EditableText
          tag="p"
          value={tagline}
          onSave={(v) => update({ tagline: v })}
          editable={editable}
          style={{ fontSize: '18px', fontStyle: 'italic', color: '#888', letterSpacing: '0.05em', maxWidth: '400px' }}
        />
        <div style={{ width: '40px', height: '1px', background: '#c9a84c', margin: '32px auto 0' }}></div>
      </section>

      {/* Products */}
      <section style={{ padding: '80px 40px', maxWidth: '1200px', margin: '0 auto' }}>
        <p style={{ textAlign: 'center', fontSize: '11px', letterSpacing: '0.4em', color: '#c9a84c', textTransform: 'uppercase', marginBottom: '64px' }}>
          The Collection
        </p>
        {products.length <= 4 && products.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
            {products.map((product, i) => (
              <div
                key={product.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '60px',
                  alignItems: 'center',
                  direction: i % 2 === 1 ? 'rtl' : 'ltr',
                }}
              >
                <div style={{ aspectRatio: '1/1', overflow: 'hidden', border: '1px solid #c9a84c22', direction: 'ltr' }}>
                  <ProductImageWithFallback
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.85)' }}
                  />
                </div>
                <div style={{ direction: 'ltr', padding: '20px' }}>
                  <p style={{ fontSize: '10px', letterSpacing: '0.4em', color: '#c9a84c', textTransform: 'uppercase', marginBottom: '16px' }}>
                    No. {String(i + 1).padStart(2, '0')}
                  </p>
                  <EditableText
                    tag="h2"
                    value={product.name}
                    onSave={(v) => updateProduct(product.id, { name: v })}
                    editable={editable}
                    style={{ fontSize: '32px', fontWeight: 400, color: '#e8e0d0', marginBottom: '16px', letterSpacing: '-0.01em' }}
                  />
                  <div style={{ width: '40px', height: '1px', background: '#c9a84c44', marginBottom: '20px' }}></div>
                  <EditableText
                    tag="p"
                    value={product.description}
                    onSave={(v) => updateProduct(product.id, { description: v })}
                    editable={editable}
                    style={{ fontSize: '14px', color: '#777', lineHeight: '1.8', marginBottom: '24px', fontFamily: 'Inter, sans-serif' }}
                  />
                  <p style={{ fontSize: '22px', color: '#c9a84c', marginBottom: '28px', fontStyle: 'italic' }}>
                    {formatPrice(product.price, config.currency)}
                  </p>
                  <BuyButton
                    product={product}
                    className="btn-luxury"
                  >
                    Purchase
                  </BuyButton>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2px' }}>
            {products.map((product) => (
              <div key={product.id} style={{ background: '#111', padding: '32px', border: '1px solid #1a1a1a' }}>
                <div style={{ aspectRatio: '1/1', overflow: 'hidden', marginBottom: '24px', border: '1px solid #222' }}>
                  <ProductImageWithFallback
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full"
                  />
                </div>
                <EditableText
                  tag="h3"
                  value={product.name}
                  onSave={(v) => updateProduct(product.id, { name: v })}
                  editable={editable}
                  style={{ fontSize: '16px', color: '#e8e0d0', marginBottom: '8px', letterSpacing: '0.02em' }}
                />
                <p style={{ color: '#c9a84c', fontSize: '14px', marginBottom: '16px', fontStyle: 'italic' }}>{formatPrice(product.price, config.currency)}</p>
                <EditableText
                  tag="p"
                  value={product.description}
                  onSave={(v) => updateProduct(product.id, { description: v })}
                  editable={editable}
                  style={{ fontSize: '12px', color: '#555', lineHeight: '1.7', marginBottom: '20px', fontFamily: 'Inter, sans-serif' }}
                />
                <BuyButton product={product} className="btn-luxury">
                  Purchase
                </BuyButton>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #c9a84c22', padding: '40px', textAlign: 'center' }}>
        <p style={{ color: '#c9a84c', fontSize: '14px', letterSpacing: '0.3em', textTransform: 'uppercase' }}>{storeName}</p>
        <p style={{ color: '#333', fontSize: '11px', marginTop: '8px' }}>Powered by StoreAI</p>
      </footer>
    </div>
  );
}
