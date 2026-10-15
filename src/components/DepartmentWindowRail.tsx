import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, LucideIcon } from 'lucide-react';
import { Product, CurrencyCode } from '../types';
import { ProductCard } from './ProductCard';
import { PRODUCTS } from '../data/products';

interface DepartmentWindowRailProps {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  badgeText: string;
  badgeColor?: string;
  products: Product[];
  currency: CurrencyCode;
  wishlistIds: string[];
  comparedProductIds?: string[];
  onToggleWishlist: (product: Product) => void;
  onToggleCompare?: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onExploreDepartment?: () => void;
  isLoading?: boolean;
  language?: 'fr' | 'en';
}

export const DepartmentWindowRail: React.FC<DepartmentWindowRailProps> = ({
  id,
  title,
  subtitle,
  icon: Icon,
  badgeText,
  badgeColor = 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800/60',
  products,
  currency,
  wishlistIds,
  comparedProductIds = [],
  onToggleWishlist,
  onToggleCompare = () => {},
  onQuickView,
  onAddToCart,
  onExploreDepartment,
  isLoading = false,
  language = 'fr',
}) => {
  const railRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (railRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = railRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = railRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      return () => el.removeEventListener('scroll', checkScroll);
    }
  }, [products]);

  const handleSlide = (direction: 'left' | 'right') => {
    if (railRef.current) {
      const offset = direction === 'left' ? -320 : 320;
      railRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  if (products.length === 0) return null;

  return (
    <section id={id} className="py-8 scroll-mt-36">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5 pb-3 border-b border-zinc-200/80 dark:border-zinc-800">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-800 dark:from-zinc-800 dark:to-zinc-700 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5 border border-zinc-700/50">
            <Icon className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-100">
                {title}
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${badgeColor}`}>
                {badgeText}
              </span>
              <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 tabular-nums">
                ({products.length} {language === 'fr' ? 'articles' : 'items'})
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {onExploreDepartment && (
            <button
              type="button"
              onClick={onExploreDepartment}
              className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 hover:underline flex items-center gap-1 cursor-pointer mr-2"
            >
              <span>{language === 'fr' ? 'Voir tout le rayon' : 'View all department'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleSlide('left')}
              disabled={!canScrollLeft}
              aria-label={`Faire glisser ${title} vers la gauche`}
              className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                canScrollLeft
                  ? 'bg-white dark:bg-zinc-800 hover:bg-orange-50 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700 shadow-xs hover:border-orange-300 dark:hover:border-orange-500/50 active:scale-95'
                  : 'bg-zinc-50 dark:bg-zinc-900/60 text-zinc-300 dark:text-zinc-700 border-zinc-100 dark:border-zinc-800/80 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleSlide('right')}
              disabled={!canScrollRight}
              aria-label={`Faire glisser ${title} vers la droite`}
              className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                canScrollRight
                  ? 'bg-white dark:bg-zinc-800 hover:bg-orange-50 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700 shadow-xs hover:border-orange-300 dark:hover:border-orange-500/50 active:scale-95'
                  : 'bg-zinc-50 dark:bg-zinc-900/60 text-zinc-300 dark:text-zinc-700 border-zinc-100 dark:border-zinc-800/80 cursor-not-allowed'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={railRef}
        className="flex items-stretch gap-5 overflow-x-auto scroll-smooth scrollbar-subtle scroll-snap-x py-2 px-1 -mx-1"
      >
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="w-[260px] sm:w-[280px] md:w-[300px] shrink-0 scroll-snap-align-start flex flex-col"
            >
              <ProductCard product={PRODUCTS[0]} isLoading={true} language={language} />
            </div>
          ))
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="w-[260px] sm:w-[280px] md:w-[300px] shrink-0 scroll-snap-align-start flex flex-col"
            >
              <ProductCard
                product={product}
                currency={currency}
                isWishlisted={wishlistIds.includes(product.id)}
                isCompared={comparedProductIds.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
                onToggleCompare={onToggleCompare}
                onQuickView={onQuickView}
                onAddToCart={onAddToCart}
                language={language}
              />
            </div>
          ))
        )}
      </div>
    </section>
  );
};
