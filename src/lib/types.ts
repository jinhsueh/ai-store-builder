export type BrandStyle = 'minimal' | 'vibrant' | 'luxury';
export type FontPack = 'modern' | 'classic' | 'playful';

export interface RawProduct {
  name: string;
  price: number;
  imageUrl: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  stripePaymentLink?: string;
}

export interface StoreConfig {
  id: string;
  createdAt: string;
  storeName: string;
  tagline: string;
  category: string;
  brandStyle: BrandStyle;
  primaryColor: string;
  fontPack: FontPack;
  products: Product[];
}
