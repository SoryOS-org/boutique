import React, { useState, useMemo, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { MessagingProvider } from './context/MessagingContext';
import { Header } from './components/Header';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { UtilityBar } from './components/UtilityBar';
import { SessionsNav } from './components/SessionsNav';
import { HeroBanner } from './components/HeroBanner';
import { FlashDealsBanner } from './components/FlashDealsBanner';
import { DepartmentWindowRail } from './components/DepartmentWindowRail';
import { ProductCard } from './components/ProductCard';
import { ProductSkeleton } from './components/ProductSkeleton';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CoinsDrawer } from './components/CoinsDrawer';
import { AccountModal } from './components/AccountModal';
import { SupportChatModal } from './components/SupportChatModal';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { AboutModal } from './components/AboutModal';
import { FacebookAdsModal } from './components/FacebookAdsModal';
import { CommunityChatModal } from './components/CommunityChatModal';
import { ProductComparisonModal } from './components/ProductComparisonModal';
import { ToastContainer } from './components/ToastContainer';
import { InitialPortal } from './components/InitialPortal';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { PRODUCTS, INITIAL_USER } from './data/products';
import { Product, ProductVariant, CartItem, CurrencyCode, Order, UserAccount, Review, PriceRangeId, WishlistItemMeta, ToastNotification, ToastType } from './types';
import { Sparkles, Check, MessageSquareText, MessageCircle, ShieldCheck, Truck, BedDouble, Shirt, Headphones, Coffee, RotateCcw, ArrowRight, LayoutGrid } from 'lucide-react';
import { initDB, saveCatalog, getCatalog, saveFavorites, getFavorites } from './utils/indexedDB';

export default function App() {
  const [currency, setCurrency] = useState<CurrencyCode>('EUR');
  const [language, setLanguage] = useState<'fr' | 'en'>(() => {
    return (localStorage.getItem('soryos_lang') as 'fr' | 'en') || 'fr';
  });

  React.useEffect(() => {
    localStorage.setItem('soryos_lang', language);
  }, [language]);

  // Initial Point View: 'portal' (Hub with 2 main buttons) or 'shop' (Full store as before)
  const [activeView, setActiveView] = useState<'portal' | 'shop'>('portal');

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating'>('popular');
  const [choiceOnly, setChoiceOnly] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRangeId>('all');

  // Initial loading state for smooth skeleton perception
  const [isLoading, setIsLoading] = useState(true);
  
  // Products dynamic state (allowing live review posting)
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [wishlistMetas, setWishlistMetas] = useState<WishlistItemMeta[]>([]);

  useEffect(() => {
    const loadData = async () => {
      await initDB();
      const cachedCatalog = await getCatalog();
      if (cachedCatalog && cachedCatalog.length > 0) {
        setProductsList(cachedCatalog);
      } else {
        setProductsList(PRODUCTS);
        saveCatalog(PRODUCTS);
      }
      
      const cachedFavorites = await getFavorites();
      if (cachedFavorites && cachedFavorites.length > 0) {
        setWishlistIds(cachedFavorites.map(f => f.productId));
        setWishlistMetas(cachedFavorites.map(f => ({ productId: f.productId, listName: f.listName, note: f.note })));
      } else {
        // Fallback initial
        setWishlistIds(['aly-anc-900', 'aly-drone-4k']);
        setWishlistMetas([
          { productId: 'aly-anc-900', listName: 'Favoris Principaux', note: 'Casque haute fidélité pour voyage' },
          { productId: 'aly-drone-4k', listName: 'Tech & Setup', note: 'Drone pro pour tournages' },
        ]);
      }
      setIsLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (productsList.length > 0) saveCatalog(productsList);
  }, [productsList]);

  useEffect(() => {
    const favoritesData = wishlistIds.map(id => {
      const meta = wishlistMetas.find(m => m.productId === id) || { listName: 'Favoris Principaux', note: '' };
      return { id, productId: id, ...meta };
    });
    saveFavorites(favoritesData);
  }, [wishlistIds, wishlistMetas]);

  // Instant filtering without artificial flashing/delays
  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
  };

  const handlePriceRangeChange = (range: PriceRangeId) => {
    setSelectedPriceRange(range);
  };

  const handleChoiceToggle = () => {
    setChoiceOnly((prev) => !prev);
  };

  const handleSortChange = (sort: 'popular' | 'price-asc' | 'price-desc' | 'rating') => {
    setSortBy(sort);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedPriceRange('all');
    setChoiceOnly(false);
  };

  // User state
  const [userAccount, setUserAccount] = useState<UserAccount>(INITIAL_USER);

  const handleUpdateWishlistMeta = (productId: string, listName: string, note: string) => {
    setWishlistMetas(prev => {
      const existing = prev.find(m => m.productId === productId);
      if (existing) {
        return prev.map(m => m.productId === productId ? { ...m, listName, note } : m);
      }
      return [...prev, { productId, listName, note }];
    });
  };

  const handleUpdateUser = (updatedUser: UserAccount) => {
    setUserAccount(updatedUser);
    showToast(language === 'fr' ? "Paramètres du compte mis à jour avec succès !" : "Account settings updated successfully!");
  };

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product: PRODUCTS[0],
      variant: PRODUCTS[0].variants[0],
      quantity: 1,
    },
  ]);

  // Modals and Drawers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCoinsOpen, setIsCoinsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isFacebookAdsOpen, setIsFacebookAdsOpen] = useState(false);
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  const [chatPreselectedProduct, setChatPreselectedProduct] = useState<Product | null>(null);

  const handleOpenChatWithProduct = (product: Product) => {
    setChatPreselectedProduct(product);
    setIsCommunityOpen(true);
  };

  const [comparedProductIds, setComparedProductIds] = useState<string[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  const handleToggleCompare = (product: Product) => {
    setComparedProductIds(prev => {
      if (prev.includes(product.id)) {
        return prev.filter(id => id !== product.id);
      }
      if (prev.length >= 3) {
        showToast("Vous pouvez comparer au maximum 3 produits simultanément.");
        return prev;
      }
      return [...prev, product.id];
    });
  };

  const comparedProductsList = useMemo(() => {
    return productsList.filter(p => comparedProductIds.includes(p.id));
  }, [comparedProductIds, productsList]);

  const [trackedOrderNumber, setTrackedOrderNumber] = useState<string | null>(null);

  const [checkoutDiscount, setCheckoutDiscount] = useState<{ amountEUR: number; code: string }>({
    amountEUR: 0,
    code: '',
  });

  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-9124',
      date: '10 mars 2026',
      trackingNumber: 'LP892348921FR',
      status: 'customs',
      customer: {
        fullName: 'Alexandre Laurent',
        email: 'alexandre.laurent@example.com',
        address: '14 Rue de la République',
        city: 'Paris',
        postalCode: '75001',
      },
      items: [
        {
          product: PRODUCTS[0],
          variant: PRODUCTS[0].variants[0],
          quantity: 1,
        },
      ],
      totalEUR: 49.99,
      currency: 'EUR',
      estimatedDelivery: '16 mars 2026',
    },
  ]);

  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const addToast = (notification: Omit<ToastNotification, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newToast: ToastNotification = { ...notification, id };
    setToasts((prev) => [...prev.slice(-3), newToast]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const showToast = (
    message: string,
    type: ToastType = 'info',
    options?: Partial<ToastNotification>
  ) => {
    addToast({
      type,
      title: options?.title || (language === 'fr' ? 'Notification' : 'Notice'),
      message,
      image: options?.image,
      badge: options?.badge,
      action: options?.action,
      durationMs: options?.durationMs || 3500,
    });
  };

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    let result = [...productsList];

    if (choiceOnly) {
      result = result.filter((p) => p.isChoice);
    }

    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (selectedPriceRange === 'under-20') {
      result = result.filter((p) => p.priceEUR < 20);
    } else if (selectedPriceRange === '20-50') {
      result = result.filter((p) => p.priceEUR >= 20 && p.priceEUR <= 50);
    } else if (selectedPriceRange === 'over-50') {
      result = result.filter((p) => p.priceEUR > 50);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.categoryLabel.toLowerCase().includes(q) ||
          p.seller.name.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'popular') {
      result.sort((a, b) => b.salesCount - a.salesCount);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'price-asc') {
      result.sort((a, b) => a.priceEUR - b.priceEUR);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.priceEUR - a.priceEUR);
    }

    return result;
  }, [productsList, selectedCategory, selectedPriceRange, searchQuery, sortBy, choiceOnly]);

  // Dedicated Department Windows / Rails
  const textileHomeProducts = useMemo(() => {
    return productsList.filter((p) => p.category === 'textile' || p.category === 'hardware');
  }, [productsList]);

  const fashionCaftanProducts = useMemo(() => {
    return productsList.filter((p) => p.category === 'mode');
  }, [productsList]);

  const techAudioProducts = useMemo(() => {
    return productsList.filter((p) => ['audio', 'watches', 'drones', 'keyboards'].includes(p.category));
  }, [productsList]);

  const lifestyleBeautyProducts = useMemo(() => {
    return productsList.filter((p) => ['home', 'gear', 'beauty'].includes(p.category));
  }, [productsList]);

  // Is user in full store overview or in a specific filtered mode
  const isGlobalStoreView =
    selectedCategory === 'all' &&
    !searchQuery.trim() &&
    selectedPriceRange === 'all' &&
    !choiceOnly;

  // Wishlist products
  const wishlistProducts = useMemo(() => {
    return productsList.filter((p) => wishlistIds.includes(p.id));
  }, [productsList, wishlistIds]);

  // Toggle wishlist
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) => {
      if (prev.includes(product.id)) {
        addToast({
          type: 'favorite_remove',
          title: language === 'fr' ? 'Retiré des favoris' : 'Removed from wishlist',
          message: product.name,
          image: product.image,
          durationMs: 3000,
        });
        return prev.filter((id) => id !== product.id);
      } else {
        addToast({
          type: 'favorite_add',
          title: language === 'fr' ? 'Ajouté aux favoris ! ❤️' : 'Added to wishlist! ❤️',
          message: product.name,
          image: product.image,
          action: {
            label: language === 'fr' ? 'Voir mes favoris' : 'View wishlist',
            onClick: () => setIsWishlistOpen(true),
          },
          durationMs: 4000,
        });
        // Ensure meta exists
        setWishlistMetas(metaPrev => {
          if (!metaPrev.some(m => m.productId === product.id)) {
            return [...metaPrev, { productId: product.id, listName: 'Favoris Principaux', note: '' }];
          }
          return metaPrev;
        });
        return [...prev, product.id];
      }
    });
  };

  // Add review to a product
  const handleAddReview = (productId: string, review: Review) => {
    setProductsList((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const updatedReviews = [review, ...p.reviews];
          const newAvgRating =
            updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
          return {
            ...p,
            reviews: updatedReviews,
            reviewsCount: p.reviewsCount + 1,
            rating: parseFloat(newAvgRating.toFixed(2)),
          };
        }
        return p;
      })
    );

    // Reward user with 50 coins for leaving a review!
    setUserAccount((prev) => ({
      ...prev,
      coinsBalance: prev.coinsBalance + 50,
    }));
    addToast({
      type: 'coins',
      title: language === 'fr' ? '+50 Pièces de récompense !' : '+50 Reward Coins!',
      message: language === 'fr' ? 'Votre avis vérifié a été publié avec succès.' : 'Your review was published.',
      badge: '+50 SO',
      durationMs: 3800,
    });
  };

  // Daily coins claim
  const handleClaimDailyCoins = (amount: number) => {
    setUserAccount((prev) => ({
      ...prev,
      coinsBalance: prev.coinsBalance + amount,
      streakDays: Math.min(7, prev.streakDays + 1),
    }));
    addToast({
      type: 'coins',
      title: language === 'fr' ? `+${amount} Pièces bonus !` : `+${amount} Bonus Coins!`,
      message: language === 'fr' ? 'Votre cagnotte fidélité a été créditée.' : 'Loyalty balance updated.',
      badge: `Série ${Math.min(7, userAccount.streakDays + 1)}j`,
      durationMs: 3500,
    });
  };

  // Redeem coins coupon
  const handleRedeemCoinsCoupon = (coinsCost: number, couponCode: string, discountEur: number) => {
    if (userAccount.coinsBalance >= coinsCost) {
      setUserAccount((prev) => ({
        ...prev,
        coinsBalance: prev.coinsBalance - coinsCost,
        availableCoupons: [
          ...prev.availableCoupons,
          {
            code: couponCode,
            label: `Bon fidélité de ${discountEur} €`,
            minSpendEUR: discountEur * 5,
            discountValue: `-${discountEur},00 €`,
          },
        ],
      }));
      addToast({
        type: 'coupon',
        title: language === 'fr' ? 'Bon de réduction débloqué !' : 'Discount coupon unlocked!',
        message: `Code ${couponCode} (${discountEur}€ de réduction)`,
        badge: `-${discountEur} €`,
        durationMs: 4000,
      });
    }
  };

  // Cart operations
  const handleAddToCart = (
    product: Product,
    variant?: ProductVariant,
    quantity: number = 1
  ) => {
    const chosenVariant = variant || product.variants[0];

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.variant.id === chosenVariant.id
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      } else {
        return [...prev, { product, variant: chosenVariant, quantity }];
      }
    });

    addToast({
      type: 'cart',
      title: language === 'fr' ? 'Ajouté au panier !' : 'Added to cart!',
      message: `${product.name} • ${chosenVariant.name}`,
      image: product.image,
      badge: `x${quantity}`,
      action: {
        label: language === 'fr' ? 'Voir mon panier' : 'View cart',
        onClick: () => setIsCartOpen(true),
      },
      durationMs: 4000,
    });
  };

  const handleUpdateQuantity = (productId: string, variantId: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId && item.variant.id === variantId) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (productId: string, variantId: string) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.variant.id === variantId))
    );
  };

  const handleProceedToCheckout = (discountEUR: number, couponCode: string) => {
    setCheckoutDiscount({ amountEUR: discountEUR, code: couponCode });
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleBuyNow = (product: Product, variant: ProductVariant, quantity: number) => {
    handleAddToCart(product, variant, quantity);
    setSelectedProduct(null);
    setCheckoutDiscount({ amountEUR: 0, code: '' });
    setIsCheckoutOpen(true);
  };

  const handleOrderCreated = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
    setCartItems([]);
    addToast({
      type: 'order',
      title: language === 'fr' ? 'Succès de commande ! 🎉' : 'Order placed! 🎉',
      message: `Commande #${order.id} enregistrée • Suivi : ${order.trackingNumber}`,
      badge: `${order.items.length} ${order.items.length > 1 ? 'articles' : 'article'}`,
      action: {
        label: language === 'fr' ? 'Suivre mon colis' : 'Track package',
        onClick: () => handleTrackSpecificOrder(order.trackingNumber),
      },
      durationMs: 7000,
    });
  };

  const handleTrackSpecificOrder = (trackingCode: string) => {
    setTrackedOrderNumber(trackingCode);
    setIsTrackerOpen(true);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // If at the Initial Point: Render the modern Portal with the two prominent buttons
  if (activeView === 'portal') {
    return (
      <MessagingProvider>
        <InitialPortal
          onSelectShop={() => {
            setActiveView('shop');
            window.scrollTo({ top: 0, behavior: 'instant' });
          }}
          onSelectMessenger={() => {
            setActiveView('shop');
            setIsCommunityOpen(true);
          }}
          language={language}
          onLanguageChange={setLanguage}
          currency={currency}
          onCurrencyChange={setCurrency}
          cartCount={totalCartCount}
          wishlistCount={wishlistIds.length}
        />
        {/* Dynamic Animated Toast Notifications */}
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </MessagingProvider>
    );
  }

  return (
    <MessagingProvider>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col text-zinc-900 dark:text-zinc-100 pb-16 md:pb-0 selection:bg-orange-500 selection:text-white relative transition-colors">
      
      {/* Visual Scroll Progress Indicator for Catalog Browsing */}
      <ScrollProgressBar />

      {/* Top Bar with 3-Zone Contract */}
      <Header
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenTracker={() => setIsTrackerOpen(true)}
        onOpenSupport={() => setIsSupportOpen(true)}
        onOpenCommunity={() => setIsCommunityOpen(true)}
        onNavigateSection={(sectionId) => {
          const targetId =
            sectionId === 'textile'
              ? 'session-textile'
              : sectionId === 'mode'
              ? 'session-mode'
              : 'catalog-section';
          const el = document.getElementById(targetId);
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenFlash={() => {
          const el = document.getElementById('flash-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenFacebookAds={() => setIsFacebookAdsOpen(true)}
        language={language}
        onLanguageChange={setLanguage}
        onBackToPortal={() => setActiveView('portal')}
      />

      {/* Sticky Workspace search, category sliding rail & price badges */}
      <UtilityBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategorySelect}
        currency={currency}
        onCurrencyChange={setCurrency}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        choiceOnly={choiceOnly}
        onToggleChoiceOnly={handleChoiceToggle}
        selectedPriceRange={selectedPriceRange}
        onPriceRangeChange={handlePriceRangeChange}
      />

      {/* Interactive Sessions & Windows Jump Bar */}
      <SessionsNav />

      <main className="flex-1">
        {/* Campaign Hero Banner */}
        <HeroBanner
          onExploreClick={() => {
            const el = document.getElementById('catalog-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenAbout={() => setIsAboutOpen(true)}
          language={language}
        />

        {/* Live SuperDeals Flash Banner with Sliding Rail */}
        <div id="flash-section">
          <FlashDealsBanner
            products={productsList}
            currency={currency}
            onSelectProduct={(p) => setSelectedProduct(p)}
            language={language}
          />
        </div>

        {/* Storefront Content: Dedicated Department Windows or Filtered View */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {isGlobalStoreView ? (
            /* ========================================================
               1. ALL SESSIONS / WINDOWS OF THE SHOP (RAYONS PAR RAYONS)
               ======================================================== */
            <div className="py-4 space-y-4">
              
              {/* Session Window 1: Maison, Linge de Lit, Rideaux & Quincaillerie */}
              <DepartmentWindowRail
                id="session-textile"
                title="Maison, Linge de Lit & Rideaux"
                subtitle="Serviettes de bain spa égyptiennes, parures en satin, rideaux occultants et barres industrielles"
                icon={BedDouble}
                badgeText="Rayon Maison & Déco"
                badgeColor="bg-amber-50 text-amber-800 border-amber-200"
                products={textileHomeProducts}
                currency={currency}
                wishlistIds={wishlistIds}
                comparedProductIds={comparedProductIds}
                onToggleWishlist={handleToggleWishlist}
                onToggleCompare={handleToggleCompare}
                onQuickView={(p) => setSelectedProduct(p)}
                onAddToCart={(p) => handleAddToCart(p)}
                onExploreDepartment={() => handleCategorySelect('textile')}
                isLoading={isLoading}
                language={language}
              />

              {/* Session Window 2: Mode, Caftans & Tradition */}
              <DepartmentWindowRail
                id="session-mode"
                title="Mode, Caftans & Haute Couture Traditionnelle"
                subtitle="Caftans en soie brodés à la main, ornements or et coupes nobles confectionnées sur mesure"
                icon={Shirt}
                badgeText="Rayon Artisanat & Mode"
                badgeColor="bg-rose-50 text-rose-800 border-rose-200"
                products={fashionCaftanProducts}
                currency={currency}
                wishlistIds={wishlistIds}
                comparedProductIds={comparedProductIds}
                onToggleWishlist={handleToggleWishlist}
                onToggleCompare={handleToggleCompare}
                onQuickView={(p) => setSelectedProduct(p)}
                onAddToCart={(p) => handleAddToCart(p)}
                onExploreDepartment={() => handleCategorySelect('mode')}
                isLoading={isLoading}
                language={language}
              />

              {/* Session Window 3: High-Tech, Audio & Wearables */}
              <DepartmentWindowRail
                id="session-tech"
                title="High-Tech, Audio & Appareils Connectés"
                subtitle="Casques à réduction de bruit 45dB, enceintes 360°, montres AMOLED titane, drones 4K et claviers mécaniques"
                icon={Headphones}
                badgeText="Rayon Direct Usine Tech"
                badgeColor="bg-blue-50 text-blue-800 border-blue-200"
                products={techAudioProducts}
                currency={currency}
                wishlistIds={wishlistIds}
                comparedProductIds={comparedProductIds}
                onToggleWishlist={handleToggleWishlist}
                onToggleCompare={handleToggleCompare}
                onQuickView={(p) => setSelectedProduct(p)}
                onAddToCart={(p) => handleAddToCart(p)}
                onExploreDepartment={() => handleCategorySelect('audio')}
                isLoading={isLoading}
                language={language}
              />

              {/* Session Window 4: Lifestyle, Barista & Soins */}
              <DepartmentWindowRail
                id="session-lifestyle"
                title="Lifestyle, Café Barista & Soins Botaniques"
                subtitle="Moulins de précision espresso, sacs à dos étanches antivol et rituels botaniques régénérants"
                icon={Coffee}
                badgeText="Rayon Lifestyle Choice"
                badgeColor="bg-emerald-50 text-emerald-800 border-emerald-200"
                products={lifestyleBeautyProducts}
                currency={currency}
                wishlistIds={wishlistIds}
                comparedProductIds={comparedProductIds}
                onToggleWishlist={handleToggleWishlist}
                onToggleCompare={handleToggleCompare}
                onQuickView={(p) => setSelectedProduct(p)}
                onAddToCart={(p) => handleAddToCart(p)}
                onExploreDepartment={() => handleCategorySelect('home')}
                isLoading={isLoading}
                language={language}
              />

            </div>
          ) : (
            /* ========================================================
               2. ACTIVE FILTERED VIEW BANNER
               ======================================================== */
            <div className="pt-8">
              <div className="bg-orange-50/80 dark:bg-orange-950/30 border border-orange-200/90 dark:border-orange-900/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <LayoutGrid className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-zinc-950 dark:text-white flex items-center gap-2">
                      <span>Vue filtrée du catalogue</span>
                      <span className="text-xs bg-orange-200 dark:bg-orange-900/70 text-orange-900 dark:text-orange-200 font-bold px-2 py-0.5 rounded-full">
                        {filteredProducts.length} articles trouvés
                      </span>
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                      {selectedCategory !== 'all' && `Catégorie: ${selectedCategory} · `}
                      {selectedPriceRange !== 'all' && `Prix: ${selectedPriceRange} · `}
                      {searchQuery && `Recherche: "${searchQuery}" · `}
                      {choiceOnly && `Choice Uniquement`}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs active:scale-95 shrink-0 self-start sm:self-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                  <span>Afficher toutes les sessions & rayons</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================
             3. COMPLETE CATALOG GRID SECTION
             ======================================================== */}
          <section id="catalog-section" className="py-10 border-t border-zinc-200/70 dark:border-zinc-800 scroll-mt-36">
            
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-orange-600 dark:text-orange-400 mb-1 tracking-wide uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Grand Catalogue Général Direct Usine</span>
                  <span aria-hidden="true" className="text-zinc-300 dark:text-zinc-700">·</span>
                  <span className="text-zinc-500 dark:text-zinc-400">Hub Logistique SoryOS</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
                  {isGlobalStoreView
                    ? 'Tous les articles de la boutique SoryOS'
                    : 'Articles correspondants à votre sélection'}
                </h2>
              </div>

              <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                <span className="font-mono tabular-nums font-bold text-zinc-800 dark:text-zinc-200">
                  {filteredProducts.length} articles disponibles
                </span>
                <span aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={() => setIsCoinsOpen(true)}
                  className="text-orange-600 dark:text-orange-400 hover:underline font-semibold cursor-pointer"
                >
                  Gagner des pièces
                </button>
              </div>
            </div>

            {/* Product Grid */}
            {isLoading ? (
              <ProductSkeleton count={8} />
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center text-zinc-500 dark:text-zinc-400 shadow-xs">
                <p className="text-base font-semibold text-zinc-800 dark:text-zinc-100 mb-1">
                  Aucun article ne correspond à votre filtre
                </p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-4">
                  Désactivez les filtres Choice ou modifiez vos mots-clés de recherche.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-2 text-xs font-semibold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg cursor-pointer transition-colors"
                >
                  Réinitialiser tous les filtres
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    currency={currency}
                    isWishlisted={wishlistIds.includes(product.id)}
                    isCompared={comparedProductIds.includes(product.id)}
                    onToggleWishlist={handleToggleWishlist}
                    onToggleCompare={handleToggleCompare}
                    onQuickView={(p) => setSelectedProduct(p)}
                    onAddToCart={(p) => handleAddToCart(p)}
                    isLoading={isLoading}
                    language={language}
                  />
                ))}
              </div>
            )}

            {/* Platform Trust & Sourcing Banner Box */}
            <div className="mt-16 bg-gradient-to-br from-zinc-900 to-zinc-950 text-white rounded-3xl p-6 sm:p-10 border border-zinc-800 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[11px] font-bold text-orange-400 uppercase tracking-wider mb-3">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Logistique & Chaîne d'Approvisionnement Directe</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-2.5">
                    L'infrastructure SoryOS : usines certifiées, douanes express et garanties.
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    Chaque commande passée sur SoryOS boutique en ligne est consolidée dans nos hubs logistiques automatisés, inspectée unitairement et confiée aux liaisons fret aérien directes pour garantir une réception sans tracas en 5 à 8 jours.
                  </p>

                  {/* 3 Metrics Pills */}
                  <div className="grid grid-cols-3 gap-3 pt-6 mt-6 border-t border-zinc-800/80">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                      <span className="text-base sm:text-lg font-black font-mono text-orange-400 block tabular-nums">99.4%</span>
                      <span className="text-[10px] text-zinc-400 block">Livrées dans les délais</span>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                      <span className="text-base sm:text-lg font-black font-mono text-white block tabular-nums">90 Jours</span>
                      <span className="text-[10px] text-zinc-400 block">Protection acheteur</span>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                      <span className="text-base sm:text-lg font-black font-mono text-emerald-400 block tabular-nums">0 € Frais</span>
                      <span className="text-[10px] text-zinc-400 block">Dès 20 € d'achat Choice</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsSupportOpen(true)}
                    className="px-5 py-3 text-xs font-bold text-zinc-900 bg-white hover:bg-zinc-100 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm active:scale-98"
                  >
                    <MessageSquareText className="w-4 h-4 text-orange-600" />
                    <span>Contacter l'Assistance 24/7</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsTrackerOpen(true)}
                    className="px-5 py-3 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-orange-600/20 active:scale-98"
                  >
                    <Truck className="w-4 h-4" />
                    <span>Suivre un Colis en Transit</span>
                  </button>
                </div>
              </div>
            </div>

          </section>

        </div>
      </main>

      {/* Global Desktop Footer */}
      <Footer
        onOpenTracker={() => setIsTrackerOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      {/* Native Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        activeSection="home"
        onNavigateHome={() => setActiveView('portal')}
        onOpenFlash={() => {
          const el = document.getElementById('flash-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        onOpenMessenger={() => setIsCommunityOpen(true)}
      />

      {/* Product Detail Modal PDP */}
      <ProductModal
        product={selectedProduct}
        currency={currency}
        isWishlisted={selectedProduct ? wishlistIds.includes(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onAddReview={handleAddReview}
        onOpenChatWithProduct={handleOpenChatWithProduct}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        currency={currency}
        user={userAccount}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={handleProceedToCheckout}
        language={language}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistProducts={wishlistProducts}
        wishlistMetas={wishlistMetas}
        onUpdateWishlistMeta={handleUpdateWishlistMeta}
        currency={currency}
        onRemoveFromWishlist={(id) => handleToggleWishlist({ id } as Product)}
        onAddToCart={handleAddToCart}
        onShowToast={showToast}
        language={language}
      />

      {/* Coins & Daily Rewards Drawer */}
      <CoinsDrawer
        isOpen={isCoinsOpen}
        onClose={() => setIsCoinsOpen(false)}
        user={userAccount}
        onClaimDailyCoins={handleClaimDailyCoins}
        onRedeemCoinsCoupon={handleRedeemCoinsCoupon}
      />

      {/* Account Profile Modal */}
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        user={userAccount}
        orders={orders}
        currency={currency}
        onTrackOrder={handleTrackSpecificOrder}
        onOpenCoins={() => setIsCoinsOpen(true)}
        onUpdateUser={handleUpdateUser}
        language={language}
      />

      {/* 24/7 Customer Live Support Assistant */}
      <SupportChatModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
        products={productsList}
        currency={currency}
        onAddToCart={handleAddToCart}
        onSelectProduct={(p) => setSelectedProduct(p)}
        selectedCategory={selectedCategory}
        cartCount={totalCartCount}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        currency={currency}
        discountEUR={checkoutDiscount.amountEUR}
        discountCode={checkoutDiscount.code}
        onOrderCreated={handleOrderCreated}
      />

      {/* Package Tracker Modal */}
      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => {
          setIsTrackerOpen(false);
          setTrackedOrderNumber(null);
        }}
        recentOrders={orders}
      />

      {/* About Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      {/* Facebook Ads Studio Modal */}
      <FacebookAdsModal
        isOpen={isFacebookAdsOpen}
        onClose={() => setIsFacebookAdsOpen(false)}
        products={productsList}
        showToast={showToast}
      />

      {/* Community Club Chat & Exchange Modal */}
      <AnimatePresence>
        {isCommunityOpen && (
          <CommunityChatModal
            isOpen={isCommunityOpen}
            onClose={() => setIsCommunityOpen(false)}
            user={userAccount}
            products={productsList}
            currency={currency}
            onAddToCart={handleAddToCart}
            language={language}
            onLanguageChange={setLanguage}
            initialProduct={chatPreselectedProduct}
          />
        )}
      </AnimatePresence>

      {/* Dynamic Animated Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Product Comparison Modal */}
      <ProductComparisonModal
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        comparedProducts={comparedProductsList}
        currency={currency}
        onRemoveProduct={(id) => setComparedProductIds(prev => prev.filter(i => i !== id))}
        onAddToCart={handleAddToCart}
        onClearAll={() => setComparedProductIds([])}
        language={language}
      />

      {/* Floating Comparison Bar */}
      {comparedProductIds.length > 0 && (
        <div className="fixed bottom-16 md:bottom-6 left-1/2 -translate-x-1/2 z-40 bg-zinc-950/95 text-white backdrop-blur-md px-4 py-3 rounded-2xl shadow-2xl border border-zinc-800 flex items-center gap-3 sm:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-lg w-[95%]">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold text-xs">
              {comparedProductIds.length}/3
            </div>
            <div className="hidden sm:block">
              <span className="text-xs font-bold block">Comparateur</span>
              <span className="text-[10px] text-zinc-400">Produits sélectionnés</span>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {comparedProductsList.map((p) => (
              <div key={p.id} className="relative w-10 h-10 rounded-lg overflow-hidden bg-zinc-800 shrink-0 border border-zinc-700">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                <button
                  onClick={() => handleToggleCompare(p)}
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] shadow cursor-pointer"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-auto">
            <button
              onClick={() => setIsComparisonOpen(true)}
              className="px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Comparer ({comparedProductIds.length})</span>
            </button>
            <button
              onClick={() => setComparedProductIds([])}
              className="text-[11px] text-zinc-400 hover:text-white underline cursor-pointer px-1"
            >
              Effacer
            </button>
          </div>
        </div>
      )}

      {/* Floating 24/7 Live Support Button (Bottom Left Desktop) */}
      <button
        type="button"
        onClick={() => setIsSupportOpen(true)}
        className="hidden md:flex fixed bottom-5 left-5 z-40 items-center gap-2 px-3.5 py-2.5 bg-zinc-950 text-white rounded-full shadow-lg border border-zinc-800 text-xs font-semibold hover:bg-orange-600 transition-colors cursor-pointer"
      >
        <MessageSquareText className="w-4 h-4 text-orange-400" />
        <span>Assistance 24/7</span>
      </button>

      {/* Floating Messenger / WhatsApp Action Bubble (Visible on mobile & desktop) */}
      <button
        type="button"
        onClick={() => setIsCommunityOpen(true)}
        className="fixed bottom-20 right-4 md:bottom-5 md:right-5 z-40 flex items-center gap-2 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-2xl shadow-emerald-950/40 text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer border border-emerald-400/50"
        title="Messenger / WhatsApp SoryOS"
      >
        <div className="relative">
          <MessageCircle className="w-5 h-5 text-white" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-emerald-600 animate-ping"></span>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-emerald-600"></span>
        </div>
        <span className="font-bold text-xs tracking-tight">Messenger</span>
      </button>

    </div>
    </MessagingProvider>
  );
}

