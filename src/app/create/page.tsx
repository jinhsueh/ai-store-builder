'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { BrandStyle, RawProduct } from '@/lib/types';
import { parseProductCSV } from '@/lib/csv-parser';

// ————— Step 1 Component —————
function StepOne({
  category,
  setCategory,
  products,
  setProducts,
  onNext,
}: {
  category: string;
  setCategory: (v: string) => void;
  products: RawProduct[];
  setProducts: (v: RawProduct[]) => void;
  onNext: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [manual, setManual] = useState({ name: '', price: '', imageUrl: '' });

  const handleFile = async (file: File) => {
    const text = await file.text();
    const parsed = parseProductCSV(text);
    if (parsed.length > 0) setProducts(parsed);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addManual = () => {
    if (!manual.name || !manual.price) return;
    setProducts([...products, {
      name: manual.name,
      price: parseFloat(manual.price) || 0,
      imageUrl: manual.imageUrl || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800',
    }]);
    setManual({ name: '', price: '', imageUrl: '' });
    setShowManual(false);
  };

  const removeProduct = (i: number) => setProducts(products.filter((_, idx) => idx !== i));

  const canNext = category.trim().length > 0 && products.length > 0;

  return (
    <div className="step-enter">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about your products</h2>
      <p className="text-gray-500 mb-8">We&apos;ll use this to build your store and write product copy.</p>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">What are you selling? *</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g., handmade soy candles, vintage sneakers, artisan coffee blends..."
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Upload products (CSV) *</label>
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            dragging ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => fileRef.current?.click()}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
          <div className="text-3xl mb-2">📄</div>
          <p className="text-sm font-medium text-gray-700 mb-1">Drop your CSV here, or click to browse</p>
          <p className="text-xs text-gray-400">Columns: name, price, imageUrl</p>
          <a
            href="/sample.csv"
            download
            onClick={(e) => e.stopPropagation()}
            className="inline-block mt-3 text-xs text-indigo-600 underline hover:text-indigo-800"
          >
            Download sample template
          </a>
        </div>
      </div>

      {products.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-700">{products.length} product{products.length > 1 ? 's' : ''} ready</p>
            <button onClick={() => setShowManual(true)} className="text-xs text-indigo-600 hover:underline">+ Add more</button>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {products.map((p, i) => (
              <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-2.5">
                {p.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.imageUrl} alt="" className="w-8 h-8 rounded object-cover bg-gray-200" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                )}
                <span className="flex-1 text-sm font-medium text-gray-800 truncate">{p.name}</span>
                <span className="text-sm text-gray-500">NT${p.price}</span>
                <button onClick={() => removeProduct(i)} className="text-gray-400 hover:text-red-500 text-xs ml-2">✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {(products.length === 0 || showManual) && (
        <div className="mb-6 border border-gray-200 rounded-xl p-5 bg-gray-50">
          <p className="text-sm font-semibold text-gray-700 mb-3">Add product manually</p>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              placeholder="Product name *"
              value={manual.name}
              onChange={(e) => setManual({ ...manual, name: e.target.value })}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <input
              placeholder="Price (NT$) *"
              type="number"
              value={manual.price}
              onChange={(e) => setManual({ ...manual, price: e.target.value })}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <input
            placeholder="Image URL (optional)"
            value={manual.imageUrl}
            onChange={(e) => setManual({ ...manual, imageUrl: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            onClick={addManual}
            disabled={!manual.name || !manual.price}
            className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg disabled:opacity-40 hover:bg-indigo-700 transition-colors"
          >
            Add Product
          </button>
        </div>
      )}

      <button
        onClick={onNext}
        disabled={!canNext}
        className="w-full bg-gray-900 text-white font-semibold py-4 rounded-xl disabled:opacity-40 hover:bg-gray-700 transition-all text-sm"
      >
        Next: Choose Your Style →
      </button>
    </div>
  );
}

// ————— Step 2 Component —————
function StepTwo({
  selected,
  onSelect,
  onNext,
  onBack,
}: {
  selected: BrandStyle | null;
  onSelect: (s: BrandStyle) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const styles: { id: BrandStyle; label: string; desc: string; tagline: string; bg: string; textColor: string }[] = [
    {
      id: 'minimal',
      label: 'Minimal',
      desc: 'Clean lines, white space, timeless elegance.',
      tagline: 'Less is more.',
      bg: 'bg-white',
      textColor: 'text-gray-900',
    },
    {
      id: 'vibrant',
      label: 'Vibrant',
      desc: 'Bold colors, high energy, impossible to ignore.',
      tagline: 'Feel the energy.',
      bg: 'bg-gradient-to-br from-orange-400 to-pink-500',
      textColor: 'text-white',
    },
    {
      id: 'luxury',
      label: 'Luxury',
      desc: 'Dark elegance, gold accents, premium presence.',
      tagline: 'Crafted for the discerning.',
      bg: 'bg-gray-950',
      textColor: 'text-yellow-400',
    },
  ];

  return (
    <div className="step-enter">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">How should your store feel?</h2>
      <p className="text-gray-500 mb-8">AI will match the design, copy, and colors to your chosen vibe.</p>

      <div className="grid grid-cols-1 gap-4 mb-8">
        {styles.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            className={`group relative overflow-hidden rounded-2xl border-2 text-left transition-all ${
              selected === s.id
                ? 'border-indigo-500 shadow-lg shadow-indigo-100 scale-[1.01]'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {/* Preview area */}
            <div className={`${s.bg} h-28 flex items-center justify-center relative overflow-hidden`}>
              <div className="flex flex-col items-center gap-1 z-10">
                <div className={`text-sm font-bold tracking-wider ${s.textColor}`}>{s.tagline}</div>
                <div className="flex gap-2 mt-2">
                  {[1,2,3].map(i => (
                    <div
                      key={i}
                      className={`w-12 h-10 rounded ${s.id === 'luxury' ? 'border border-yellow-600' : s.id === 'vibrant' ? 'bg-white/20' : 'bg-gray-100'} flex flex-col items-center justify-end pb-1`}
                    >
                      <div className={`w-8 h-0.5 rounded ${s.id === 'luxury' ? 'bg-yellow-500' : s.id === 'vibrant' ? 'bg-white' : 'bg-gray-400'}`}></div>
                    </div>
                  ))}
                </div>
              </div>
              {selected === s.id && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
            {/* Info area */}
            <div className="bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">{s.label}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{s.desc}</p>
                </div>
                {selected === s.id && (
                  <div className="shrink-0 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center ml-4">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-none border border-gray-200 text-gray-600 font-medium px-6 py-4 rounded-xl hover:bg-gray-50 text-sm">
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={!selected}
          className="flex-1 bg-gray-900 text-white font-semibold py-4 rounded-xl disabled:opacity-40 hover:bg-gray-700 transition-all text-sm"
        >
          Generate My Store ✨
        </button>
      </div>
    </div>
  );
}

// ————— Step 3 Generating Component —————
function GeneratingScreen({ status }: { status: string }) {
  const steps = [
    'Crafting your store name...',
    'Writing product descriptions...',
    'Building your layout...',
    'Setting up checkout links...',
  ];

  const currentIdx = steps.indexOf(status);

  return (
    <div className="step-enter flex flex-col items-center justify-center py-12">
      <div className="w-16 h-16 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mb-8"></div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Building your store...</h2>
      <p className="text-gray-500 mb-10 text-center text-sm">This usually takes 15–30 seconds.</p>
      <div className="w-full max-w-sm space-y-3">
        {steps.map((step, i) => {
          const done = i < currentIdx;
          const active = i === currentIdx;
          return (
            <div
              key={step}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                active ? 'bg-indigo-50 border border-indigo-200' :
                done ? 'opacity-60' : 'opacity-30'
              }`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                done ? 'bg-green-500' : active ? 'bg-indigo-500 animate-pulse' : 'bg-gray-200'
              }`}>
                {done ? <span className="text-white text-xs">✓</span> : <span className="text-white text-xs">•</span>}
              </div>
              <span className={`text-sm ${done ? 'text-gray-500 line-through' : active ? 'text-indigo-700 font-medium' : 'text-gray-400'}`}>{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ————— Main Page —————
export default function CreatePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState('');
  const [products, setProducts] = useState<RawProduct[]>([]);
  const [brandStyle, setBrandStyle] = useState<BrandStyle | null>(null);
  const [genStatus, setGenStatus] = useState('');
  const [error, setError] = useState('');

  const totalSteps = 3;

  const generate = async () => {
    setStep(3);
    setError('');

    try {
      setGenStatus('Crafting your store name...');
      const genRes = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, brandStyle, products }),
      });
      if (!genRes.ok) throw new Error('Generation failed');
      const genData = await genRes.json();

      setGenStatus('Writing product descriptions...');
      await new Promise(r => setTimeout(r, 600));

      setGenStatus('Building your layout...');
      await new Promise(r => setTimeout(r, 400));

      // Create Stripe payment links
      setGenStatus('Setting up checkout links...');
      const stripeRes = await fetch('/api/stripe/create-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: genData.products }),
      });
      const stripeData = stripeRes.ok ? await stripeRes.json() : { products: genData.products };

      // Save store
      const storePayload = {
        storeName: genData.storeName,
        tagline: genData.tagline,
        category,
        brandStyle: brandStyle!,
        primaryColor: genData.primaryColor,
        fontPack: genData.fontPack,
        products: stripeData.products || genData.products,
      };

      const saveRes = await fetch('/api/store/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storePayload),
      });
      if (!saveRes.ok) throw new Error('Save failed');
      const { id } = await saveRes.json();

      router.push(`/preview/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-lg mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="text-lg font-bold tracking-tight">✦ StoreAI</a>
          {step < 3 && (
            <div className="flex items-center gap-2">
              {[1, 2].map(s => (
                <div
                  key={s}
                  className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-colors ${
                    s === step ? 'bg-gray-900 text-white' :
                    s < step ? 'bg-green-500 text-white' :
                    'bg-gray-200 text-gray-500'
                  }`}
                >
                  {s < step ? '✓' : s}
                </div>
              ))}
              <div className="text-xs text-gray-400">Step {step} of 2</div>
            </div>
          )}
        </div>
        {step < 3 && (
          <div className="h-1 bg-gray-100">
            <div
              className="h-1 bg-indigo-500 transition-all duration-500"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            ></div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-6 py-10">
        {step === 1 && (
          <StepOne
            category={category}
            setCategory={setCategory}
            products={products}
            setProducts={setProducts}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <StepTwo
            selected={brandStyle}
            onSelect={setBrandStyle}
            onNext={generate}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <>
            {error ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">⚠️</div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
                <p className="text-gray-500 text-sm mb-6">{error}</p>
                <button
                  onClick={generate}
                  className="bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-gray-700"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <GeneratingScreen status={genStatus} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
