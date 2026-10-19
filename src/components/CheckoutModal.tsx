import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, CheckCircle2, Truck, CreditCard, Lock, Sparkles } from 'lucide-react';
import { CartItem, CurrencyCode, Order, UserAccount } from '../types';
import { formatPrice } from '../data/products';
import { GoogleIcon } from './GoogleIcon';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: CurrencyCode;
  discountEUR: number;
  discountCode: string;
  onOrderCreated: (order: Order) => void;
  user?: UserAccount;
  onOpenAccount?: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  discountEUR,
  onOrderCreated,
  user,
  onOpenAccount,
}) => {
  const [fullName, setFullName] = useState(user?.name || 'Client SoryOS');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState(user?.savedAddresses?.[0]?.address || '14 rue de la République');
  const [city, setCity] = useState(user?.savedAddresses?.[0]?.city || 'Paris');
  const [postalCode, setPostalCode] = useState(user?.savedAddresses?.[0]?.postalCode || '75001');
  const [phone, setPhone] = useState(user?.savedAddresses?.[0]?.phone || '+224 621 09 03 88');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod' | 'apple_pay'>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (user) {
      if (user.name && user.name !== 'Invité SoryOS') setFullName(user.name);
      if (user.email && user.email !== 'visiteur@soryos.store') setEmail(user.email);
      if (user.savedAddresses?.[0]) {
        setAddress(user.savedAddresses[0].address);
        setCity(user.savedAddresses[0].city);
        setPostalCode(user.savedAddresses[0].postalCode);
        setPhone(user.savedAddresses[0].phone);
      }
    }
  }, [user]);

  const subtotalEUR = items.reduce(
    (sum, item) => sum + item.product.priceEUR * item.quantity,
    0
  );
  const shippingCostEUR = subtotalEUR >= 20 ? 0 : 2.99;
  const finalTotalEUR = Math.max(0, subtotalEUR - discountEUR + shippingCostEUR);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const trackingCode = `ALY-FR-${Math.floor(10000000 + Math.random() * 90000000)}`;
      const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

      const arrivalDate = new Date();
      arrivalDate.setDate(arrivalDate.getDate() + 6);
      const estimatedDeliveryStr = arrivalDate.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

      const newOrder: Order = {
        id: orderId,
        date: new Date().toLocaleDateString('fr-FR'),
        trackingNumber: trackingCode,
        status: 'processing',
        customer: {
          fullName,
          email,
          address,
          city,
          postalCode,
        },
        items: [...items],
        totalEUR: finalTotalEUR,
        currency,
        estimatedDelivery: estimatedDeliveryStr,
      };

      setCompletedOrder(newOrder);
      setIsSubmitting(false);
      onOrderCreated(newOrder);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden my-6 transition-colors">
        
        {/* Header */}
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900 transition-colors">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-bold text-zinc-950 dark:text-zinc-100 text-base">
              {completedOrder ? 'Commande Confirmée' : 'Finalisation de votre commande Choice'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {completedOrder ? (
          /* Order Confirmation View */
          <div className="p-6 sm:p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50/50 dark:ring-emerald-950/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-xl font-bold text-zinc-950 dark:text-white mb-1">
                Merci {completedOrder.customer.fullName} !
              </h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-300">
                Votre commande <strong className="font-mono text-zinc-900 dark:text-zinc-100">{completedOrder.id}</strong> a été enregistrée avec succès.
              </p>
            </div>

            {/* Tracking Summary Card */}
            <div className="bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 text-left space-y-3">
              <div className="flex justify-between items-center text-xs border-b border-zinc-200 dark:border-zinc-700 pb-2">
                <span className="text-zinc-500 dark:text-zinc-400">Numéro de suivi Choice :</span>
                <span className="font-mono font-bold text-orange-600 dark:text-orange-400 tabular-nums">
                  {completedOrder.trackingNumber}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs border-b border-zinc-200 dark:border-zinc-700 pb-2">
                <span className="text-zinc-500 dark:text-zinc-400">Livraison estimée :</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">{completedOrder.estimatedDelivery}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500 dark:text-zinc-400">Adresse d'expédition :</span>
                <span className="text-zinc-800 dark:text-zinc-200 text-right truncate max-w-[220px]">
                  {completedOrder.customer.address}, {completedOrder.customer.postalCode} {completedOrder.customer.city}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-zinc-950 dark:bg-orange-600 hover:bg-zinc-800 dark:hover:bg-orange-500 rounded-xl transition-colors cursor-pointer"
              >
                Retourner à la boutique
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form View */
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* Google Authentication Status Banner in Checkout */}
            {user?.isGoogleUser ? (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative shrink-0">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.name} className="w-7 h-7 rounded-full object-cover ring-1 ring-emerald-500" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                        {user.name[0]?.toUpperCase() || 'G'}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-emerald-950 dark:text-emerald-200 truncate">{user.name}</span>
                      <span className="text-[10px] bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded-full shrink-0">Compte Google</span>
                    </div>
                    <span className="text-[11px] text-emerald-800 dark:text-emerald-300 truncate block">{user.email}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 block">+10% Pièces</span>
                  <span className="text-[9px] text-zinc-500 dark:text-zinc-400">sur cette commande</span>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 text-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <GoogleIcon className="w-5 h-5 shrink-0" />
                  <div className="min-w-0">
                    <span className="font-bold text-orange-950 dark:text-orange-200 block truncate">Connexion Google</span>
                    <span className="text-[11px] text-orange-800 dark:text-orange-300 block truncate">Pré-remplissez vos coordonnées et recevez 500 pièces</span>
                  </div>
                </div>
                {onOpenAccount && (
                  <button
                    type="button"
                    onClick={onOpenAccount}
                    className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 active:scale-95 text-white font-bold rounded-lg text-xs shrink-0 cursor-pointer transition-all shadow-xs"
                  >
                    Se connecter
                  </button>
                )}
              </div>
            )}

            {/* Delivery address */}
            <div>
              <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-orange-600 dark:text-orange-500" />
                <span>Adresse de livraison certifiée</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-300 mb-1 font-medium">Nom complet</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:border-orange-500 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-300 mb-1 font-medium">Email de confirmation</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:border-orange-500 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-zinc-600 dark:text-zinc-300 mb-1 font-medium">Adresse postale</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:border-orange-500 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-zinc-600 mb-1 font-medium dark:text-zinc-300">Code postal</label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:border-orange-500 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-300 mb-1 font-medium">Ville</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:border-orange-500 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-zinc-600 dark:text-zinc-300 mb-1 font-medium">Téléphone (suivi SMS transporteur)</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:border-orange-500 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>
            </div>

            {/* Payment Mode */}
            <div>
              <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-orange-600 dark:text-orange-500" />
                <span>Moyen de paiement sécurisé</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-orange-600 bg-orange-50/50 dark:bg-orange-950/40 ring-1 ring-orange-600 font-semibold text-orange-950 dark:text-orange-200'
                      : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800/40'
                  }`}
                >
                  <span className="block font-bold mb-0.5">Carte Bancaire</span>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-normal">Visa, Mastercard</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    paymentMethod === 'apple_pay'
                      ? 'border-orange-600 bg-orange-50/50 dark:bg-orange-950/40 ring-1 ring-orange-600 font-semibold text-orange-950 dark:text-orange-200'
                      : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800/40'
                  }`}
                >
                  <span className="block font-bold mb-0.5">Pay Express</span>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-normal">Apple / Google Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-orange-600 bg-orange-50/50 dark:bg-orange-950/40 ring-1 ring-orange-600 font-semibold text-orange-950 dark:text-orange-200'
                      : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800/40'
                  }`}
                >
                  <span className="block font-bold mb-0.5">À la livraison</span>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-normal">Règlement au facteur</span>
                </button>
              </div>
            </div>

            {/* Price recap */}
            <div className="bg-zinc-50 dark:bg-zinc-800/60 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-1.5 text-xs">
              <div className="flex justify-between text-zinc-600 dark:text-zinc-300">
                <span>Total articles ({items.reduce((acc, i) => acc + i.quantity, 0)}) :</span>
                <span className="font-mono tabular-nums text-zinc-900 dark:text-zinc-100 font-medium">{formatPrice(subtotalEUR, currency)}</span>
              </div>
              {discountEUR > 0 && (
                <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-semibold">
                  <span>Remise déduite :</span>
                  <span className="font-mono tabular-nums">-{formatPrice(discountEUR, currency)}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-600 dark:text-zinc-300">
                <span>Frais d'envoi :</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                  {shippingCostEUR === 0 ? 'Gratuit (Option Choice)' : formatPrice(shippingCostEUR, currency)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-zinc-950 dark:text-white pt-2 border-t border-zinc-200 dark:border-zinc-700">
                <span>Montant final débité :</span>
                <span className="text-orange-600 dark:text-orange-400 font-mono tabular-nums">
                  {formatPrice(finalTotalEUR, currency)}
                </span>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-xl transition-colors cursor-pointer shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 active:scale-98"
              >
                {isSubmitting ? (
                  <span>Validation bancaire en cours...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Confirmer et payer ({formatPrice(finalTotalEUR, currency)})</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
