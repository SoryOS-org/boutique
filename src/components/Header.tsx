import React from 'react';
import { Sun, Moon, Phone, Megaphone, Globe, Users, MessageCircle } from 'lucide-react';
import { useTheme } from '../ThemeContext';

export interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenTracker: () => void;
  onOpenSupport: () => void;
  onOpenCommunity: () => void;
  onNavigateSection: (sectionId: string) => void;
  onOpenFlash: () => void;
  onOpenFacebookAds: () => void;
  language: 'fr' | 'en';
  onLanguageChange: (lang: 'fr' | 'en') => void;
  onBackToPortal?: () => void;
}

const translations = {
  fr: {
    announcement: "Assistance Téléphonique & WhatsApp Officielle :",
    onlineStore: "Boutique en ligne",
    portal: "Accueil Hub",
    superDeals: "SuperDeals Flash",
    choiceSelection: "Sélection Choice",
    community: "Club Communauté",
    messenger: "Messenger",
    orderTracking: "Suivi de Colis",
    support247: "Assistance 24/7",
    facebookAds: "Pubs Facebook",
    cart: "Panier",
    viewWishlist: "Voir les favoris",
    lightMode: "Mode clair",
    darkMode: "Mode sombre",
    switchLangTitle: "Switch to English",
  },
  en: {
    announcement: "Official Telephone & WhatsApp Support:",
    onlineStore: "Online Store",
    portal: "Home Hub",
    superDeals: "Flash SuperDeals",
    choiceSelection: "Choice Selection",
    community: "Community Club",
    messenger: "Messenger",
    orderTracking: "Order Tracking",
    support247: "24/7 Support",
    facebookAds: "Facebook Ads",
    cart: "Cart",
    viewWishlist: "View Wishlist",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    switchLangTitle: "Passer en Français",
  }
};

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenTracker,
  onOpenSupport,
  onOpenCommunity,
  onNavigateSection,
  onOpenFlash,
  onOpenFacebookAds,
  language,
  onLanguageChange,
  onBackToPortal,
}) => {
  const { isDark, toggleTheme } = useTheme();
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      
      {/* Top Announcement Bar with Official Phone Number */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 text-white text-[11px] font-medium py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-2 shadow-xs">
        <Phone className="w-3.5 h-3.5 animate-pulse" />
        <span>{t.announcement} <strong className="font-mono tracking-wider underline underline-offset-2">621 09 03 88</strong> (24/7)</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-8">
        
        {/* Zone 1: Brand wordmark & logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (onBackToPortal) {
              onBackToPortal();
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="tracking-tight text-zinc-950 dark:text-zinc-100 whitespace-nowrap shrink-0 flex items-center gap-2 group cursor-pointer"
          title="Retourner au portail d'accueil SoryOS"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center font-black text-base sm:text-lg shadow-sm shadow-orange-500/20 group-hover:scale-105 transition-transform">
            S
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-lg sm:text-xl font-black text-zinc-950 dark:text-zinc-100 tracking-tight flex items-center gap-0.5">
              <span>Sory</span>
              <span className="text-orange-600 dark:text-orange-500">OS</span>
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              {t.onlineStore}
            </span>
          </div>
        </a>

        {/* Zone 2: Navigation links (Desktop) */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-300">
          {onBackToPortal && (
            <button
              onClick={onBackToPortal}
              className="text-xs font-bold px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer border border-zinc-200 dark:border-zinc-700"
              title="Retourner à l'écran d'accueil avec les 2 boutons"
            >
              {t.portal}
            </button>
          )}
          <button
            onClick={onOpenFlash}
            className="hover:text-red-500 transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-4 cursor-pointer font-semibold text-red-600 dark:text-red-400"
          >
            {t.superDeals}
          </button>
          <button
            onClick={() => onNavigateSection('catalog')}
            className="hover:text-zinc-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-4 cursor-pointer"
          >
            {t.choiceSelection}
          </button>
          <button
            onClick={onOpenCommunity}
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-4 cursor-pointer font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{t.messenger}</span>
          </button>
          <button
            onClick={onOpenTracker}
            className="hover:text-zinc-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-4 cursor-pointer"
          >
            {t.orderTracking}
          </button>
          <button
            onClick={onOpenSupport}
            className="hover:text-zinc-950 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 hover:underline underline-offset-4 cursor-pointer"
          >
            {t.support247}
          </button>
        </nav>

        {/* Zone 3: Primary action & quick controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          
          {/* Messenger WhatsApp Button (Prominent & Visible on all screens) */}
          <button
            onClick={onOpenCommunity}
            title="Messenger / WhatsApp"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow cursor-pointer shrink-0"
          >
            <div className="relative">
              <MessageCircle className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 ring-1 ring-white"></span>
            </div>
            <span className="font-bold text-xs tracking-tight">{t.messenger}</span>
          </button>

          {/* Language Switcher Selector */}
          <button
            onClick={() => onLanguageChange(language === 'fr' ? 'en' : 'fr')}
            title={t.switchLangTitle}
            aria-label="Changer de langue"
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all border border-zinc-200 dark:border-zinc-800 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
            <span className="uppercase font-mono text-[11px]">{language}</span>
          </button>

          {/* Dark / Light Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label={isDark ? t.lightMode : t.darkMode}
            title={isDark ? t.lightMode : t.darkMode}
            className="relative p-2 text-zinc-700 dark:text-zinc-300 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 rounded-xl transition-all duration-200 cursor-pointer border border-zinc-200/80 dark:border-zinc-800"
          >
            {isDark ? (
              <Sun className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-400 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-zinc-700 transition-transform hover:-rotate-12" />
            )}
          </button>

          {/* Facebook Ads Button (Desktop XL) */}
          <button
            onClick={onOpenFacebookAds}
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-700 dark:text-blue-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer border border-blue-600/20"
          >
            <Megaphone className="w-4 h-4 text-blue-600" />
            <span>{t.facebookAds}</span>
          </button>
        </div>

      </div>
    </header>
  );
};
