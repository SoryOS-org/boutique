import React from 'react';
import { Home, Flame, Heart, ShoppingBag, User } from 'lucide-react';

interface MobileBottomNavProps {
  cartCount: number;
  wishlistCount: number;
  activeSection: string;
  onNavigateHome: () => void;
  onOpenFlash: () => void;
  onOpenWishlist: () => void;
  onOpenCart: () => void;
  onOpenAccount: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  cartCount,
  wishlistCount,
  onNavigateHome,
  onOpenFlash,
  onOpenWishlist,
  onOpenCart,
  onOpenAccount,
}) => {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 md:hidden px-2 py-1.5 flex items-center justify-around shadow-lg transition-colors">
      <button
        onClick={onNavigateHome}
        className="flex flex-col items-center justify-center p-1.5 text-zinc-600 dark:text-zinc-400 hover:text-orange-600 dark:hover:text-orange-400 cursor-pointer"
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-0.5">Accueil</span>
      </button>

      <button
        onClick={onOpenFlash}
        className="flex flex-col items-center justify-center p-1.5 text-zinc-600 dark:text-zinc-400 hover:text-orange-600 dark:hover:text-orange-400 cursor-pointer"
      >
        <Flame className="w-5 h-5 text-red-500 dark:text-red-400" />
        <span className="text-[10px] font-medium mt-0.5">SuperDeals</span>
      </button>

      <button
        onClick={onOpenWishlist}
        className="flex flex-col items-center justify-center p-1.5 text-zinc-600 dark:text-zinc-400 hover:text-orange-600 dark:hover:text-orange-400 cursor-pointer relative"
      >
        <Heart className="w-5 h-5" />
        {wishlistCount > 0 && (
          <span className="absolute top-1 right-2 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-mono font-bold flex items-center justify-center">
            {wishlistCount}
          </span>
        )}
        <span className="text-[10px] font-medium mt-0.5">Favoris</span>
      </button>

      <button
        onClick={onOpenCart}
        className="flex flex-col items-center justify-center p-1.5 text-zinc-600 dark:text-zinc-400 hover:text-orange-600 dark:hover:text-orange-400 cursor-pointer relative"
      >
        <ShoppingBag className="w-5 h-5" />
        {cartCount > 0 && (
          <span className="absolute top-1 right-2 w-4 h-4 bg-orange-600 text-white rounded-full text-[9px] font-mono font-bold flex items-center justify-center">
            {cartCount}
          </span>
        )}
        <span className="text-[10px] font-medium mt-0.5">Panier</span>
      </button>

      <button
        onClick={onOpenAccount}
        className="flex flex-col items-center justify-center p-1.5 text-zinc-600 dark:text-zinc-400 hover:text-orange-600 dark:hover:text-orange-400 cursor-pointer"
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] font-medium mt-0.5">Compte</span>
      </button>
    </nav>
  );
};
