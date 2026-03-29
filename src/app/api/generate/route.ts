import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { nanoid } from 'nanoid';
import type { RawProduct, Product, FontPack } from '@/lib/types';

interface GenerateBody {
  category: string;
  brandStyle: string;
  products: RawProduct[];
}

export async function POST(req: Request) {
  const body: GenerateBody = await req.json();
  const { category, brandStyle, products } = body;

  // Add IDs to products
  const productsWithIds = products.map(p => ({ ...p, id: nanoid() }));

  if (!process.env.ANTHROPIC_API_KEY) {
    // Return mock data
    return NextResponse.json({
      storeName: category.split(' ').slice(0, 2).map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') + ' Studio',
      tagline: 'Quality you can feel.',
      primaryColor: brandStyle === 'vibrant' ? '#f97316' : brandStyle === 'luxury' ? '#0a0a0a' : '#1a1a1a',
      fontPack: (brandStyle === 'vibrant' ? 'playful' : brandStyle === 'luxury' ? 'classic' : 'modern') as FontPack,
      products: productsWithIds.map(p => ({
        ...p,
        description: `Discover the exceptional quality of ${p.name}. Crafted with care and attention to detail, this product delivers an experience that exceeds expectations. Perfect for those who appreciate the finer things in life.`,
        stripePaymentLink: undefined,
      })) as Product[],
    });
  }

  const client = new Anthropic();

  const prompt = `Generate branding for an e-commerce store with these details:
- Category/What they sell: ${category}
- Brand style: ${brandStyle}
- Products: ${JSON.stringify(products.map(p => ({ name: p.name, price: p.price })))}

Respond with ONLY this JSON (no markdown, no explanation):
{
  "storeName": "catchy store name 2-4 words",
  "tagline": "compelling tagline under 10 words",
  "primaryColor": "hex color fitting the brand",
  "fontPack": "modern|classic|playful",
  "descriptions": ${JSON.stringify(products.map((_, i) => ({ index: i, description: "" })))}
}

Rules for descriptions: exactly 50 words, benefit-focused, emotional, specific to the product.
Rules for colors: minimal=#1a1a1a or #0d0d0d, vibrant=#f97316 or #6366f1, luxury=#0a0a0a.
Rules for fontPack: minimal=modern, luxury=classic, vibrant=playful.`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');

    const parsed = JSON.parse(jsonMatch[0]);

    const finalProducts: Product[] = productsWithIds.map((p, i) => ({
      ...p,
      description: parsed.descriptions?.[i]?.description || `A premium ${p.name}, crafted for quality and designed for your lifestyle. Experience the difference.`,
    }));

    return NextResponse.json({
      storeName: parsed.storeName || 'My Store',
      tagline: parsed.tagline || 'Quality products, delivered.',
      primaryColor: parsed.primaryColor || '#1a1a1a',
      fontPack: parsed.fontPack || 'modern',
      products: finalProducts,
    });
  } catch (err) {
    console.error('AI generation error:', err);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}
