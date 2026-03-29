'use client';

import Link from 'next/link';
import { useState } from 'react';

const t = {
  en: {
    nav: { howItWorks: 'How It Works', templates: 'Templates', features: 'Features', myStores: 'My Stores', cta: 'Start Building →' },
    badge: 'AI-Powered Store Builder',
    h1a: 'From products to',
    h1b: 'live store',
    h1c: 'in 3 minutes.',
    sub: 'Upload your product list, pick a vibe, and watch AI build your entire storefront — complete with copywriting, design, and Stripe checkout links.',
    ctaPrimary: 'Start Building Free →',
    ctaSecondary: 'See Demo Store',
    steps: [
      { step: '01', title: 'Upload Products', desc: 'Drop in a CSV file with your product names, prices, and image URLs. Takes 30 seconds.', icon: '📄' },
      { step: '02', title: 'Pick Your Vibe', desc: 'Choose Minimal, Vibrant, or Luxury. Our AI adapts the entire design and copywriting to match.', icon: '🎨' },
      { step: '03', title: 'Go Live', desc: 'Get a shareable store URL with Stripe checkout built in. Start selling immediately.', icon: '🚀' },
    ],
    templatesTitle: 'Three stunning templates. Zero design skills.',
    templatesSub: 'AI picks the right one for your brand — or you choose.',
    templates: [
      { tag: 'Minimal', tagColor: 'text-gray-400', title: 'Clean lines, white space, timeless.', desc: 'Perfect for premium products, artisan goods, and lifestyle brands.' },
      { tag: 'Vibrant', tagColor: 'text-orange-500', title: 'Bold colors, high energy, scroll-stopping.', desc: 'Ideal for food & beverage, fitness, streetwear, and youth brands.' },
      { tag: 'Luxury', tagColor: 'text-yellow-600', title: 'Dark elegance, premium presence.', desc: 'Made for jewelry, skincare, spirits, and high-end lifestyle goods.' },
    ],
    featuresTitle: 'Everything you need to start selling.',
    featuresSub: 'No design tools, no checkout configuration, no wasted weeks.',
    features: [
      { icon: '✍️', title: 'AI Copywriting', desc: 'Product descriptions, store taglines, and headlines — written by AI, tailored to your brand tone.' },
      { icon: '💳', title: 'Stripe Checkout', desc: 'Payment links auto-generated for every product. Customers pay securely, money goes directly to you.' },
      { icon: '📱', title: 'Mobile-First', desc: 'Every template is fully responsive. Looks perfect on iPhone, iPad, and desktop.' },
      { icon: '⚡', title: 'Instant Publishing', desc: 'Get a live shareable URL the moment generation is complete. No hosting setup needed.' },
    ],
    ctaSectionTitle: 'Your first sale could be today.',
    ctaSectionSub: 'Join creators and micro-sellers who launched their stores without touching a line of code.',
    ctaSectionBtn: 'Start Building Free →',
    ctaSectionNote: 'No credit card required · Ready in 3 minutes',
    footerTagline: 'Built for creators who move fast.',
    footerCopy: '© 2025 StoreAI',
  },
  zh: {
    nav: { howItWorks: '如何運作', templates: '版型風格', features: '功能特色', myStores: '我的商店', cta: '立即開始 →' },
    badge: 'AI 驅動的電商建站工具',
    h1a: '從商品清單到',
    h1b: '正式上線',
    h1c: '只需 3 分鐘。',
    sub: '上傳商品資料、選擇品牌風格，AI 自動生成完整電商網站 — 包含文案撰寫、視覺設計與 Stripe 結帳連結。',
    ctaPrimary: '免費開始建站 →',
    ctaSecondary: '查看示範網站',
    steps: [
      { step: '01', title: '上傳商品', desc: '匯入 CSV 檔案，填入商品名稱、售價與圖片連結，30 秒內完成。', icon: '📄' },
      { step: '02', title: '選擇風格', desc: '極簡、活力或奢華三種風格任選，AI 自動調整設計與文案語氣。', icon: '🎨' },
      { step: '03', title: '立即上線', desc: '取得可分享的商店連結，內建 Stripe 結帳功能，馬上開始接單。', icon: '🚀' },
    ],
    templatesTitle: '三套精美版型，不需設計能力。',
    templatesSub: 'AI 為你的品牌選出最合適的風格 — 或者由你自己挑選。',
    templates: [
      { tag: '極簡', tagColor: 'text-gray-400', title: '乾淨線條、充足留白、歷久不衰。', desc: '適合高端商品、手工藝品與生活風格品牌。' },
      { tag: '活力', tagColor: 'text-orange-500', title: '大膽色彩、充滿能量、讓人停下滑動。', desc: '適合餐飲、健身、潮流服飾與年輕品牌。' },
      { tag: '奢華', tagColor: 'text-yellow-600', title: '深色質感、高端氛圍、尊榮感十足。', desc: '適合珠寶、保養品、烈酒與精品生活品牌。' },
    ],
    featuresTitle: '開始銷售所需的一切，全都內建。',
    featuresSub: '不需設計工具，不需設定結帳流程，不需浪費好幾週。',
    features: [
      { icon: '✍️', title: 'AI 文案撰寫', desc: '商品描述、品牌標語、吸睛標題 — 全由 AI 撰寫，依你的品牌語氣量身打造。' },
      { icon: '💳', title: 'Stripe 結帳', desc: '每項商品自動生成付款連結，顧客安全付款，款項直接入帳。' },
      { icon: '📱', title: '行動裝置優先', desc: '所有版型完全響應式設計，iPhone、iPad 與桌機上都完美呈現。' },
      { icon: '⚡', title: '即時發布', desc: '生成完成後立刻取得可分享的網址，無需任何主機設定。' },
    ],
    ctaSectionTitle: '今天就能收到第一筆訂單。',
    ctaSectionSub: '加入那些不寫一行程式碼就成功上線的創作者與微型賣家。',
    ctaSectionBtn: '免費開始建站 →',
    ctaSectionNote: '無需信用卡 · 3 分鐘內準備完成',
    footerTagline: '為快速行動的創作者而生。',
    footerCopy: '© 2025 StoreAI',
  },
} as const;

type Lang = keyof typeof t;

export default function HomePage() {
  const [lang, setLang] = useState<Lang>('en');
  const c = t[lang];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight">✦ StoreAI</span>

          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <a href="#how-it-works" className="hover:text-gray-900 transition-colors">{c.nav.howItWorks}</a>
            <a href="#templates" className="hover:text-gray-900 transition-colors">{c.nav.templates}</a>
            <a href="#features" className="hover:text-gray-900 transition-colors">{c.nav.features}</a>
            <Link href="/stores" className="hover:text-gray-900 transition-colors">{c.nav.myStores}</Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <button
              onClick={() => setLang(l => l === 'en' ? 'zh' : 'en')}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-all"
            >
              <span className="text-sm">{lang === 'en' ? '🇹🇼' : '🇺🇸'}</span>
              {lang === 'en' ? '繁中' : 'EN'}
            </button>
            <Link
              href="/create"
              className="bg-gray-900 text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-gray-700 transition-colors"
            >
              {c.nav.cta}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="how-it-works" className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-8 border border-indigo-100">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
            {c.badge}
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1] mb-6">
            {c.h1a}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              {c.h1b}
            </span>
            <br />{c.h1c}
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            {c.sub}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/create"
              className="bg-gray-900 text-white font-semibold px-8 py-4 rounded-full text-lg hover:bg-gray-700 transition-all hover:scale-105 shadow-lg shadow-gray-900/20"
            >
              {c.ctaPrimary}
            </Link>
            <Link
              href="/store/demo"
              className="bg-white text-gray-900 font-semibold px-8 py-4 rounded-full text-lg border-2 border-gray-200 hover:border-gray-400 transition-all"
            >
              {c.ctaSecondary}
            </Link>
          </div>
        </div>

        {/* Steps */}
        <div className="max-w-4xl mx-auto mt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {c.steps.map((item) => (
              <div key={item.step} className="relative bg-gray-50 rounded-2xl p-7 border border-gray-100">
                <div className="text-xs font-mono text-gray-400 mb-4">{item.step}</div>
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Showcase */}
      <section id="templates" className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{c.templatesTitle}</h2>
            <p className="text-lg text-gray-500">{c.templatesSub}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Minimal preview */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
              <div className="h-48 bg-white border-b border-gray-100 flex flex-col items-center justify-center p-6">
                <div className="w-20 h-1 bg-gray-200 mb-3 rounded"></div>
                <div className="w-32 h-2 bg-gray-900 mb-2 rounded"></div>
                <div className="w-24 h-1 bg-gray-300 mb-4 rounded"></div>
                <div className="flex gap-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-14 h-16 bg-gray-100 rounded flex flex-col items-center justify-end pb-1">
                      <div className="w-8 h-1 bg-gray-400 mb-1 rounded"></div>
                      <div className="w-6 h-1 bg-gray-300 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6">
                <div className={`text-xs font-semibold uppercase tracking-wider mb-1 ${c.templates[0].tagColor}`}>{c.templates[0].tag}</div>
                <h3 className="font-bold text-gray-900 mb-2">{c.templates[0].title}</h3>
                <p className="text-sm text-gray-500">{c.templates[0].desc}</p>
              </div>
            </div>

            {/* Vibrant preview */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-orange-400 to-pink-500 flex flex-col items-center justify-center p-6">
                <div className="w-32 h-3 bg-white/90 mb-2 rounded-full"></div>
                <div className="w-24 h-2 bg-white/60 mb-5 rounded-full"></div>
                <div className="flex gap-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-14 h-16 bg-white/20 backdrop-blur rounded-xl flex flex-col items-center justify-end pb-2">
                      <div className="w-8 h-1 bg-white/80 mb-1 rounded"></div>
                      <div className="w-10 h-3 bg-white rounded-full"></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6">
                <div className={`text-xs font-semibold uppercase tracking-wider mb-1 ${c.templates[1].tagColor}`}>{c.templates[1].tag}</div>
                <h3 className="font-bold text-gray-900 mb-2">{c.templates[1].title}</h3>
                <p className="text-sm text-gray-500">{c.templates[1].desc}</p>
              </div>
            </div>

            {/* Luxury preview */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gray-950 flex flex-col items-center justify-center p-6">
                <div className="w-4 h-4 border border-yellow-500 mb-3 rotate-45"></div>
                <div className="w-28 h-2 bg-yellow-500/80 mb-2 rounded"></div>
                <div className="w-20 h-1 bg-gray-600 mb-4 rounded"></div>
                <div className="flex gap-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-14 h-16 border border-gray-700 flex flex-col items-center justify-end pb-2">
                      <div className="w-8 h-1 bg-gray-500 mb-1 rounded"></div>
                      <div className="w-10 h-3 border border-yellow-600 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6">
                <div className={`text-xs font-semibold uppercase tracking-wider mb-1 ${c.templates[2].tagColor}`}>{c.templates[2].tag}</div>
                <h3 className="font-bold text-gray-900 mb-2">{c.templates[2].title}</h3>
                <p className="text-sm text-gray-500">{c.templates[2].desc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{c.featuresTitle}</h2>
            <p className="text-lg text-gray-500">{c.featuresSub}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {c.features.map((f) => (
              <div key={f.title} className="p-6 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-200 transition-all hover:shadow-md">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-gray-900">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">{c.ctaSectionTitle}</h2>
          <p className="text-lg text-gray-400 mb-10">{c.ctaSectionSub}</p>
          <Link
            href="/create"
            className="inline-block bg-white text-gray-900 font-bold px-10 py-5 rounded-full text-lg hover:bg-gray-100 transition-all hover:scale-105"
          >
            {c.ctaSectionBtn}
          </Link>
          <p className="text-xs text-gray-600 mt-6">{c.ctaSectionNote}</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-gray-950 border-t border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-white font-bold">✦ StoreAI</div>
          <p className="text-gray-500 text-sm">{c.footerTagline}</p>
          <p className="text-gray-600 text-xs">{c.footerCopy}</p>
        </div>
      </footer>
    </div>
  );
}
