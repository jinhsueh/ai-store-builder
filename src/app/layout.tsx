import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'StoreAI — Build Your Store in 3 Minutes',
  description: 'Upload your products, pick a vibe, and watch AI build your entire storefront with copy, design, and checkout links.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body className="bg-white text-gray-900 antialiased">{children}</body>
    </html>
  );
}
