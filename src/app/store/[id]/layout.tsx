import type { Metadata } from 'next';
import { getStore } from '@/lib/storage';

type Props = {
  params: { id: string };
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const store = await getStore(params.id);

  if (!store) {
    return { title: 'Store Not Found — StoreAI' };
  }

  const firstImage = store.products[0]?.imageUrl;

  return {
    title: `${store.storeName} — Powered by StoreAI`,
    description: store.tagline,
    openGraph: {
      title: store.storeName,
      description: store.tagline,
      type: 'website',
      ...(firstImage ? { images: [{ url: firstImage, width: 800, height: 800 }] } : {}),
    },
    twitter: {
      card: firstImage ? 'summary_large_image' : 'summary',
      title: store.storeName,
      description: store.tagline,
      ...(firstImage ? { images: [firstImage] } : {}),
    },
  };
}

export default async function StoreLayout({ children, params }: Props) {
  const store = await getStore(params.id);

  const jsonLd = store
    ? {
        '@context': 'https://schema.org',
        '@type': 'Store',
        name: store.storeName,
        description: store.tagline,
        ...(store.products[0]?.imageUrl ? { image: store.products[0].imageUrl } : {}),
        offers: store.products.map((p) => ({
          '@type': 'Offer',
          name: p.name,
          description: p.description,
          price: p.price,
          priceCurrency: store.currency || 'USD',
          availability: 'https://schema.org/InStock',
          ...(p.imageUrl ? { image: p.imageUrl } : {}),
        })),
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  );
}
