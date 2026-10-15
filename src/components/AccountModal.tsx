import React, { useState } from 'react';
import { X, User, MapPin, Ticket, Package, ShieldCheck, Award, Clock, Settings, Bell, Lock, Globe, Check, Save } from 'lucide-react';
import { UserAccount, Order, CurrencyCode } from '../types';
import { formatPrice } from '../data/products';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount;
  orders: Order[];
  currency: CurrencyCode;
  onTrackOrder: (trackingNumber: string) => void;
  onOpenCoins: () => void;
  onUpdateUser: (updatedUser: UserAccount) => void;
  language: 'fr' | 'en';
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  user,
  orders,
  currency,
  onTrackOrder,
  onOpenCoins,
  onUpdateUser,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'settings'>('overview');

  // Settings form state
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.savedAddresses[0]?.phone || '+224 621 09 03 88');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [flashAlerts, setFlashAlerts] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserAccount = {
      ...user,
      name,
      email,
      savedAddresses: user.savedAddresses.map((addr, idx) => 
        idx === 0 ? { ...addr, phone } : addr
      )
    };
    onUpdateUser(updated);
    setSuccessMessage(language === 'fr' ? 'Paramètres enregistrés avec succès !' : 'Settings saved successfully!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden my-6 transition-colors">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-zinc-950 to-zinc-800 text-white flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-orange-600 text-white font-bold text-lg flex items-center justify-center ring-4 ring-white/10 shadow-sm">
              {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">{user.name}</h3>
                <span className="text-[11px] bg-amber-400 text-zinc-950 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  {user.memberTier}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">{user.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/50 px-6 gap-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3.5 border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'border-orange-600 text-orange-600 dark:text-orange-500 font-bold'
                : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>{language === 'fr' ? 'Mon Compte & Commandes' : 'Account & Orders'}</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3.5 border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'settings'
                ? 'border-orange-600 text-orange-600 dark:text-orange-500 font-bold'
                : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>{language === 'fr' ? 'Paramètres & Sécurité' : 'Settings & Security'}</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-subtle">
          
          {successMessage && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 font-medium">
              <Check className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {activeTab === 'overview' ? (
            <>
              {/* Quick Metrics */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => {
                    onClose();
                    onOpenCoins();
                  }}
                  className="p-3 bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/50 rounded-xl text-left hover:bg-amber-100/70 dark:hover:bg-amber-900/40 transition-colors cursor-pointer"
                >
                  <span className="text-[11px] font-semibold text-amber-900 dark:text-amber-200 block">
                    {language === 'fr' ? 'Pièces Récompenses' : 'Reward Coins'}
                  </span>
                  <span className="text-lg font-mono font-bold text-amber-700 dark:text-amber-400 tabular-nums">
                    {user.coinsBalance.toLocaleString('fr-FR')}
                  </span>
                  <span className="text-[10px] text-amber-800 dark:text-amber-300 block mt-0.5">
                    {language === 'fr' ? 'Cliquez pour convertir' : 'Click to convert'}
                  </span>
                </button>

                <div className="p-3 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-left">
                  <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 block">
                    {language === 'fr' ? 'Commandes Récentes' : 'Recent Orders'}
                  </span>
                  <span className="text-lg font-mono font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
                    {orders.length}
                  </span>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block mt-0.5">
                    {language === 'fr' ? 'Toutes expédiées Choice' : 'All Choice shipped'}
                  </span>
                </div>

                <div className="p-3 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-left">
                  <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 block">
                    {language === 'fr' ? 'Coupons Actifs' : 'Active Coupons'}
                  </span>
                  <span className="text-lg font-mono font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
                    {user.availableCoupons.length}
                  </span>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block mt-0.5">
                    {language === 'fr' ? 'Prêts à être appliqués' : 'Ready to apply'}
                  </span>
                </div>
              </div>

              {/* Orders History */}
              <div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-orange-600 dark:text-orange-500" />
                  <span>{language === 'fr' ? 'Historique des commandes récentes' : 'Recent orders history'}</span>
                </h4>

                {orders.length === 0 ? (
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-center text-xs text-zinc-500 dark:text-zinc-400">
                    {language === 'fr'
                      ? "Vous n'avez pas encore passé de commande aujourd'hui. Vos commandes Choice apparaîtront ici avec leur numéro de suivi."
                      : "You haven't placed any orders yet. Your Choice orders will appear here with tracking."}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-3.5 border border-zinc-200 dark:border-zinc-700/80 rounded-xl bg-zinc-50/50 dark:bg-zinc-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-zinc-900 dark:text-zinc-100 font-mono">{ord.id}</span>
                            <span className="text-zinc-400 dark:text-zinc-600">·</span>
                            <span className="text-zinc-500 dark:text-zinc-400">{ord.date}</span>
                            <span className="text-zinc-400 dark:text-zinc-600">·</span>
                            <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40 dark:border-emerald-800/40 font-bold px-1.5 py-0.2 rounded text-[10px]">
                              {language === 'fr' ? 'En transit' : 'In transit'}
                            </span>
                          </div>
                          <p className="text-zinc-600 dark:text-zinc-300 mt-1">
                            {ord.items.length} {language === 'fr' ? 'article(s) · Total :' : 'item(s) · Total :'} {' '}
                            <strong className="font-mono tabular-nums text-zinc-900 dark:text-zinc-100">{formatPrice(ord.totalEUR, currency)}</strong>
                          </p>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">
                            {language === 'fr' ? 'Suivi :' : 'Tracking:'} {ord.trackingNumber}
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            onClose();
                            onTrackOrder(ord.trackingNumber);
                          }}
                          className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer shrink-0 shadow-xs"
                        >
                          {language === 'fr' ? 'Suivre ce colis' : 'Track package'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Saved Addresses */}
              <div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-orange-600 dark:text-orange-500" />
                  <span>{language === 'fr' ? 'Adresses de livraison enregistrées' : 'Saved delivery addresses'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {user.savedAddresses.map((addr) => (
                    <div key={addr.id} className="p-3 border border-zinc-200 dark:border-zinc-700/80 rounded-xl bg-white dark:bg-zinc-800/60 space-y-1">
                      <span className="font-bold text-zinc-900 dark:text-zinc-100 block">{addr.label}</span>
                      <p className="text-zinc-600 dark:text-zinc-300">{addr.address}</p>
                      <p className="text-zinc-600 dark:text-zinc-300">{addr.postalCode} {addr.city}</p>
                      <p className="text-zinc-500 dark:text-zinc-400 font-mono text-[11px]">{addr.phone}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Available Coupons */}
              <div>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <Ticket className="w-4 h-4 text-orange-600 dark:text-orange-500" />
                  <span>{language === 'fr' ? 'Vos coupons exclusifs portefeuille' : 'Your wallet exclusive coupons'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  {user.availableCoupons.map((c) => (
                    <div key={c.code} className="p-3 border border-orange-200 dark:border-orange-900/50 bg-orange-50/50 dark:bg-orange-950/30 rounded-xl">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-mono font-bold text-orange-700 dark:text-orange-400">{c.code}</span>
                        <span className="font-bold text-zinc-900 dark:text-zinc-100">{c.discountValue}</span>
                      </div>
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-300">{c.label}</p>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block mt-1">
                        {language === 'fr' ? `Dès ${c.minSpendEUR} € d'achat` : `Min. spend €${c.minSpendEUR}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Settings & Security Tab */
            <form onSubmit={handleSaveSettings} className="space-y-6 text-xs">
              
              {/* Profile Personal Info */}
              <div className="space-y-4">
                <h4 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide flex items-center gap-1.5">
                  <User className="w-4 h-4 text-orange-600 dark:text-orange-500" />
                  <span>{language === 'fr' ? 'Informations Personnelles' : 'Personal Information'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      {language === 'fr' ? 'Nom complet' : 'Full Name'}
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      {language === 'fr' ? 'Adresse Email' : 'Email Address'}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      {language === 'fr' ? 'Numéro de téléphone / WhatsApp (Suivi Colis)' : 'Phone / WhatsApp (Package Tracking)'}
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Notification Preferences */}
              <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <h4 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-orange-600 dark:text-orange-500" />
                  <span>{language === 'fr' ? 'Préférences de Notifications' : 'Notification Preferences'}</span>
                </h4>

                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl cursor-pointer">
                    <div>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100 block">
                        {language === 'fr' ? 'Notifications de suivi par Email' : 'Email Tracking Notifications'}
                      </span>
                      <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        {language === 'fr' ? "Recevoir les mises à jour d'expédition en temps réel" : "Receive real-time shipping updates"}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailAlerts}
                      onChange={(e) => setEmailAlerts(e.target.checked)}
                      className="w-4 h-4 accent-orange-600 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl cursor-pointer">
                    <div>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100 block">
                        {language === 'fr' ? 'Alertes WhatsApp & SMS' : 'WhatsApp & SMS Alerts'}
                      </span>
                      <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        {language === 'fr' ? "Alertes instantanées pour les douanes et la livraison" : "Instant alerts for customs and final delivery"}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={whatsappAlerts}
                      onChange={(e) => setWhatsappAlerts(e.target.checked)}
                      className="w-4 h-4 accent-orange-600 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl cursor-pointer">
                    <div>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100 block">
                        {language === 'fr' ? 'Alertes Ventes Flash & SuperDeals' : 'Flash Sales & SuperDeals Alerts'}
                      </span>
                      <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        {language === 'fr' ? "Être averti des baisses de prix exclusives et des nouveaux arrivages" : "Get notified on exclusive price drops and new arrivals"}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={flashAlerts}
                      onChange={(e) => setFlashAlerts(e.target.checked)}
                      className="w-4 h-4 accent-orange-600 rounded cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Password & Security */}
              <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <h4 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-orange-600 dark:text-orange-500" />
                  <span>{language === 'fr' ? 'Sécurité & Mot de Passe' : 'Security & Password'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      {language === 'fr' ? 'Mot de passe actuel' : 'Current Password'}
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      {language === 'fr' ? 'Nouveau mot de passe' : 'New Password'}
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{language === 'fr' ? 'Enregistrer les modifications' : 'Save Changes'}</span>
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
