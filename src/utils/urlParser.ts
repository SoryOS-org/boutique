import { Product } from '../types';

export const extractUrl = (text: string): string | null => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const match = text.match(urlRegex);
  return match ? match[0] : null;
};

export const findProductFromUrl = (url: string, products: Product[]): Product | undefined => {
  // Simple check: does the product ID appear in the URL?
  return products.find(p => url.includes(p.id));
};
