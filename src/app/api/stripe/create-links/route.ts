import { NextResponse } from 'next/server';
import type { Product } from '@/lib/types';

interface Body { products: Product[] }

export async function POST(req: Request) {
  const { products }: Body = await req.json();

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({
      products: products.map(p => ({
        ...p,
        stripePaymentLink: `https://buy.stripe.com/test_demo_${p.id}`,
      })),
      warning: 'STRIPE_SECRET_KEY not set — using mock links',
    });
  }

  try {
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const errors: string[] = [];

    const updatedProducts = await Promise.all(
      products.map(async (product) => {
        try {
          const stripeProduct = await stripe.products.create({
            name: product.name,
            description: (product.description || '').slice(0, 500),
            images: product.imageUrl ? [product.imageUrl] : [],
          });

          const price = await stripe.prices.create({
            product: stripeProduct.id,
            unit_amount: Math.round(product.price * 100),
            currency: 'usd',
          });

          const paymentLink = await stripe.paymentLinks.create({
            line_items: [{ price: price.id, quantity: 1 }],
            payment_method_types: ['card'],
          });

          return { ...product, stripePaymentLink: paymentLink.url };
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          errors.push(`${product.name}: ${msg}`);
          console.error(`Stripe error for "${product.name}":`, msg);
          return { ...product, stripePaymentLink: undefined };
        }
      })
    );

    return NextResponse.json({
      products: updatedProducts,
      ...(errors.length > 0 ? { errors } : {}),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Stripe init error:', msg);
    return NextResponse.json({
      products,
      error: msg,
    }, { status: 200 });
  }
}
