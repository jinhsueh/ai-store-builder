import { NextResponse } from 'next/server';
import type { Product } from '@/lib/types';

interface Body { products: Product[] }

export async function POST(req: Request) {
  const { products }: Body = await req.json();

  if (!process.env.STRIPE_SECRET_KEY) {
    // Return products with mock payment links
    return NextResponse.json({
      products: products.map(p => ({
        ...p,
        stripePaymentLink: `https://buy.stripe.com/test_demo_${p.id}`,
      })),
    });
  }

  try {
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const updatedProducts = await Promise.all(
      products.map(async (product) => {
        try {
          const stripeProduct = await stripe.products.create({
            name: product.name,
            description: product.description.slice(0, 500),
            images: product.imageUrl ? [product.imageUrl] : [],
          });

          const price = await stripe.prices.create({
            product: stripeProduct.id,
            unit_amount: Math.round(product.price * 100),
            currency: 'twd',
          });

          const paymentLink = await stripe.paymentLinks.create({
            line_items: [{ price: price.id, quantity: 1 }],
          });

          return { ...product, stripePaymentLink: paymentLink.url };
        } catch {
          return { ...product, stripePaymentLink: undefined };
        }
      })
    );

    return NextResponse.json({ products: updatedProducts });
  } catch (err) {
    console.error('Stripe error:', err);
    return NextResponse.json({ products }, { status: 200 });
  }
}
