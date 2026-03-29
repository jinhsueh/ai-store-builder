import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: 'URL required' }, { status: 400 });
    }

    // Fetch the page content
    let html: string;
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; StoreAI/1.0)',
          'Accept': 'text/html,application/xhtml+xml',
        },
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      html = await res.text();
    } catch {
      return NextResponse.json({ error: 'Could not fetch the URL. Make sure it is publicly accessible.' }, { status: 400 });
    }

    // Strip HTML tags, scripts, styles — keep just text content
    const textContent = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 8000);

    // Extract image URLs from the page
    const imgMatches = html.match(/<img[^>]+src=["']([^"']+)["']/gi) || [];
    const imageUrls = imgMatches
      .map(tag => {
        const match = tag.match(/src=["']([^"']+)["']/);
        return match ? match[1] : '';
      })
      .filter(src => src && (src.startsWith('http') || src.startsWith('//')))
      .map(src => src.startsWith('//') ? `https:${src}` : src)
      .slice(0, 20);

    // Extract OG metadata
    const ogTitle = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/)?.[1] || '';
    const ogDesc = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/)?.[1] || '';
    const ogImage = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/)?.[1] || '';
    const pageTitle = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || '';

    // Use Claude to extract product info if API key is available
    if (process.env.ANTHROPIC_API_KEY) {
      try {
        const Anthropic = (await import('@anthropic-ai/sdk')).default;
        const client = new Anthropic();

        const message = await client.messages.create({
          model: 'claude-sonnet-4-6',
          max_tokens: 2000,
          messages: [{
            role: 'user',
            content: `Analyze this web page content and extract product/brand information. Return a JSON object with:
- "storeName": the brand or store name
- "category": what they sell (e.g., "handmade candles")
- "tagline": a short brand tagline if found, or suggest one
- "products": array of { "name", "price" (number, 0 if unknown), "imageUrl", "description" }

Page URL: ${url}
Page title: ${pageTitle}
OG title: ${ogTitle}
OG description: ${ogDesc}
OG image: ${ogImage}
Available images on page: ${imageUrls.slice(0, 10).join(', ')}

Page text content:
${textContent}

Return ONLY valid JSON, no markdown.`,
          }],
        });

        const aiText = message.content[0].type === 'text' ? message.content[0].text : '';
        const parsed = JSON.parse(aiText);
        return NextResponse.json({
          ...parsed,
          source: 'ai',
          ogImage,
          imageUrls,
        });
      } catch (aiErr) {
        console.warn('AI extraction failed, falling back to basic:', aiErr);
      }
    }

    // Fallback: return basic extracted info without AI
    return NextResponse.json({
      storeName: ogTitle || pageTitle || '',
      category: '',
      tagline: ogDesc || '',
      products: [],
      source: 'basic',
      ogImage,
      imageUrls,
      textPreview: textContent.substring(0, 500),
    });
  } catch (err) {
    console.error('Scrape error:', err);
    return NextResponse.json({ error: 'Failed to process URL' }, { status: 500 });
  }
}
