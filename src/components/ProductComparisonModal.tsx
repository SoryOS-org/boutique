import React from 'react';
import { X, Star, ShoppingBag, Trash2, ShieldCheck, Truck, Scale } from 'lucide-react';
import { Product, CurrencyCode } from '../types';
import { formatPrice } from '../data/products';
import { getTranslation, Language } from '../i18n/translations';

interface ProductComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparedProducts: Product[];
  currency: CurrencyCode;
  onRemoveProduct: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onClearAll: () => void;
  language: Language;
}

export const ProductComparisonModal: React.FC<ProductComparisonModalProps> = ({
  isOpen,
  onClose,
  comparedProducts,
  currency,
  onRemoveProduct,
  onAddToCart,
  onClearAll,
  language,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-600/10 dark:bg-orange-950/40 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">{getTranslation(language, 'comparisonTitle')}</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {comparedProducts.length} {language === 'fr' ? 'sur 3 articles comparés côte à côte' : 'of 3 items compared side by side'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {comparedProducts.length > 0 && (
              <button
                onClick={onClearAll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{language === 'fr' ? 'Tout effacer' : 'Clear All'}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-x-auto overflow-y-auto p-4 sm:p-6">
          {comparedProducts.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-3xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mb-4">
                <Scale className="w-8 h-8 stroke-1" />
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-1">
                {language === 'fr' ? 'Aucun produit à comparer' : 'No products to compare'}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mb-6">
                {getTranslation(language, 'noProductsCompared')}
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-600/25 transition-all cursor-pointer"
              >
                {getTranslation(language, 'continueShopping')}
              </button>
            </div>
          ) : (
            <div className="min-w-[700px] grid grid-cols-4 gap-4">
              <div className="space-y-6 pt-4 text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider pr-4 border-r border-zinc-100 dark:border-zinc-800">
                <div className="h-44 flex items-center">{language === 'fr' ? 'Aperçu & Nom' : 'Preview & Name'}</div>
                <div className="h-14 flex items-center">{language === 'fr' ? 'Prix & Économie' : 'Price & Savings'}</div>
                <div className="h-12 flex items-center">{language === 'fr' ? 'Note & Avis' : 'Rating & Reviews'}</div>
                <div className="h-12 flex items-center">{language === 'fr' ? 'Catégorie' : 'Category'}</div>
                <div className="h-12 flex items-center">{language === 'fr' ? 'Vendeur Officiel' : 'Official Seller'}</div>
                <div className="h-12 flex items-center">{language === 'fr' ? 'Livraison' : 'Delivery'}</div>
                <div className="h-28 flex items-center">{language === 'fr' ? 'Points Clés' : 'Key Features'}</div>
                <div className="h-14 flex items-center">{language === 'fr' ? 'Action' : 'Action'}</div>
              </div>

              {comparedProducts.map((product) => {
                const discount = Math.round(
                  ((product.originalPriceEUR - product.priceEUR) / product.originalPriceEUR) * 100
                );
                return (
                  <div key={product.id} className="flex flex-col space-y-6 bg-zinc-50/50 dark:bg-zinc-800/40 p-4 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/60 relative group">
                    <button
                      onClick={() => onRemoveProduct(product.id)}
                      className="absolute top-2 right-2 p-1.5 bg-white dark:bg-zinc-800 text-zinc-400 hover:text-rose-500 rounded-full shadow-md transition-colors cursor-pointer z-10"
                      title={language === 'fr' ? 'Retirer' : 'Remove'}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>

                    <div className="h-44 flex flex-col items-center text-center">
                      <div className="w-24 h-24 rounded-xl overflow-hidden bg-white dark:bg-zinc-800 mb-2 border border-zinc-200/80 dark:border-zinc-700 shadow-sm">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-white line-clamp-2 px-1">
                        {product.name}
                      </h4>
                    </div>

                    <div className="h-14 flex flex-col justify-center items-center bg-white dark:bg-zinc-900 rounded-xl p-2 border border-zinc-200/60 dark:border-zinc-800">
                      <div className="text-sm font-extrabold text-zinc-950 dark:text-white font-mono">
                        {formatPrice(product.priceEUR, currency)}
                      </div>
                      {discount > 0 && (
                        <div className="text-[10px] text-orange-600 dark:text-orange-400 font-semibold">
                          {language === 'fr' ? `Économie de ${discount}%` : `Save ${discount}%`}
                        </div>
                      )}
                    </div>

                    <div className="h-12 flex items-center justify-center gap-1.5 bg-white dark:bg-zinc-900 rounded-xl px-2 border border-zinc-200/60 dark:border-zinc-800">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                      <span className="text-xs font-bold text-zinc-900 dark:text-white font-mono">
                        {product.rating.toFixed(1)}
                      </span>
                      <span className="text-[10px] text-zinc-400">({product.reviewsCount})</span>
                    </div>

                    <div className="h-12 flex items-center justify-center text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 rounded-xl px-2 border border-zinc-200/60 dark:border-zinc-800">
                      {product.categoryLabel}
                    </div>

                    <div className="h-12 flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-600 bg-white dark:bg-zinc-900 rounded-xl px-2 border border-zinc-200/60 dark:border-zinc-800">
                      <ShieldCheck className="w-4 h-4" />
                      <span>{product.seller.name}</span>
                    </div>

                    <div className="h-12 flex items-center justify-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 rounded-xl px-2 border border-zinc-200/60 dark:border-zinc-800">
                      <Truck className="w-4 h-4 text-orange-600" />
                      <span>{language === 'fr' ? '5-8 Jours (Gratuit)' : '5-8 Days (Free)'}</span>
                    </div>

                    <div className="h-28 bg-white dark:bg-zinc-900 rounded-xl p-3 border border-zinc-200/60 dark:border-zinc-800 overflow-y-auto">
                      <ul className="space-y-1 text-[11px] text-zinc-600 dark:text-zinc-300 list-disc list-inside">
                        {product.features.map((feat, idx) => (
                          <li key={idx} className="truncate">{feat}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="h-14 flex items-center">
                      <button
                        onClick={() => {
                          onAddToCart(product);
                          onClose();
                        }}
                        className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{getTranslation(language, 'addToCart')}</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
