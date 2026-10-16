import React from 'react';
import { ShoppingBag, MessageCircle, Globe, Sun, Moon } from 'lucide-react';
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
}) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col justify-between transition-colors relative selection:bg-orange-500 selection:text-white">
      
      {/* Top Bar */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md px-4 sm:px-8 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center font-black text-lg shadow-sm shadow-orange-500/20">
              S
            </div>
            <span className="text-lg font-black tracking-tight">
              Sory<span className="text-orange-600 dark:text-orange-500">OS</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
              className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold rounded-xl px-2.5 py-1.5 focus:outline-hidden cursor-pointer"
              aria-label="Devise"
            >
              <option value="EUR">EUR (€)</option>
              <option value="USD">USD ($)</option>
              <option value="XOF">XOF (CFA)</option>
              <option value="CAD">CAD ($)</option>
            </select>

            <button
              onClick={() => onLanguageChange(language === 'fr' ? 'en' : 'fr')}
              className="px-2.5 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
              title="Changer de langue"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language.toUpperCase()}</span>
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 cursor-pointer"
              aria-label="Thème"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-700" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Center Area: Logo + Two Normal Horizontal Buttons */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center max-w-md mx-auto w-full">
        
        {/* Brand Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white flex items-center justify-center font-black text-3xl sm:text-4xl shadow-xl shadow-orange-500/25 mb-6">
          S
        </div>

        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
          Bienvenue sur SoryOS
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
          {language === 'fr' 
            ? 'Choisissez votre espace pour continuer :' 
            : 'Choose your space to continue:'}
        </p>

        {/* 🚥 LES DEUX BOUTONS NORMAUX ALIGNÉS HORIZONTALEMENT */}
        <div className="mt-8 flex flex-row items-center justify-center gap-3 sm:gap-4 w-full">
          
          {/* Bouton 1 : Boutique */}
          <button
            type="button"
            onClick={onSelectShop}
            className="flex-1 min-w-0 h-13 sm:h-14 px-3 sm:px-6 rounded-2xl bg-orange-600 hover:bg-orange-500 active:scale-98 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-orange-600/25 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5 shrink-0" />
            <span className="truncate">Boutique</span>
          </button>

          {/* Bouton 2 : Messenger */}
          <button
            type="button"
            onClick={onSelectMessenger}
            className="flex-1 min-w-0 h-13 sm:h-14 px-3 sm:px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 shrink-0" />
            <span className="truncate">Messenger</span>
          </button>

        </div>

        {/* Quick status */}
        <div className="mt-8 flex items-center justify-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Firebase Live</span>
          </span>
          <span>•</span>
          <span>Assistance 24/7 : <strong>621 09 03 88</strong></span>
        </div>

      </main>

      {/* Clean Footer */}
      <footer className="py-4 border-t border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-400">
        © {new Date().getFullYear()} SoryOS • Boutique & Messenger
      </footer>

    </div>
  );
};
