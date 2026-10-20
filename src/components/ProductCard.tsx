import React, { useState } from 'react';
import { Star, ShoppingBag, Eye, Heart, Flame, Check, Share2, Copy, Scale } from 'lucide-react';
import { Product, CurrencyCode } from '../types';
import { formatPrice } from '../data/products';

interface ProductCardProps {
  product: Product;
  currency?: CurrencyCode;
  isWishlisted?: boolean;
  isCompared?: boolean;
  onToggleWishlist?: (product: Product) => void;
  onToggleCompare?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  isLoading?: boolean;
  language?: 'fr' | 'en';
}

const translations = {
  fr: {
    shareOn: "Partager sur",
    copyLink: "Copier le lien",
    copiedLink: "Lien copié !",
    quickView: "Aperçu rapide",
    added: "Ajouté",
    addToCart: "Ajouter au panier",
    compareTitle: "Comparer ce produit",
    uncompareTitle: "Retirer du comparateur",
    wishlistAdd: "Ajouter aux favoris",
    wishlistRemove: "Retirer des favoris",
  },
  en: {
    shareOn: "Share on",
    copyLink: "Copy Link",
    copiedLink: "Link Copied!",
    quickView: "Quick View",
    added: "Added",
    addToCart: "Add to Cart",
    compareTitle: "Compare product",
    uncompareTitle: "Remove from comparison",
    wishlistAdd: "Add to Wishlist",
    wishlistRemove: "Remove from Wishlist",
  }
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency = 'EUR',
  isWishlisted = false,
  isCompared = false,
  onToggleWishlist = () => {},
  onToggleCompare = () => {},
  onQuickView = () => {},
  onAddToCart = () => {},
  isLoading = false,
  language = 'fr',
}) => {
  const t = translations[language] || translations.fr;

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-2xl overflow-hidden flex flex-col justify-between animate-pulse h-full">
        <div className="relative aspect-[4/3] bg-zinc-200/80 dark:bg-zinc-800 overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent" />
          <div className="absolute top-3 left-3 w-14 h-5 bg-zinc-300/80 dark:bg-zinc-700 rounded-md" />
          <div className="absolute top-3 right-3 w-8 h-8 bg-zinc-300/80 dark:bg-zinc-700 rounded-full" />
        </div>
        <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-white dark:bg-zinc-900 space-y-3.5">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="w-24 h-3 bg-zinc-200 dark:bg-zinc-750 rounded" />
              <div className="w-16 h-3 bg-zinc-200 dark:bg-zinc-750 rounded" />
            </div>
            <div className="space-y-2 mb-3">
              <div className="w-full h-4 bg-zinc-200 dark:bg-zinc-750 rounded-md" />
              <div className="w-3/4 h-4 bg-zinc-200 dark:bg-zinc-750 rounded-md" />
            </div>
          </div>
          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-2.5">
            <div className="flex items-baseline justify-between">
              <div className="w-20 h-6 bg-zinc-200 dark:bg-zinc-750 rounded-md" />
              <div className="w-10 h-4 bg-emerald-100/80 dark:bg-emerald-950/40 rounded" />
            </div>
            <div className="w-full h-10 bg-zinc-200 dark:bg-zinc-750 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  const [imageError, setImageError] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>(product.image);
  const [retryCount, setRetryCount] = useState(0);

  React.useEffect(() => {
    setImgSrc(product.image);
    setImageError(false);
    setRetryCount(0);
  }, [product.image]);

  const handleImageError = () => {
    if (retryCount === 0) {
      const filename = imgSrc.split('/').pop();
      if (filename && !imgSrc.startsWith('/images/')) {
        setRetryCount(1);
        setImgSrc(`/images/${filename}`);
        return;
      }
    }
    setImageError(true);
  };

  const [addedAnim, setAddedAnim] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const discountPercent = Math.round(
    ((product.originalPriceEUR - product.priceEUR) / product.originalPriceEUR) * 100
  );
  const savingsEUR = product.originalPriceEUR - product.priceEUR;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1200);
  };

  const productUrl = window.location.href.split('#')[0] + '#product-' + product.id;
  const shareText = `Découvre "${product.name}" sur SoryOS Choice ! 🔥`;

  const handleFacebookShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'width=600,height=400');
    setIsShareOpen(false);
  };

  const handleTwitterShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(productUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
    setIsShareOpen(false);
  };

  const handleWhatsappShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + productUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
    setIsShareOpen(false);
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(productUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="group relative bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl overflow-hidden flex flex-col justify-between card-premium h-full transition-all duration-300 hover:shadow-xl hover:border-orange-500/30">
      
      <div
        className="relative aspect-[4/3] bg-zinc-100 dark:bg-zinc-800/60 overflow-hidden cursor-pointer select-none"
        onClick={() => onQuickView(product)}
      >
        {!imageError ? (
          <img
            src={imgSrc}
            alt={product.name}
            loading="lazy"
            decoding="async"
            onError={handleImageError}
            className="w-full h-full object-cover card-image-zoom transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-zinc-400 dark:text-zinc-500 bg-zinc-50 dark:bg-zinc-800">
            <ShoppingBag className="w-8 h-8 mb-2 stroke-1 text-zinc-300 dark:text-zinc-600" />
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{product.name}</span>
          </div>
        )}

        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
          {product.isChoice && (
            <span className="inline-flex items-center bg-orange-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
              Choice
            </span>
          )}
          {product.flashDeal && (
            <span className="inline-flex items-center gap-1 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
              <Flame className="w-3 h-3 fill-white" />
              <span>-{discountPercent}%</span>
            </span>
          )}
        </div>

        <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5">
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsShareOpen(!isShareOpen);
              }}
              aria-label="Partager ce produit"
              className="p-2 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md rounded-full text-zinc-500 dark:text-zinc-300 hover:text-orange-600 dark:hover:text-orange-400 shadow-sm transition-all hover:scale-110 active:scale-95 cursor-pointer border border-zinc-200/50 dark:border-zinc-700/60"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>

            {isShareOpen && (
              <div 
                className="absolute right-0 top-10 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl p-2 z-30 animate-in fade-in zoom-in-95 duration-150"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 px-2 py-1 uppercase tracking-wider border-b border-zinc-100 dark:border-zinc-800 mb-1">
                  {t.shareOn}
                </div>
                
                <button
                  onClick={handleFacebookShare}
                  className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">f</div>
                  <span>Facebook</span>
                </button>

                <button
                  onClick={handleTwitterShare}
                  className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-bold text-[10px]">𝕏</div>
                  <span>Twitter (X)</span>
                </button>

                <button
                  onClick={handleWhatsappShare}
                  className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">WA</div>
                  <span>WhatsApp</span>
                </button>

                <div className="my-1 border-t border-zinc-100 dark:border-zinc-800" />

                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center justify-between px-2.5 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Copy className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{copiedLink ? t.copiedLink : t.copyLink}</span>
                  </div>
                  {copiedLink && <Check className="w-3.5 h-3.5 text-emerald-600 animate-in zoom-in-75" />}
                </button>
              </div>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(product);
            }}
            aria-label={isCompared ? t.uncompareTitle : t.compareTitle}
            className={`p-2 backdrop-blur-md rounded-full shadow-sm transition-all hover:scale-110 active:scale-95 cursor-pointer border ${
              isCompared
                ? 'bg-orange-600 text-white border-orange-700 shadow-orange-600/30'
                : 'bg-white/90 dark:bg-zinc-800/90 text-zinc-500 dark:text-zinc-300 hover:text-orange-600 dark:hover:text-orange-400 border-zinc-200/50 dark:border-zinc-700/60'
            }`}
            title={isCompared ? t.uncompareTitle : t.compareTitle}
          >
            <Scale className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            aria-label={isWishlisted ? t.wishlistRemove : t.wishlistAdd}
            className="p-2 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md rounded-full text-zinc-400 dark:text-zinc-300 hover:text-rose-500 dark:hover:text-rose-400 shadow-sm transition-all hover:scale-110 active:scale-95 cursor-pointer border border-zinc-200/50 dark:border-zinc-700/60"
          >
            <Heart
              className={`w-3.5 h-3.5 transition-colors ${
                isWishlisted ? 'text-rose-500 fill-rose-500' : ''
              }`}
            />
          </button>
        </div>

        <div className="absolute inset-x-3 bottom-2.5 z-10 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 flex justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="px-3 py-1.5 bg-zinc-950/90 dark:bg-zinc-900/95 backdrop-blur-md text-white text-xs font-semibold rounded-full shadow-md hover:bg-zinc-950 dark:hover:bg-zinc-800 border border-white/10 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
          >
            <Eye className="w-3 h-3 text-zinc-300" />
            <span>{t.quickView}</span>
          </button>
        </div>
      </div>

      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between bg-white dark:bg-zinc-900 transition-colors">
        <div>
          <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 mb-1">
            <span className="font-medium text-zinc-500 dark:text-zinc-400 truncate">{product.categoryLabel}</span>
            <div className="flex items-center text-amber-500 shrink-0">
              <Star className="w-3 h-3 fill-amber-400 stroke-amber-500 mr-0.5" />
              <span className="font-bold font-mono text-zinc-800 dark:text-zinc-200 text-[11px]">
                {product.rating.toFixed(1)}
              </span>
            </div>
          </div>

          <h3
            onClick={() => onQuickView(product)}
            className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-2 hover:text-orange-600 dark:hover:text-orange-400 cursor-pointer transition-colors leading-snug mb-3"
            title={product.name}
          >
            {product.name}
          </h3>
        </div>

        <div className="pt-2.5 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-2.5">
          <div className="flex items-baseline justify-between gap-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-extrabold text-zinc-950 dark:text-white font-mono tracking-tight tabular-nums">
                {formatPrice(product.priceEUR, currency)}
              </span>
              {discountPercent > 0 && (
                <span className="text-[11px] text-zinc-400 dark:text-zinc-500 line-through font-mono tabular-nums">
                  {formatPrice(product.originalPriceEUR, currency)}
                </span>
              )}
            </div>

            {savingsEUR > 0 && (
              <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/50 px-1.5 py-0.5 rounded border border-orange-200/50 dark:border-orange-800/40 font-mono">
                -{discountPercent}%
              </span>
            )}
          </div>

          <button
            onClick={handleAdd}
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all duration-300 ease-out transform shadow-sm hover:shadow-lg hover:shadow-orange-500/30 hover:scale-[1.04] active:scale-[0.96] select-none ${
              addedAnim
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-100'
                : 'bg-zinc-950 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-500 text-white'
            }`}
          >
            {addedAnim ? (
              <>
                <Check className="w-3.5 h-3.5 animate-in zoom-in-75 duration-200" />
                <span className="font-bold">{t.added}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-orange-400 dark:text-white group-hover:text-white transition-transform group-hover:scale-110 duration-200" />
                <span>{t.addToCart}</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};
