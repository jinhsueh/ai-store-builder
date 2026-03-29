import Papa from 'papaparse';
import { RawProduct } from './types';

type CSVRow = Record<string, string>;

function normalizeHeader(header: string): string {
  return header.toLowerCase().replace(/[\s_-]/g, '');
}

function findColumn(row: CSVRow, candidates: string[]): string | undefined {
  const normalizedRow: Record<string, string> = {};
  for (const key of Object.keys(row)) {
    normalizedRow[normalizeHeader(key)] = row[key];
  }
  for (const candidate of candidates) {
    const normalized = normalizeHeader(candidate);
    if (normalized in normalizedRow) {
      return normalizedRow[normalized];
    }
  }
  return undefined;
}

export function parseProductCSV(csvContent: string): RawProduct[] {
  const result = Papa.parse<CSVRow>(csvContent, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header: string) => header.trim(),
  });

  if (result.errors.length > 0 && result.data.length === 0) {
    throw new Error(`CSV parse error: ${result.errors[0].message}`);
  }

  const products: RawProduct[] = [];

  for (const row of result.data) {
    const name = findColumn(row, [
      'name',
      '商品名稱',
      'product name',
      'productname',
      'title',
    ]);

    const priceStr = findColumn(row, [
      'price',
      '價格',
      'cost',
      'amount',
    ]);

    const imageUrl = findColumn(row, [
      'imageUrl',
      'image_url',
      '圖片URL',
      'image',
      'imageurl',
      'img',
      'photo',
      'picture',
    ]);

    if (!name || !priceStr) continue;

    const price = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
    if (isNaN(price)) continue;

    products.push({
      name: name.trim(),
      price,
      imageUrl: (imageUrl || '').trim(),
    });
  }

  return products;
}
