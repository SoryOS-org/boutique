import React, { useState } from 'react';
import { X, Star, ShieldCheck, Truck, RotateCcw, Check, ShoppingBag, Zap, Heart, Building2, Flame, AlertTriangle, Maximize2, ThumbsUp, Camera, Image as ImageIcon, MessageCircle } from 'lucide-react';
import { Product, ProductVariant, CurrencyCode, Review } from '../types';
import { formatPrice } from '../data/products';
import { ImageLightbox } from './ImageLightbox';

interface ProductModalProps {
  product: Product | null;
  currency: CurrencyCode;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onClose: () => void;
  onAddToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
  onBuyNow: (product: Product, variant: ProductVariant, quantity: number) => void;
  onAddReview: (productId: string, review: Review) => void;
  onOpenChatWithProduct?: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  currency,
  isWishlisted,
  onToggleWishlist,
  onClose,
  onAddToCart,
  onBuyNow,
  onAddReview,
  onOpenChatWithProduct,
}) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product?.variants?.[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews' | 'seller'>('details');
  const [addedSuccess, setAddedSuccess] = useState(false);

  // New review form
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewPhotoUrl, setNewReviewPhotoUrl] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewStarFilter, setReviewStarFilter] = useState<number | 'all'>('all');
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);

  React.useEffect(() => {
    if (product?.variants?.[0]) {
      setSelectedVariant(product.variants[0]);
    }
    if (product?.image) {
      setModalImgSrc(product.image);
    }
  }, [product]);

  const [modalImgSrc, setModalImgSrc] = useState(product?.image || '');

  if (!product) return null;

  const currentVariant = selectedVariant || product.variants[0];
  const allImages = [modalImgSrc || product.image];

  const discountPercent = Math.round(
    ((product.originalPriceEUR - product.priceEUR) / product.originalPriceEUR) * 100
  );

  const handleAddToCart = () => {
    onAddToCart(product, currentVariant, quantity);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewComment.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      author: newReviewAuthor.trim() || 'Client Vérifié SoryOS',
      rating: newReviewRating,
      date: "Aujourd'hui",
      comment: newReviewComment.trim(),
      country: 'France',
      verifiedBuyer: true,
      photos: newReviewPhotoUrl.trim() ? [newReviewPhotoUrl.trim()] : undefined,
      helpfulCount: 0,
    };

    onAddReview(product.id, newRev);
    setNewReviewComment('');
    setNewReviewPhotoUrl('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 2500);
  };

  const handleHelpfulVote = (reviewId: string) => {
    setHelpfulVotes(prev => ({
      ...prev,
      [reviewId]: (prev[reviewId] ?? (product.reviews.find(r => r.id === reviewId)?.helpfulCount || 0)) + 1
    }));
  };

  const filteredReviews = product.reviews.filter(r => {
    if (reviewStarFilter === 'all') return true;
    return r.rating === reviewStarFilter;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200/90 dark:border-zinc-800 overflow-hidden my-6 transition-colors">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Fermer la vue produit"
          className="absolute top-4 right-4 z-20 p-2 text-zinc-400 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 bg-white/90 dark:bg-zinc-800/90 hover:bg-white dark:hover:bg-zinc-800 rounded-full transition-colors shadow-sm cursor-pointer border border-zinc-200/60 dark:border-zinc-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          
          {/* Left Column: Visual Gallery Box */}
          <div className="md:col-span-6 bg-zinc-50/80 dark:bg-zinc-950/80 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-zinc-200/80 dark:border-zinc-800 transition-colors">
            <div>
              {/* Product Showcase Box */}
              <div
                onClick={() => setLightboxOpen(true)}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm mb-4.5 group cursor-zoom-in"
                title="Cliquer pour zoomer et agrandir en HD"
              >
                <img
                  src={modalImgSrc || product.image}
                  alt={product.name}
                  onError={() => {
                    const filename = (modalImgSrc || product.image).split('/').pop();
                    if (filename && !modalImgSrc.startsWith('/images/')) {
                      setModalImgSrc(`/images/${filename}`);
                    }
                  }}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* HD Zoom Hover Pill */}
                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-3 py-1.5 bg-black/75 backdrop-blur-md text-white text-xs font-semibold rounded-full shadow-lg border border-white/20 flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <Maximize2 className="w-3.5 h-3.5 text-orange-400" />
                    <span>Zoom HD & Galerie</span>
                  </span>
                </div>
                
                <div className="absolute top-3 left-3 flex flex-col sm:flex-row items-start sm:items-center gap-1.5 z-10">
                  {product.isChoice && (
                    <div className="bg-orange-600 text-white text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-md shadow-sm">
                      Choice
                    </div>
                  )}
                  {product.flashDeal && (
                    <div className="bg-red-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 fill-white" />
                      <span>Vente Flash</span>
                    </div>
                  )}
                  {typeof product.stockQuantity === 'number' && product.stockQuantity > 0 && product.stockQuantity < 5 && (
                    <div className="bg-rose-600 text-white text-[11px] font-bold uppercase px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1 animate-pulse">
                      <AlertTriangle className="w-3.5 h-3.5 text-white" />
                      <span>Stock limité ({product.stockQuantity} restants)</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWishlist(product);
                  }}
                  className="absolute top-3 right-3 z-10 p-2 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md rounded-full text-zinc-400 dark:text-zinc-300 hover:text-rose-500 dark:hover:text-rose-400 shadow-sm cursor-pointer border border-zinc-200/50 dark:border-zinc-700/60 transition-all hover:scale-110 active:scale-95"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isWishlisted ? 'text-rose-500 fill-rose-500' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Seller Fast Box */}
              <div className="p-3.5 bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-2xl mb-4.5 text-xs flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 rounded-xl">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-zinc-950 dark:text-zinc-100 block truncate max-w-[210px]">
                      {product.seller.name}
                    </span>
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      {product.seller.ratingPercent}% avis positifs · {product.seller.yearsActive} ans actif
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('seller')}
                  className="px-2.5 py-1 text-xs font-semibold text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                >
                  Détails usine
                </button>
              </div>
            </div>

            {/* Quality Seals Box */}
            <div className="space-y-2 pt-4 border-t border-zinc-200/80 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-300">
              <div className="p-2.5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/60 dark:border-zinc-800 flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-orange-600 dark:text-orange-500 shrink-0" />
                <span>Livraison standard Choice : <strong className="text-zinc-900 dark:text-zinc-100">5 à 8 jours ouvrés</strong></span>
              </div>
              <div className="p-2.5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/60 dark:border-zinc-800 flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-orange-600 dark:text-orange-500 shrink-0" />
                <span>Protection acheteur officielle SoryOS (90 jours)</span>
              </div>
              <div className="p-2.5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/60 dark:border-zinc-800 flex items-center gap-2.5">
                <RotateCcw className="w-4 h-4 text-orange-600 dark:text-orange-500 shrink-0" />
                <span>Retours gratuits locaux sous 15 jours sans justification</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between bg-white dark:bg-zinc-900 transition-colors">
            <div>
              {/* Category & Status */}
              <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-2">
                <span className="font-medium text-zinc-600 dark:text-zinc-300">{product.categoryLabel}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">{product.salesCount.toLocaleString('fr-FR')} commandes</span>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-950 dark:text-white mb-3 leading-snug">
                {product.name}
              </h2>

              {/* Rating and Reviews */}
              <div className="flex items-center gap-2.5 text-sm text-zinc-600 dark:text-zinc-300 mb-5">
                <div className="flex items-center bg-amber-50 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-800/50 px-2 py-0.5 rounded-lg text-amber-600 dark:text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400 stroke-amber-500" />
                  <span className="ml-1.5 font-bold font-mono text-zinc-900 dark:text-zinc-100 tabular-nums text-xs">
                    {product.rating.toFixed(2)}
                  </span>
                </div>
                <span aria-hidden="true" className="text-zinc-300 dark:text-zinc-700">·</span>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className="text-orange-600 dark:text-orange-400 hover:underline font-mono tabular-nums text-xs cursor-pointer font-medium"
                >
                  {product.reviews.length} avis certifiés
                </button>
              </div>

              {/* Pricing Box with High Visual Polish */}
              <div className="p-4 bg-gradient-to-r from-orange-50/90 to-amber-50/50 dark:from-zinc-800 dark:to-zinc-800/80 rounded-2xl border border-orange-200/80 dark:border-zinc-700 mb-5 shadow-2xs">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-orange-600 dark:text-orange-400 font-mono tabular-nums tracking-tight">
                    {formatPrice(product.priceEUR, currency)}
                  </span>
                  <span className="text-sm text-zinc-400 dark:text-zinc-500 line-through font-mono tabular-nums">
                    {formatPrice(product.originalPriceEUR, currency)}
                  </span>
                  <span className="text-xs font-bold text-orange-800 dark:text-orange-300 bg-orange-100/90 dark:bg-orange-950/60 px-2 py-0.5 rounded-md border border-orange-300/40 dark:border-orange-800/50">
                    -{discountPercent}%
                  </span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1.5">
                  TVA incluse · Tarif direct fabricant garanti sans intermédiaire
                </p>
              </div>

              {/* Variant Selector Box */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide mb-2.5">
                  Variante / Finition : <span className="text-zinc-950 dark:text-white font-semibold">{currentVariant.name}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-3.5 py-2 text-xs font-medium rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                        currentVariant.id === variant.id
                          ? 'border-orange-600 bg-orange-50/80 dark:bg-orange-950/40 text-orange-950 dark:text-orange-200 ring-1 ring-orange-600 shadow-xs'
                          : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-750'
                      }`}
                    >
                      {variant.colorHex && (
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0 shadow-2xs"
                          style={{ backgroundColor: variant.colorHex }}
                        />
                      )}
                      <span>{variant.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Stepper Box */}
              <div className="flex flex-col gap-2 mb-6">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">
                    Quantité :
                  </span>
                  <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-800 shadow-2xs">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="px-3 py-1.5 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-30 cursor-pointer font-bold"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 text-sm font-semibold font-mono tabular-nums text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => {
                        const maxLimit = product.stockQuantity ?? 99;
                        setQuantity(Math.min(maxLimit, quantity + 1));
                      }}
                      disabled={product.stockQuantity !== undefined && quantity >= product.stockQuantity}
                      className="px-3 py-1.5 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-30 cursor-pointer font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
                {typeof product.stockQuantity === 'number' && product.stockQuantity < 5 && (
                  <p className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>Stock limité : plus que <strong>{product.stockQuantity}</strong> exemplaires restants en réserve !</span>
                  </p>
                )}
              </div>

              {/* Navigation Tabs */}
              <div className="border-b border-zinc-200 dark:border-zinc-800 flex gap-5 text-xs font-semibold mb-3.5">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`pb-2.5 border-b-2 cursor-pointer transition-colors ${
                    activeTab === 'details'
                      ? 'border-orange-600 text-orange-600 dark:text-orange-400 font-bold'
                      : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
                  }`}
                >
                  Fiche & Spécifications
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-2.5 border-b-2 cursor-pointer transition-colors ${
                    activeTab === 'reviews'
                      ? 'border-orange-600 text-orange-600 dark:text-orange-400 font-bold'
                      : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
                  }`}
                >
                  Avis Vérifiés ({product.reviews.length})
                </button>
                <button
                  onClick={() => setActiveTab('seller')}
                  className={`pb-2.5 border-b-2 cursor-pointer transition-colors ${
                    activeTab === 'seller'
                      ? 'border-orange-600 text-orange-600 dark:text-orange-400 font-bold'
                      : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
                  }`}
                >
                  Profil Fabricant
                </button>
              </div>

              {/* Tab Content Boxes */}
              {activeTab === 'details' && (
                <div className="text-xs text-zinc-600 dark:text-zinc-300 space-y-2.5 mb-6 max-h-40 overflow-y-auto pr-1 scrollbar-subtle">
                  <p className="leading-relaxed bg-zinc-50/70 dark:bg-zinc-800/60 p-3 rounded-xl border border-zinc-200/60 dark:border-zinc-700">
                    {product.description}
                  </p>
                  <ul className="space-y-1.5 pt-1">
                    {product.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 bg-white dark:bg-zinc-800 p-2 rounded-lg border border-zinc-100 dark:border-zinc-700">
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-3 mb-6 max-h-52 overflow-y-auto pr-1 scrollbar-subtle">
                  
                  {/* Filter by Star Buttons */}
                  <div className="flex items-center gap-1.5 pb-2 border-b border-zinc-200 dark:border-zinc-800 overflow-x-auto text-[11px]">
                    <span className="text-zinc-500 font-medium mr-1">Filtrer :</span>
                    <button
                      onClick={() => setReviewStarFilter('all')}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                        reviewStarFilter === 'all' ? 'bg-orange-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      Tous ({product.reviews.length})
                    </button>
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <button
                        key={stars}
                        onClick={() => setReviewStarFilter(stars)}
                        className={`px-2 py-1 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                          reviewStarFilter === stars ? 'bg-orange-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                        }`}
                      >
                        <Star className="w-3 h-3 fill-amber-400 stroke-amber-500" />
                        <span>{stars}★</span>
                      </button>
                    ))}
                  </div>

                  {/* Add review form box */}
                  <form onSubmit={handleSubmitReview} className="p-3.5 bg-zinc-50 dark:bg-zinc-800/80 rounded-2xl border border-zinc-200 dark:border-zinc-700 mb-3 space-y-2.5 shadow-2xs">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100">Partager votre avis acheteur certifié :</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setNewReviewRating(s)}
                            className="cursor-pointer"
                          >
                            <Star
                              className={`w-3.5 h-3.5 ${
                                s <= newReviewRating
                                  ? 'fill-amber-400 stroke-amber-500'
                                  : 'text-zinc-300 dark:text-zinc-600'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Votre nom"
                          value={newReviewAuthor}
                          onChange={(e) => setNewReviewAuthor(e.target.value)}
                          className="w-1/3 px-2.5 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:border-orange-500 text-zinc-900 dark:text-zinc-100"
                        />
                        <input
                          type="text"
                          required
                          placeholder="Votre retour sur le produit..."
                          value={newReviewComment}
                          onChange={(e) => setNewReviewComment(e.target.value)}
                          className="flex-1 px-2.5 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:border-orange-500 text-zinc-900 dark:text-zinc-100"
                        />
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1 flex items-center gap-2 px-2.5 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl">
                          <Camera className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          <input
                            type="url"
                            placeholder="URL photo optionnelle (ex. https://...)"
                            value={newReviewPhotoUrl}
                            onChange={(e) => setNewReviewPhotoUrl(e.target.value)}
                            className="w-full text-xs bg-transparent focus:outline-none text-zinc-900 dark:text-zinc-100"
                          />
                        </div>
                        <button
                          type="submit"
                          className="px-4 py-1.5 bg-zinc-950 dark:bg-orange-600 hover:bg-zinc-800 dark:hover:bg-orange-500 text-white rounded-xl text-xs font-semibold cursor-pointer shrink-0 transition-colors"
                        >
                          Publier l'avis
                        </button>
                      </div>
                    </div>
                    {reviewSubmitted && (
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Avis publié (+50 pièces SoryOS offertes) !
                      </p>
                    )}
                  </form>

                  {/* Existing Reviews Boxes */}
                  {filteredReviews.length === 0 ? (
                    <p className="text-xs text-zinc-400 text-center py-4">Aucun avis ne correspond à ce filtre.</p>
                  ) : (
                    filteredReviews.map((rev) => {
                      const count = helpfulVotes[rev.id] ?? (rev.helpfulCount || 0);
                      return (
                        <div key={rev.id} className="p-3 bg-zinc-50/70 dark:bg-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl text-xs border border-zinc-200/80 dark:border-zinc-700 transition-colors space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-zinc-900 dark:text-zinc-100">
                              {rev.author} ({rev.country})
                              {rev.verifiedBuyer && (
                                <span className="ml-1.5 text-[10px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 font-bold px-1.5 py-0.2 rounded border border-emerald-200/60 dark:border-emerald-800/40">
                                  Achat certifié
                                </span>
                              )}
                            </span>
                            <div className="flex items-center text-amber-500">
                              <Star className="w-3 h-3 fill-amber-400 stroke-amber-500" />
                              <span className="ml-1 font-mono font-bold text-zinc-900 dark:text-zinc-100">{rev.rating}</span>
                            </div>
                          </div>
                          <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">{rev.comment}</p>

                          {/* Photos if any */}
                          {rev.photos && rev.photos.length > 0 && (
                            <div className="flex gap-2 pt-1">
                              {rev.photos.map((pUrl, pi) => (
                                <img
                                  key={pi}
                                  src={pUrl}
                                  alt="Photo avis client"
                                  className="w-14 h-14 object-cover rounded-lg border border-zinc-200 dark:border-zinc-700"
                                  referrerPolicy="no-referrer"
                                />
                              ))}
                            </div>
                          )}

                          {/* Helpful Vote Button */}
                          <div className="flex items-center justify-between pt-1 border-t border-zinc-200/60 dark:border-zinc-750 text-[11px] text-zinc-500">
                            <span className="italic">{rev.date}</span>
                            <button
                              onClick={() => handleHelpfulVote(rev.id)}
                              className="flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer font-medium text-zinc-600 dark:text-zinc-300"
                            >
                              <ThumbsUp className="w-3 h-3 text-orange-600" />
                              <span>Utile ({count})</span>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {activeTab === 'seller' && (
                <div className="p-4 bg-zinc-50 dark:bg-zinc-800/80 rounded-2xl border border-zinc-200/80 dark:border-zinc-700 mb-6 text-xs space-y-2.5 shadow-2xs">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-zinc-950 dark:text-white text-sm">{product.seller.name}</span>
                    <span className="bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800/50 px-2 py-0.5 rounded-md text-[10px] font-bold">
                      Fabricant Agréé Choice
                    </span>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-300">Localisation usine : <strong className="text-zinc-900 dark:text-zinc-100">{product.seller.location}</strong></p>
                  <p className="text-zinc-600 dark:text-zinc-300">
                    Avis positifs : <strong className="text-emerald-700 dark:text-emerald-400">{product.seller.ratingPercent}%</strong> ({product.seller.followersCount.toLocaleString('fr-FR')} abonnés)
                  </p>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed pt-1 border-t border-zinc-200 dark:border-zinc-700">
                    Cette entreprise expédie directement ses produits via le hub logistique SoryOS pour garantir les délais et l'inspection de chaque unité.
                  </p>
                  <a
                    href={`https://wa.me/224621090388?text=${encodeURIComponent(`Bonjour SoryOS, je souhaite commander / poser une question sur : ${product.name} (Réf: ${product.id}, Prix: ${product.priceEUR} €).`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full mt-3 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Discuter sur WhatsApp officiel (+224 621 09 03 88)</span>
                  </a>
                </div>
              )}
            </div>

            {/* CTAs Box: 3 buttons with identical dimensions (equal 1/3 width, h-12) and clear labels */}
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-row items-center gap-2 sm:gap-3 w-full">
              <a
                href={`https://wa.me/224621090388?text=${encodeURIComponent(`Bonjour SoryOS, je souhaite des infos ou commander l'article : ${product.name} (${product.priceEUR} €).`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-0 h-12 inline-flex items-center justify-center gap-1.5 px-2 sm:px-4 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-2xl transition-all cursor-pointer shadow-md shadow-emerald-600/20 active:scale-98 text-center"
                title="Discuter de ce produit sur WhatsApp officiel"
                aria-label="Discussion WhatsApp"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span className="truncate">WhatsApp</span>
              </a>

              <button
                onClick={handleAddToCart}
                className={`flex-1 min-w-0 h-12 inline-flex items-center justify-center gap-1.5 px-2 sm:px-4 text-xs sm:text-sm font-bold rounded-2xl transition-all cursor-pointer ${
                  addedSuccess
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700/60'
                }`}
                title="Ajouter au panier"
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-4 h-4 shrink-0" />
                    <span className="truncate">Ajouté !</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 shrink-0 text-orange-600 dark:text-orange-400" />
                    <span className="hidden sm:inline">Ajouter au panier</span>
                    <span className="sm:hidden truncate">Panier</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  onBuyNow(product, currentVariant, quantity);
                }}
                className="flex-1 min-w-0 h-12 inline-flex items-center justify-center gap-1.5 px-2 sm:px-4 text-xs sm:text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-2xl transition-all cursor-pointer shadow-md shadow-orange-600/20 active:scale-98"
                title="Acheter maintenant"
              >
                <Zap className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">Acheter maintenant</span>
                <span className="sm:hidden truncate">Acheter</span>
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Immersive HD Image Lightbox */}
      <ImageLightbox
        isOpen={lightboxOpen}
        images={allImages}
        initialIndex={0}
        productName={product.name}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
};
