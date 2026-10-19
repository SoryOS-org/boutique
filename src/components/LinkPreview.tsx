import React from 'react';
import { Product, CurrencyCode } from '../types';
import { formatPrice } from '../data/products';
import { ExternalLink } from 'lucide-react';

interface LinkPreviewProps {
  url: string;
  product?: Product;
  currency: CurrencyCode;
  onAddToCart: (product: Product) => void;
}

export const LinkPreview: React.FC<LinkPreviewProps> = ({ url, product, currency, onAddToCart }) => {
  if (product) {
    return (
      <div className="mt-2 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 max-w-[280px]">
        <div className="flex gap-3">
          <img src={product.image} alt={product.name} className="w-16 h-16 rounded-lg object-cover" />
          <div className="flex flex-col justify-between overflow-hidden">
            <h5 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 truncate">{product.name}</h5>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{formatPrice(product.priceEUR, currency)}</span>
            <button 
              onClick={() => onAddToCart(product)}
              className="text-[10px] font-bold bg-zinc-900 text-white rounded-lg py-1 px-2 hover:bg-zinc-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="mt-2 block p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs text-blue-600 dark:text-blue-400 hover:underline">
      <div className="flex items-center gap-2">
        <ExternalLink className="w-3.5 h-3.5" />
        <span className="truncate">{url}</span>
      </div>
    </a>
  );
};
