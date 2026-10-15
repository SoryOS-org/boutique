import React, { useState } from 'react';
import { X, Coins, Check, Gift, Sparkles, ArrowRight } from 'lucide-react';
import { UserAccount } from '../types';

interface CoinsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount;
  onClaimDailyCoins: (amount: number) => void;
  onRedeemCoinsCoupon: (coinsCost: number, couponCode: string, discountEur: number) => void;
}

export const CoinsDrawer: React.FC<CoinsDrawerProps> = ({
  isOpen,
  onClose,
  user,
  onClaimDailyCoins,
  onRedeemCoinsCoupon,
}) => {
  const [hasClaimedToday, setHasClaimedToday] = useState(false);
  const streakDays = [
    { day: 1, coins: 20 },
    { day: 2, coins: 30 },
    { day: 3, coins: 40 },
    { day: 4, coins: 50 },
    { day: 5, coins: 70 },
    { day: 6, coins: 100 },
    { day: 7, coins: 200 },
  ];

  const handleClaim = () => {
    if (!hasClaimedToday) {
      onClaimDailyCoins(70);
      setHasClaimedToday(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200 border-l border-transparent dark:border-zinc-800 transition-colors">
        
        {/* Header */}
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-amber-500/10 dark:bg-amber-500/15">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500 text-white rounded-xl shadow-xs">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-950 dark:text-zinc-100">Pièces & Récompenses</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Gagnez des pièces et économisez sur vos achats</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer le volet des pièces"
            className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-subtle">
          
          {/* Balance card */}
          <div className="p-5 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl text-white shadow-md relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-xs uppercase tracking-wider text-amber-100 font-semibold">
                Votre Solde de Pièces SoryOS
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold font-mono tabular-nums">
                  {user.coinsBalance.toLocaleString('fr-FR')}
                </span>
                <span className="text-xs text-amber-100 font-medium">
                  ≈ {(user.coinsBalance * 0.01).toFixed(2)} € d'économies
                </span>
              </div>
              <p className="text-[11px] text-amber-100/90 mt-2">
                Utilisables automatiquement au paiement pour réduire votre facture.
              </p>
            </div>
            <Sparkles className="absolute -bottom-2 -right-2 w-24 h-24 text-white/10" />
          </div>

          {/* Daily Check-in Streak */}
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 bg-zinc-50/50 dark:bg-zinc-800/40">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
                  Bonus Quotidien de Connexion
                </h3>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Série active : Jour {user.streakDays}/7</p>
              </div>
              <button
                onClick={handleClaim}
                disabled={hasClaimedToday}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer shadow-xs ${
                  hasClaimedToday
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-amber-500 hover:bg-amber-600 text-white'
                }`}
              >
                {hasClaimedToday ? 'Récupéré aujourd’hui' : '+70 Pièces'}
              </button>
            </div>

            {/* Streak pills */}
            <div className="grid grid-cols-7 gap-1.5 pt-1">
              {streakDays.map((s) => {
                const isPassed = s.day < user.streakDays;
                const isCurrent = s.day === user.streakDays;
                return (
                  <div
                    key={s.day}
                    className={`p-2 rounded-xl text-center border transition-all ${
                      isPassed || (isCurrent && hasClaimedToday)
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                        : isCurrent
                        ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 ring-1 ring-amber-400'
                        : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500'
                    }`}
                  >
                    <span className="block text-[10px] font-semibold">J{s.day}</span>
                    <span className="block text-xs font-bold font-mono mt-0.5">+{s.coins}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Redeem for vouchers */}
          <div>
            <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-orange-600 dark:text-orange-500" />
              <span>Convertir vos pièces en Coupons Immédiats</span>
            </h3>

            <div className="space-y-2.5">
              <div className="p-3.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-800/80 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block">Bon de réduction 5,00 €</span>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Dès 25 € d'achat · Valable sur toute la boutique</span>
                </div>
                <button
                  onClick={() => onRedeemCoinsCoupon(500, 'COIN5', 5)}
                  disabled={user.coinsBalance < 500}
                  className="px-3 py-1.5 text-xs font-semibold bg-zinc-900 dark:bg-orange-600 hover:bg-zinc-800 dark:hover:bg-orange-500 disabled:opacity-40 text-white rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  500 Pièces
                </button>
              </div>

              <div className="p-3.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-800/80 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block">Bon de réduction 10,00 €</span>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Dès 50 € d'achat · Spécial Choice & High-Tech</span>
                </div>
                <button
                  onClick={() => onRedeemCoinsCoupon(1000, 'COIN10', 10)}
                  disabled={user.coinsBalance < 1000}
                  className="px-3 py-1.5 text-xs font-semibold bg-zinc-900 dark:bg-orange-600 hover:bg-zinc-800 dark:hover:bg-orange-500 disabled:opacity-40 text-white rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  1 000 Pièces
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 transition-colors">
          <span>Règles du programme de fidélité</span>
          <button
            onClick={onClose}
            className="text-orange-600 dark:text-orange-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Faire mes achats</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
