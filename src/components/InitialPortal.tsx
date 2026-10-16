import React from 'react';
import { motion } from 'motion/react';
import { 
  ShoppingBag, 
  MessageCircle, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Truck, 
  Headphones, 
  ArrowRight, 
  Globe, 
  Sun, 
  Moon, 
  Users, 
  Mic, 
  Phone
} from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { CurrencyCode } from '../types';

interface InitialPortalProps {
  onSelectShop: () => void;
  onSelectMessenger: () => void;
  language: 'fr' | 'en';
  onLanguageChange: (lang: 'fr' | 'en') => void;
  currency: CurrencyCode;
  onCurrencyChange: (curr: CurrencyCode) => void;
  cartCount: number;
  wishlistCount: number;
}

export const InitialPortal: React.FC<InitialPortalProps> = ({
  onSelectShop,
  onSelectMessenger,
  language,
  onLanguageChange,
  currency,
  onCurrencyChange,
  cartCount,
  wishlistCount,
}) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-radial-[at_50%_0%] from-orange-500/10 via-zinc-50 to-zinc-100 dark:from-orange-950/20 dark:via-zinc-950 dark:to-black text-zinc-900 dark:text-zinc-100 flex flex-col justify-between transition-colors relative overflow-hidden">
      
      {/* Background Ambient Decorative Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 dark:bg-orange-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header Bar */}
      <header className="relative z-10 border-b border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-md bg-white/70 dark:bg-zinc-950/70 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo SoryOS */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-orange-500/25">
              S
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight flex items-center gap-0.5">
                <span>Sory</span>
                <span className="text-orange-600 dark:text-orange-500">OS</span>
              </span>
              <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
                Portail Officiel SoryOS
              </span>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Currency selector */}
            <select
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
              className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-bold rounded-xl px-2.5 py-1.5 focus:outline-hidden cursor-pointer"
              aria-label="Sélectionner la devise"
            >
              <option value="EUR">EUR (€)</option>
              <option value="USD">USD ($)</option>
              <option value="XOF">XOF (CFA)</option>
              <option value="CAD">CAD ($)</option>
            </select>

            {/* Language button */}
            <button
              onClick={() => onLanguageChange(language === 'fr' ? 'en' : 'fr')}
              className="px-2.5 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-xs font-bold flex items-center gap-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Changer de langue"
            >
              <Globe className="w-3.5 h-3.5 text-zinc-500" />
              <span>{language.toUpperCase()}</span>
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              aria-label="Basculer le thème"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-700" />}
            </button>
          </div>

        </div>
      </header>

      {/* Main Content: Hero & Dual Buttons */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-14 flex-1 flex flex-col justify-center">
        
        {/* Pitch & Badge */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 dark:bg-orange-500/15 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold mb-4 shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>Plateforme Unifiée E-Commerce & Messagerie Live</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 leading-tight"
          >
            {language === 'fr' ? 'Choisissez votre espace' : 'Choose your experience'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed"
          >
            {language === 'fr' 
              ? 'Accédez au catalogue d’offres directes usine de la Boutique ou échangez en temps réel avec vendeurs et membres sur le Messenger.'
              : 'Browse direct-factory catalog deals in the Store or chat in real time with sellers and community members on Messenger.'}
          </motion.p>
        </div>

        {/* The Two Main Action Buttons / Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
          
          {/* 1. BOUTON DE LA BOUTIQUE */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            whileHover={{ y: -4 }}
            onClick={onSelectShop}
            className="relative overflow-hidden rounded-3xl bg-white/90 dark:bg-zinc-900/90 border-2 border-orange-200 dark:border-orange-900/50 hover:border-orange-500 dark:hover:border-orange-500/80 shadow-xl shadow-orange-500/5 dark:shadow-black/40 p-6 sm:p-8 flex flex-col justify-between cursor-pointer group transition-all"
          >
            {/* Top Glow Accent */}
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-gradient-to-bl from-orange-500/20 to-transparent rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

            <div>
              {/* Card Header & Icon */}
              <div className="flex items-center justify-between mb-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-105 group-hover:rotate-1 transition-transform">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800 text-[11px] font-extrabold uppercase tracking-wide">
                  <span>{language === 'fr' ? 'Boutique Choice' : 'Choice Store'}</span>
                </div>
              </div>

              {/* Title & Description */}
              <h2 className="text-2xl font-black text-zinc-950 dark:text-zinc-50 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                {language === 'fr' ? 'Boutique SoryOS' : 'SoryOS Store'}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {language === 'fr'
                  ? 'Explorez le catalogue complet, les SuperDeals Flash, ajoutez vos articles au panier et profitez des remises usine avec suivi colis.'
                  : 'Browse the full catalog, Flash SuperDeals, manage your cart, and enjoy factory discounts with order tracking.'}
              </p>

              {/* Key Features List */}
              <div className="mt-6 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  <Zap className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>{language === 'fr' ? 'SuperDeals Flash & Offres exclusives' : 'Flash SuperDeals & Exclusive discounts'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  <Truck className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>{language === 'fr' ? 'Livraison rapide avec suivi d’expédition' : 'Fast shipping with package tracker'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  <ShieldCheck className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>{language === 'fr' ? 'Garantie SoryOS & retours sous 15 jours' : 'SoryOS Guarantee & 15-day returns'}</span>
                </div>
              </div>
            </div>

            {/* Big Action Button */}
            <div className="mt-8 pt-5 border-t border-zinc-100 dark:border-zinc-800/80">
              <button
                type="button"
                onClick={onSelectShop}
                className="w-full h-13 rounded-2xl bg-orange-600 hover:bg-orange-500 active:scale-98 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-orange-600/25 transition-all cursor-pointer group-hover:bg-orange-500"
              >
                <span>{language === 'fr' ? 'Accéder à la Boutique' : 'Enter the Store'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              {(cartCount > 0 || wishlistCount > 0) && (
                <div className="mt-2.5 flex items-center justify-center gap-3 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                  {cartCount > 0 && <span>🛍️ {cartCount} dans le panier</span>}
                  {wishlistCount > 0 && <span>❤️ {wishlistCount} favoris</span>}
                </div>
              )}
            </div>
          </motion.div>

          {/* 2. BOUTON DE MESSENGER */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -4 }}
            onClick={onSelectMessenger}
            className="relative overflow-hidden rounded-3xl bg-white/90 dark:bg-zinc-900/90 border-2 border-emerald-200 dark:border-emerald-900/50 hover:border-emerald-500 dark:hover:border-emerald-500/80 shadow-xl shadow-emerald-500/5 dark:shadow-black/40 p-6 sm:p-8 flex flex-col justify-between cursor-pointer group transition-all"
          >
            {/* Top Glow Accent */}
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-gradient-to-bl from-emerald-500/20 to-transparent rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

            <div>
              {/* Card Header & Icon */}
              <div className="flex items-center justify-between mb-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-105 group-hover:rotate-1 transition-transform">
                  <MessageCircle className="w-7 h-7" />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-extrabold uppercase tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{language === 'fr' ? 'WhatsApp Live' : 'WhatsApp Live'}</span>
                </div>
              </div>

              {/* Title & Description */}
              <h2 className="text-2xl font-black text-zinc-950 dark:text-zinc-50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {language === 'fr' ? 'Messenger SoryOS' : 'SoryOS Messenger'}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {language === 'fr'
                  ? 'Échangez instantanément avec les vendeurs officiels, discutez au sein du Club Communautaire, partagez des produits et envoyez des notes vocales.'
                  : 'Chat in real-time with official sellers, join the Community Club, share product cards, and send voice notes.'}
              </p>

              {/* Key Features List */}
              <div className="mt-6 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  <Users className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{language === 'fr' ? 'Club Communautaire & discussions directes' : 'Community Club & direct seller chats'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  <Mic className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{language === 'fr' ? 'Enregistrement de notes vocales en direct' : 'Voice notes recording and preview'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{language === 'fr' ? 'Synchronisation Firebase Firestore en direct' : 'Real-time Firebase Firestore synchronization'}</span>
                </div>
              </div>
            </div>

            {/* Big Action Button */}
            <div className="mt-8 pt-5 border-t border-zinc-100 dark:border-zinc-800/80">
              <button
                type="button"
                onClick={onSelectMessenger}
                className="w-full h-13 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer group-hover:bg-emerald-500"
              >
                <span>{language === 'fr' ? 'Ouvrir le Messenger' : 'Open Messenger'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="mt-2.5 text-center text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                🟢 Connecté à la base Cloud Firebase
              </div>
            </div>
          </motion.div>

        </div>

      </main>

      {/* Bottom Reassurance Footer */}
      <footer className="relative z-10 border-t border-zinc-200/80 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm py-4 px-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 font-medium">
            <Phone className="w-3.5 h-3.5 text-orange-600 animate-pulse" />
            <span>Support client 24/7 au <strong>621 09 03 88</strong></span>
          </div>
          <div className="text-[11px]">
            © {new Date().getFullYear()} SoryOS • Marketplace Choice & Messagerie Unifiée
          </div>
        </div>
      </footer>

    </div>
  );
};
