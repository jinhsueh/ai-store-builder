import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">✦ StoreAI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <a href="#how-it-works" className="hover:text-gray-900 transition-colors">How It Works</a>
            <a href="#templates" className="hover:text-gray-900 transition-colors">Templates</a>
            <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
          </div>
          <Link
            href="/create"
            className="bg-gray-900 text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-gray-700 transition-colors"
          >
            Start Building →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-8 border border-indigo-100">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
            AI-Powered Store Builder
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1] mb-6">
            From products to<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              live store
            </span>
            <br />in 3 minutes.
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload your product list, pick a vibe, and watch AI build your entire storefront — complete with copywriting, design, and Stripe checkout links.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/create"
              className="bg-gray-900 text-white font-semibold px-8 py-4 rounded-full text-lg hover:bg-gray-700 transition-all hover:scale-105 shadow-lg shadow-gray-900/20"
            >
              Start Building Free →
            </Link>
            <Link
              href="/store/demo"
              className="bg-white text-gray-900 font-semibold px-8 py-4 rounded-full text-lg border-2 border-gray-200 hover:border-gray-400 transition-all"
            >
              See Demo Store
            </Link>
          </div>
        </div>

        {/* How it works - 3 steps */}
        <div className="max-w-4xl mx-auto mt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Upload Products', desc: 'Drop in a CSV file with your product names, prices, and image URLs. Takes 30 seconds.', icon: '📄' },
              { step: '02', title: 'Pick Your Vibe', desc: 'Choose Minimal, Vibrant, or Luxury. Our AI adapts the entire design and copywriting to match.', icon: '🎨' },
              { step: '03', title: 'Go Live', desc: 'Get a shareable store URL with Stripe checkout built in. Start selling immediately.', icon: '🚀' },
            ].map((item) => (
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Three stunning templates. Zero design skills.</h2>
            <p className="text-lg text-gray-500">AI picks the right one for your brand — or you choose.</p>
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
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Minimal</div>
                <h3 className="font-bold text-gray-900 mb-2">Clean lines, white space, timeless.</h3>
                <p className="text-sm text-gray-500">Perfect for premium products, artisan goods, and lifestyle brands.</p>
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
                <div className="text-xs font-semibold text-orange-500 uppercase tracking-wider mb-1">Vibrant</div>
                <h3 className="font-bold text-gray-900 mb-2">Bold colors, high energy, scroll-stopping.</h3>
                <p className="text-sm text-gray-500">Ideal for food & beverage, fitness, streetwear, and youth brands.</p>
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
                <div className="text-xs font-semibold text-yellow-600 uppercase tracking-wider mb-1">Luxury</div>
                <h3 className="font-bold text-gray-900 mb-2">Dark elegance, premium presence.</h3>
                <p className="text-sm text-gray-500">Made for jewelry, skincare, spirits, and high-end lifestyle goods.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything you need to start selling.</h2>
            <p className="text-lg text-gray-500">No design tools, no checkout configuration, no wasted weeks.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '✍️', title: 'AI Copywriting', desc: 'Product descriptions, store taglines, and headlines — written by AI, tailored to your brand tone.' },
              { icon: '💳', title: 'Stripe Checkout', desc: 'Payment links auto-generated for every product. Customers pay securely, money goes directly to you.' },
              { icon: '📱', title: 'Mobile-First', desc: 'Every template is fully responsive. Looks perfect on iPhone, iPad, and desktop.' },
              { icon: '⚡', title: 'Instant Publishing', desc: 'Get a live shareable URL the moment generation is complete. No hosting setup needed.' },
            ].map((f) => (
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
          <h2 className="text-4xl font-bold text-white mb-4">Your first sale could be today.</h2>
          <p className="text-lg text-gray-400 mb-10">Join creators and micro-sellers who launched their stores without touching a line of code.</p>
          <Link
            href="/create"
            className="inline-block bg-white text-gray-900 font-bold px-10 py-5 rounded-full text-lg hover:bg-gray-100 transition-all hover:scale-105"
          >
            Start Building Free →
          </Link>
          <p className="text-xs text-gray-600 mt-6">No credit card required · Ready in 3 minutes</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-gray-950 border-t border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-white font-bold">✦ StoreAI</div>
          <p className="text-gray-500 text-sm">Built for creators who move fast.</p>
          <p className="text-gray-600 text-xs">© 2025 StoreAI</p>
        </div>
      </footer>
    </div>
  );
}
