import React, { useState, useEffect, useRef } from 'react';
import { Clock, Flame, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product, CurrencyCode } from '../types';
import { formatPrice } from '../data/products';

interface FlashDealsBannerProps {
  products: Product[];
  currency: CurrencyCode;
  onSelectProduct: (product: Product) => void;
  language: 'fr' | 'en';
}

const translations = {
  fr: {
    title: "SuperDeals · Ventes Flash Direct Usine",
    badge: "Jusqu’à -70%",
    subtitle: "Fenêtre de défilement interactif : faites glisser pour voir les {count} offres express",
    endDeal: "Fin du deal :",
    claimed: "Réclamé à",
    almostSoldOut: "Presque épuisé"
  },
  en: {
    title: "SuperDeals · Factory Direct Flash Sales",
    badge: "Up to -70%",
    subtitle: "Interactive scrolling window: swipe to explore {count} express deals",
    endDeal: "Deal ends in:",
    claimed: "Claimed",
    almostSoldOut: "Almost sold out"
  }
};

export const FlashDealsBanner: React.FC<FlashDealsBannerProps> = ({
  products,
  currency,
  onSelectProduct,
  language,
}) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 11, minutes: 42, seconds: 19 });
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const t = translations[language] || translations.fr;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      return () => el.removeEventListener('scroll', checkScroll);
    }
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const flashProducts = products.filter(
    (p) => p.flashDeal || ((p.originalPriceEUR - p.priceEUR) / p.originalPriceEUR) >= 0.35
  );

  return (
    <section className="bg-zinc-950 text-white py-8 border-y border-zinc-800 relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 p-4 sm:p-5 bg-zinc-900/90 border border-zinc-800/90 rounded-2xl backdrop-blur-md">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 bg-gradient-to-tr from-orange-600 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-600/20 shrink-0">
              <Flame className="w-6 h-6 text-white fill-white/20" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
                  {t.title}
                </h2>
                <span className="text-[10px] bg-red-600 text-white font-extrabold px-2 py-0.5 rounded uppercase tracking-wide">
                  {t.badge}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                {t.subtitle.replace('{count}', String(flashProducts.length))}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-zinc-950/90 border border-zinc-800 px-4 py-2 rounded-xl">
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                <Clock className="w-3.5 h-3.5 text-orange-500" />
                <span className="hidden sm:inline">{t.endDeal}</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono font-bold text-xs text-white">
                <span className="bg-zinc-800 px-2 py-1 rounded border border-zinc-700/60 tabular-nums">
                  {String(timeLeft.hours).padStart(2, '0')}h
                </span>
                <span className="text-zinc-600">:</span>
                <span className="bg-zinc-800 px-2 py-1 rounded border border-zinc-700/60 tabular-nums">
                  {String(timeLeft.minutes).padStart(2, '0')}m
                </span>
                <span className="text-zinc-600">:</span>
                <span className="bg-orange-600 text-white px-2 py-1 rounded shadow-xs tabular-nums">
                  {String(timeLeft.seconds).padStart(2, '0')}s
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleScroll('left')}
                disabled={!canScrollLeft}
                aria-label="Faire glisser vers la gauche"
                className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                  canScrollLeft
                    ? 'bg-zinc-800 hover:bg-orange-600 text-white border-zinc-700 hover:border-orange-500 shadow-sm active:scale-95'
                    : 'bg-zinc-900/60 text-zinc-600 border-zinc-800/80 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll('right')}
                disabled={!canScrollRight}
                aria-label="Faire glisser vers la droite"
                className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                  canScrollRight
                    ? 'bg-zinc-800 hover:bg-orange-600 text-white border-zinc-700 hover:border-orange-500 shadow-sm active:scale-95'
                    : 'bg-zinc-900/60 text-zinc-600 border-zinc-800/80 cursor-not-allowed'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex items-stretch gap-4 overflow-x-auto scroll-smooth scrollbar-subtle scroll-snap-x pb-4 pt-1 px-1 -mx-1"
        >
          {flashProducts.map((product) => {
            const percent = product.flashDeal?.percentClaimed || 78;
            const discountPercent = Math.round(
              ((product.originalPriceEUR - product.priceEUR) / product.originalPriceEUR) * 100
            );

            return (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="group relative bg-zinc-900/95 hover:bg-zinc-900 border border-zinc-800 hover:border-orange-500/70 rounded-2xl p-4 flex gap-4 items-center cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/10 min-w-[300px] sm:min-w-[340px] md:min-w-[370px] max-w-[400px] shrink-0 scroll-snap-align-start select-none"
              >
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-zinc-800 shrink-0 border border-zinc-700/50">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                    loading="lazy"
                  />
                  <div className="absolute top-1.5 left-1.5 bg-red-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-sm">
                    -{discountPercent}%
                  </div>
                  {product.stockQuantity !== undefined && product.stockQuantity < 5 && (
                    <div className="absolute bottom-1 left-1 bg-amber-500/90 text-zinc-950 text-[8px] font-black px-1 rounded uppercase">
                      Stock: {product.stockQuantity}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
                  <div>
                    <span className="text-[10px] font-semibold text-orange-400 uppercase tracking-wider block truncate">
                      {product.categoryLabel}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-orange-400 transition-colors mt-0.5">
                      {product.name}
                    </h3>
                  </div>

                  <div className="my-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-base sm:text-lg font-extrabold text-orange-400 font-mono tabular-nums">
                        {formatPrice(product.priceEUR, currency)}
                      </span>
                      <span className="text-xs text-zinc-500 line-through font-mono tabular-nums">
                        {formatPrice(product.originalPriceEUR, currency)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-semibold mb-1">
                      <span className="text-zinc-400">{t.claimed} {percent}%</span>
                      <span className="text-orange-400 flex items-center gap-1 font-bold">
                        <Zap className="w-2.5 h-2.5 fill-orange-400" />
                        <span>{t.almostSoldOut}</span>
                      </span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden p-0.5 border border-zinc-700/50">
                      <div
                        className="bg-gradient-to-r from-orange-500 to-red-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
