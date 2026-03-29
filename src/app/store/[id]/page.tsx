import { notFound } from 'next/navigation';
import { getStore } from '@/lib/storage';
import StorefrontRenderer from '@/components/StorefrontRenderer';

export default function StorePage({ params }: { params: { id: string } }) {
  const config = getStore(params.id);
  if (!config) notFound();
  return <StorefrontRenderer config={config} editable={false} />;
}
