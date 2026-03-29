'use client';

import Link from 'next/link';
import { useState } from 'react';

const t = {
  en: {
    nav: { howItWorks: 'How It Works', templates: 'Templates', features: 'Features', myStores: 'My Stores', cta: 'Start Building →' },
    badge: 'Stop selling in DMs',
    h1a: 'Turn your IG products into a',
    h1b: 'real store',
    h1c: 'in 3 minutes.',
    sub: 'You already have products and photos on Instagram. Upload them, pick a style, and get a checkout-ready store link you can put in your bio — no Shopify, no code, no monthly fees.',
    ctaPrimary: 'Build My Store Free →',
    ctaSecondary: 'See Demo Store',
    steps: [
      { step: '01', title: 'Paste Your Products', desc: 'Export your product list from a spreadsheet — names, prices, and the photos you already use on IG.', icon: '📄' },
      { step: '02', title: 'Pick Your Style', desc: 'Minimal for handmade goods, Vibrant for food & streetwear, Luxury for jewelry & skincare. AI writes all the copy.', icon: '🎨' },
      { step: '03', title: 'Share & Sell', desc: 'Get a store link with built-in checkout. Paste it in your bio, stories, or LINE. Customers pay online — no more DM back-and-forth.', icon: '🚀' },
    ],
    templatesTitle: 'Three styles built for small sellers.',
    templatesSub: 'No design skills needed. Pick one and AI does the rest.',
    templates: [
      { tag: 'Minimal', tagColor: 'text-gray-400', title: 'Clean & trustworthy.', desc: 'Best for handmade goods, prints, stationery, and curated selections.' },
      { tag: 'Vibrant', tagColor: 'text-orange-500', title: 'Bold & eye-catching.', desc: 'Best for baked goods, meal prep, streetwear, and pop-up brands.' },
      { tag: 'Luxury', tagColor: 'text-yellow-600', title: 'Dark & premium.', desc: 'Best for jewelry, candles, skincare, and specialty products.' },
      { tag: 'Bold', tagColor: 'text-red-500', title: 'Loud & unapologetic.', desc: 'Best for sneakers, streetwear, merch drops, and youth culture.' },
      { tag: 'Natural', tagColor: 'text-green-700', title: 'Earthy & organic.', desc: 'Best for tea, skincare, dried flowers, and wellness products.' },
    ],
    featuresTitle: 'Everything DM sellers wish they had.',
    featuresSub: 'No more screenshots of bank transfers. No more "is this still available?" messages.',
    features: [
      { icon: '✍️', title: 'AI Writes Your Descriptions', desc: 'Stop copy-pasting the same product info. AI generates compelling descriptions from your product names.' },
      { icon: '💳', title: 'Real Checkout, Not Bank Transfer', desc: 'Customers pay with credit card via Stripe. No more chasing payments or matching transfers.' },
      { icon: '📱', title: 'Made for Mobile', desc: 'Your customers browse on their phone. Every store looks perfect on mobile — because that\'s where your buyers are.' },
      { icon: '⚡', title: 'One Link for Everything', desc: 'Replace your Linktree with a real store. One URL in your bio = full product catalog + checkout.' },
    ],
    ctaSectionTitle: 'You\'re already selling. Now make it easier.',
    ctaSectionSub: 'Hundreds of IG sellers and market vendors switched from DMs to a real store — in under 3 minutes.',
    ctaSectionBtn: 'Build My Store Free →',
    ctaSectionNote: 'No credit card · No monthly fee · Live in 3 minutes',
    footerTagline: 'Built for sellers who started on social media.',
    footerCopy: '© 2025 StoreAI',
  },
  zh: {
    nav: { howItWorks: '如何運作', templates: '版型風格', features: '功能特色', myStores: '我的商店', cta: '立即開始 →' },
    badge: '別再用私訊接單了',
    h1a: '把你的 IG 商品變成',
    h1b: '真正的商店',
    h1c: '只要 3 分鐘。',
    sub: '你已經有商品照片和價目表了。上傳它們、選個風格，就能拿到一個可以放在 IG 自介的購物連結 — 不用 Shopify、不用寫程式、不用月費。',
    ctaPrimary: '免費建立我的商店 →',
    ctaSecondary: '看看示範商店',
    steps: [
      { step: '01', title: '貼上你的商品', desc: '從你的商品表格匯出 — 品名、售價、還有你平常 PO 在 IG 上的那些照片。', icon: '📄' },
      { step: '02', title: '選個風格', desc: '手作品選極簡、烘焙潮牌選活力、飾品保養選奢華。AI 幫你寫好所有文案。', icon: '🎨' },
      { step: '03', title: '分享 & 開賣', desc: '拿到一個內建結帳的商店連結。貼到你的 IG 自介、限動或 LINE 群組，顧客線上付款 — 不用再一則一則回私訊了。', icon: '🚀' },
    ],
    templatesTitle: '三種風格，專為小賣家設計。',
    templatesSub: '不需要設計能力，選一個就好，AI 搞定其餘的。',
    templates: [
      { tag: '極簡', tagColor: 'text-gray-400', title: '乾淨、有質感、讓人信任。', desc: '最適合手作商品、印刷品、文具、選物店。' },
      { tag: '活力', tagColor: 'text-orange-500', title: '搶眼、有活力、讓人想點進去。', desc: '最適合手工甜點、健康餐盒、潮流服飾、快閃品牌。' },
      { tag: '奢華', tagColor: 'text-yellow-600', title: '深色調、高級感、精品氛圍。', desc: '最適合飾品、香氛蠟燭、保養品、特色商品。' },
      { tag: '大膽', tagColor: 'text-red-500', title: '衝擊視覺、街頭能量。', desc: '最適合球鞋、潮流服飾、限量周邊、年輕文化。' },
      { tag: '自然', tagColor: 'text-green-700', title: '大地色、有機感、療癒氛圍。', desc: '最適合茶葉、保養品、乾燥花、健康養生商品。' },
    ],
    featuresTitle: '每個私訊賣家都想要的功能。',
    featuresSub: '不用再截圖對帳、不用再回「還有貨嗎」、不用再手動記訂單。',
    features: [
      { icon: '✍️', title: 'AI 幫你寫商品文案', desc: '不用再複製貼上同一段介紹。AI 從商品名稱自動生成吸引人的描述。' },
      { icon: '💳', title: '真正的結帳，不是銀行轉帳', desc: '顧客用信用卡透過 Stripe 付款，不用再追款項、對帳號。' },
      { icon: '📱', title: '手機瀏覽最佳化', desc: '你的顧客都在滑手機。每個商店在手機上都完美呈現 — 因為你的買家就在那裡。' },
      { icon: '⚡', title: '一個連結搞定一切', desc: '用一個真正的商店取代你的 Linktree。IG 自介放一個連結 = 完整商品目錄 + 結帳功能。' },
    ],
    ctaSectionTitle: '你已經在賣了，現在讓它更輕鬆。',
    ctaSectionSub: '數百位 IG 賣家和市集攤主，在 3 分鐘內從私訊接單升級成真正的商店。',
    ctaSectionBtn: '免費建立我的商店 →',
    ctaSectionNote: '不用信用卡 · 不用月費 · 3 分鐘上線',
    footerTagline: '為從社群起家的賣家而生。',
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
