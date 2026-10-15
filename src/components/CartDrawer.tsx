import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShieldCheck, Tag, Check, Coins } from 'lucide-react';
import { CartItem, CurrencyCode, UserAccount } from '../types';
import { formatPrice } from '../data/products';
import { getTranslation, Language } from '../i18n/translations';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: CurrencyCode;
  user: UserAccount;
  onUpdateQuantity: (productId: string, variantId: string, quantity: number) => void;
  onRemoveItem: (productId: string, variantId: string) => void;
  onProceedToCheckout: (discountAmountEUR: number, discountCode: string) => void;
  language: Language;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  user,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  language,
}) => {
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; percent: number; fixed: number } | null>(null);
  const [promoError, setPromoError] = useState('');
  const [useCoinsDiscount, setUseCoinsDiscount] = useState(false);

  const subtotalEUR = items.reduce(
    (sum, item) => sum + item.product.priceEUR * item.quantity,
    0
  );

  const freeShippingThresholdEUR = 20;
  const progressToFreeShipping = Math.min(100, (subtotalEUR / freeShippingThresholdEUR) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThresholdEUR - subtotalEUR);

  let discountEUR = 0;
  if (appliedPromo) {
    if (appliedPromo.percent > 0) {
      discountEUR += (subtotalEUR * appliedPromo.percent) / 100;
    } else if (appliedPromo.fixed > 0) {
      discountEUR += Math.min(subtotalEUR, appliedPromo.fixed);
    }
  }

  const coinsDiscountEUR = useCoinsDiscount ? Math.min(5, user.coinsBalance * 0.01) : 0;
  const totalDiscountEUR = discountEUR + coinsDiscountEUR;

  const totalEUR = Math.max(0, subtotalEUR - totalDiscountEUR);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCodeInput.trim().toUpperCase();

    if (code === 'ALY10') {
      setAppliedPromo({ code: 'ALY10', percent: 10, fixed: 0 });
    } else if (code === 'BIENVENUE5') {
      setAppliedPromo({ code: 'BIENVENUE5', percent: 0, fixed: 5 });
    } else if (code === 'CHOICEDAY') {
      setAppliedPromo({ code: 'CHOICEDAY', percent: 0, fixed: 15 });
    } else if (code === 'COIN5') {
      setAppliedPromo({ code: 'COIN5', percent: 0, fixed: 5 });
    } else if (code === 'COIN10') {
      setAppliedPromo({ code: 'COIN10', percent: 0, fixed: 10 });
    } else {
      setPromoError(language === 'fr' ? "Code coupon invalide. Essayez ALY10, BIENVENUE5 ou CHOICEDAY" : "Invalid coupon code. Try ALY10, BIENVENUE5 or CHOICEDAY");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200 border-l border-transparent dark:border-zinc-800 transition-colors">
        
        {/* Header */}
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-zinc-950 dark:text-zinc-100">{getTranslation(language, 'yourCart')}</h2>
            <span className="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2 py-0.5 rounded-full font-mono font-bold tabular-nums">
              {items.length} {items.length > 1 ? (language === 'fr' ? 'articles' : 'items') : (language === 'fr' ? 'article' : 'item')}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label={getTranslation(language, 'close')}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="bg-orange-50/70 dark:bg-orange-950/30 border-b border-orange-100 dark:border-orange-900/40 px-5 py-3">
          <div className="flex justify-between items-center text-xs font-medium text-orange-950 dark:text-orange-200 mb-1.5">
            {remainingForFreeShipping === 0 ? (
              <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
                <Check className="w-3.5 h-3.5" /> {getTranslation(language, 'freeShippingUnlocked')}
              </span>
            ) : (
              <span>
                {getTranslation(language, 'freeShippingRemaining', { amount: formatPrice(remainingForFreeShipping, currency) })}
              </span>
            )}
          </div>
          <div className="w-full bg-orange-200/60 dark:bg-orange-900/50 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-orange-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressToFreeShipping}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-subtle">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 text-zinc-400 dark:text-zinc-500">
              <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                <Tag className="w-8 h-8 text-zinc-300 dark:text-zinc-600" />
              </div>
              <p className="text-zinc-800 dark:text-zinc-200 font-semibold mb-1">{getTranslation(language, 'emptyCart')}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mb-6">
                {language === 'fr' ? 'Découvrez les offres Choice et profitez de la livraison suivie offerte dès 20 €.' : 'Discover Choice offers and enjoy free tracked delivery from €20.'}
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-white bg-zinc-950 dark:bg-orange-600 rounded-lg hover:bg-zinc-800 dark:hover:bg-orange-500 transition-colors cursor-pointer"
              >
                {getTranslation(language, 'continueShopping')}
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.product.id}-${item.variant.id}`}
                className="flex gap-3.5 p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-18 h-18 object-cover rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shrink-0"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-2">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.product.id, item.variant.id)}
                        className="text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {language === 'fr' ? 'Finition' : 'Variant'} : {item.variant.name}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-200/60 dark:border-zinc-700/60">
                    <span className="text-xs font-bold text-zinc-950 dark:text-white font-mono tabular-nums">
                      {formatPrice(item.product.priceEUR * item.quantity, currency)}
                    </span>

                    <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800">
                      <button
                        onClick={() =>
                          onUpdateQuantity(
                            item.product.id,
                            item.variant.id,
                            Math.max(1, item.quantity - 1)
                          )
                        }
                        className="px-2 py-0.5 text-xs text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-2 py-0.5 text-xs font-mono font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(
                            item.product.id,
                            item.variant.id,
                            item.quantity + 1
                          )
                        }
                        className="px-2 py-0.5 text-xs text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-5 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3 transition-colors">
            
            <div className="flex items-center justify-between p-2.5 bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/50 rounded-xl text-xs">
              <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-200">
                <Coins className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>
                  {language === 'fr' ? 'Utiliser vos pièces (solde:' : 'Use coins (balance:'} <strong>{user.coinsBalance}</strong>)
                </span>
              </div>
              <input
                type="checkbox"
                checked={useCoinsDiscount}
                onChange={(e) => setUseCoinsDiscount(e.target.checked)}
                className="w-4 h-4 accent-amber-500 cursor-pointer"
              />
            </div>

            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <input
                type="text"
                placeholder={getTranslation(language, 'promoCode')}
                value={promoCodeInput}
                onChange={(e) => setPromoCodeInput(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:border-orange-500 uppercase text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-semibold bg-zinc-900 dark:bg-zinc-800 text-white rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-700 border border-transparent dark:border-zinc-750 transition-colors cursor-pointer"
              >
                {getTranslation(language, 'apply')}
              </button>
            </form>
            {promoError && (
              <p className="text-[11px] text-red-600 dark:text-red-400">{promoError}</p>
            )}
            {appliedPromo && (
              <div className="flex justify-between items-center text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/60 dark:border-emerald-800/40 px-2.5 py-1 rounded">
                <span>Coupon: {appliedPromo.code}</span>
                <button
                  type="button"
                  onClick={() => setAppliedPromo(null)}
                  className="underline hover:text-emerald-900 dark:hover:text-emerald-100 cursor-pointer"
                >
                  {getTranslation(language, 'remove')}
                </button>
              </div>
            )}

            <div className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-300 pt-1">
              <div className="flex justify-between">
                <span>{getTranslation(language, 'subtotal')} :</span>
                <span className="font-mono tabular-nums text-zinc-900 dark:text-zinc-100 font-semibold">
                  {formatPrice(subtotalEUR, currency)}
                </span>
              </div>
              {totalDiscountEUR > 0 && (
                <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-semibold">
                  <span>{language === 'fr' ? 'Remises déduites :' : 'Discounts applied :'}</span>
                  <span className="font-mono tabular-nums">
                    -{formatPrice(totalDiscountEUR, currency)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>{getTranslation(language, 'shipping')} :</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                  {subtotalEUR >= freeShippingThresholdEUR ? getTranslation(language, 'free') : formatPrice(2.99, currency)}
                </span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-zinc-950 dark:text-white pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <span>{getTranslation(language, 'total')} :</span>
                <span className="font-mono tabular-nums text-orange-600 dark:text-orange-400">
                  {formatPrice(totalEUR + (subtotalEUR >= freeShippingThresholdEUR ? 0 : 2.99), currency)}
                </span>
              </div>
            </div>

            <button
              onClick={() => onProceedToCheckout(totalDiscountEUR, appliedPromo ? appliedPromo.code : 'PIECES')}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-xl transition-colors cursor-pointer shadow-sm active:scale-98"
            >
              <span>{getTranslation(language, 'checkout')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500" />
              <span>{language === 'fr' ? 'Garantie SoryOS Choice · Cryptage bancaire 256-bit' : 'SoryOS Choice Guarantee · 256-bit Secure SSL'}</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
