import React, { useRef, useState, useEffect } from 'react';
import { Search, X, SlidersHorizontal, Check, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { CurrencyCode, PriceRangeId } from '../types';
import { CATEGORIES } from '../data/products';

interface UtilityBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  currency: CurrencyCode;
  onCurrencyChange: (code: CurrencyCode) => void;
  sortBy: 'popular' | 'price-asc' | 'price-desc' | 'rating';
  onSortChange: (sort: 'popular' | 'price-asc' | 'price-desc' | 'rating') => void;
  choiceOnly: boolean;
  onToggleChoiceOnly: () => void;
  selectedPriceRange: PriceRangeId;
  onPriceRangeChange: (range: PriceRangeId) => void;
}

const PRICE_RANGES: { id: PriceRangeId; label: string }[] = [
  { id: 'all', label: 'Tous les prix' },
  { id: 'under-20', label: '< 20 €' },
  { id: '20-50', label: '20 – 50 €' },
  { id: 'over-50', label: '> 50 €' },
];

export const UtilityBar: React.FC<UtilityBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  currency,
  onCurrencyChange,
  sortBy,
  onSortChange,
  choiceOnly,
  onToggleChoiceOnly,
  selectedPriceRange,
  onPriceRangeChange,
}) => {
  const catScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkCatScroll = () => {
    if (catScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = catScrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkCatScroll();
    const el = catScrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkCatScroll);
      return () => el.removeEventListener('scroll', checkCatScroll);
    }
  }, []);

  const handleScrollCategories = (direction: 'left' | 'right') => {
    if (catScrollRef.current) {
      const offset = direction === 'left' ? -220 : 220;
      catScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative z-20 bg-white dark:bg-zinc-900 border-b border-zinc-200/90 dark:border-zinc-800 shadow-2xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        
        {/* Row 1: Search + Categories sliding rail + Quick toggles */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* Search Input with Clear Button */}
          <div className="relative w-full lg:w-80 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Rechercher serviettes, caftans, rideaux, casques..."
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-0.5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Interactive Categories Slider Rail with Left/Right glide buttons */}
          <div className="relative flex-1 min-w-0 flex items-center gap-1">
            {canScrollLeft && (
              <button
                type="button"
                onClick={() => handleScrollCategories('left')}
                aria-label="Faire glisser les catégories vers la gauche"
                className="hidden sm:flex shrink-0 w-7 h-7 rounded-lg bg-white dark:bg-zinc-800 shadow-xs border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:text-orange-600 dark:hover:text-orange-400 hover:border-orange-300 dark:hover:border-orange-500/50 items-center justify-center cursor-pointer transition-all active:scale-95 z-10"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            )}

            <div
              ref={catScrollRef}
              className="flex items-center gap-1.5 overflow-x-auto scroll-smooth scrollbar-subtle py-1 px-0.5 w-full select-none"
            >
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onCategoryChange(cat.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-zinc-950 dark:bg-orange-600 text-white shadow-xs'
                      : 'bg-zinc-100/90 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-950 dark:hover:text-white border border-transparent'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {canScrollRight && (
              <button
                type="button"
                onClick={() => handleScrollCategories('right')}
                aria-label="Faire glisser les catégories vers la droite"
                className="hidden sm:flex shrink-0 w-7 h-7 rounded-lg bg-white dark:bg-zinc-800 shadow-xs border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:text-orange-600 dark:hover:text-orange-400 hover:border-orange-300 dark:hover:border-orange-500/50 items-center justify-center cursor-pointer transition-all active:scale-95 z-10"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Controls: Choice toggle, Currency, Sort */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 justify-between lg:justify-end">
            {/* Choice toggle */}
            <button
              type="button"
              onClick={onToggleChoiceOnly}
              className={`px-2.5 py-1.5 text-xs font-bold rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                choiceOnly
                  ? 'bg-orange-50 dark:bg-orange-950/40 border-orange-500 text-orange-700 dark:text-orange-300'
                  : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-600'
              }`}
            >
              {choiceOnly && <Check className="w-3 h-3 text-orange-600 dark:text-orange-400" />}
              <span>Choice</span>
            </button>

            {/* Currency */}
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 hidden sm:inline">Devise:</span>
              <select
                value={currency}
                onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
                className="px-2 py-1.5 text-xs font-medium bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-orange-500 cursor-pointer"
              >
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
                <option value="XOF">XOF (FCFA)</option>
                <option value="CAD">CAD (CA$)</option>
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as any)}
                className="px-2 py-1.5 text-xs font-medium bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-orange-500 cursor-pointer"
              >
                <option value="popular">Populaire</option>
                <option value="rating">Mieux notés</option>
                <option value="price-asc">Prix ↑</option>
                <option value="price-desc">Prix ↓</option>
              </select>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
