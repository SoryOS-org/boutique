import React, { useState } from 'react';
import { 
  X, User, MapPin, Ticket, Package, ShieldCheck, Award, Settings, 
  Bell, Lock, Check, Save, LogOut, Sparkles, ExternalLink, RefreshCw 
} from 'lucide-react';
import { UserAccount, Order, CurrencyCode } from '../types';
import { formatPrice } from '../data/products';
import { GoogleIcon } from './GoogleIcon';
import { useAuth } from '../context/AuthContext';

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
  const { firebaseUser, loginWithGoogle, logout, isLoggingIn } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'settings'>('overview');
  const [showGuestOrders, setShowGuestOrders] = useState(false);

  // Settings form state
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.savedAddresses[0]?.phone || '+224 621 09 03 88');
  const [notificationPreferences, setNotificationPreferences] = useState<'push' | 'email' | 'none'>(user.notificationPreferences || 'push');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  if (!isOpen) return null;

  const isConnectedWithGoogle = Boolean(firebaseUser || user.isGoogleUser);

  const handleGoogleLogin = async () => {
    setLoginError(null);
    try {
      const loggedIn = await loginWithGoogle();
      if (loggedIn) {
        setSuccessMessage(
          language === 'fr'
            ? `Bienvenue, ${loggedIn.displayName || 'Client SoryOS'} ! Compte Google synchronisé.`
            : `Welcome, ${loggedIn.displayName || 'SoryOS Client'}! Google account synced.`
        );
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        setLoginError(
          language === 'fr'
            ? 'Impossible de finaliser la connexion Google. Veuillez réessayer.'
            : 'Google sign-in could not be completed. Please try again.'
        );
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setSuccessMessage(
        language === 'fr' ? 'Déconnexion réussie.' : 'Logged out successfully.'
      );
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserAccount = {
      ...user,
      name,
      email,
      savedAddresses: user.savedAddresses.map((addr, idx) => 
        idx === 0 ? { ...addr, phone } : addr
      ),
      notificationPreferences,
    };
    onUpdateUser(updated);
    setSuccessMessage(language === 'fr' ? 'Paramètres enregistrés avec succès !' : 'Settings saved successfully!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Filter orders strictly for this user
  const userOrders = isConnectedWithGoogle && user.email
    ? orders.filter(o => o.customer.email.toLowerCase() === user.email.toLowerCase())
    : orders;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden my-4 transition-colors">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-800 text-white flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            {isConnectedWithGoogle && (user.photoURL || firebaseUser?.photoURL) ? (
              <img
                src={user.photoURL || firebaseUser?.photoURL || ''}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500 shadow-md shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 text-white font-bold text-lg flex items-center justify-center ring-2 ring-white/10 shadow-md shrink-0">
                {isConnectedWithGoogle 
                  ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                  : <User className="w-6 h-6 text-white" />}
              </div>
            )}
            
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-sm sm:text-base text-white truncate max-w-[200px] sm:max-w-xs">
                  {isConnectedWithGoogle ? user.name : (language === 'fr' ? 'Mon Espace Client' : 'My Account Space')}
                </h3>
                {isConnectedWithGoogle ? (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                    <GoogleIcon className="w-3 h-3" />
                    <span>{language === 'fr' ? 'Google Vérifié' : 'Google Verified'}</span>
                  </span>
                ) : (
                  <span className="text-[10px] bg-zinc-700 text-zinc-300 font-semibold px-2 py-0.5 rounded-full shrink-0">
                    {language === 'fr' ? 'Invité' : 'Guest'}
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 truncate mt-0.5">
                {isConnectedWithGoogle ? user.email : (language === 'fr' ? 'Connectez-vous pour sauvegarder votre profil' : 'Log in to save your profile')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isConnectedWithGoogle && (
              <button
                onClick={handleLogout}
                title={language === 'fr' ? 'Se déconnecter' : 'Log out'}
                className="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer text-xs flex items-center gap-1"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">{language === 'fr' ? 'Déconnexion' : 'Sign out'}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success or Error alert banner */}
        {successMessage && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border-b border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 font-medium">
            <Check className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {loginError && (
          <div className="p-3 bg-red-50 dark:bg-red-950/50 border-b border-red-200 dark:border-red-800/60 text-red-800 dark:text-red-300 text-xs flex items-center gap-2 font-medium">
            <X className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
            <span>{loginError}</span>
          </div>
        )}

        {/* =========================================================================
            STATE A: USER IS NOT LOGGED IN WITH GOOGLE -> DEDICATED SIGN IN / SIGN UP VIEW
            ========================================================================= */}
        {!isConnectedWithGoogle && !showGuestOrders ? (
          <div className="p-5 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
            
            <div className="text-center max-w-md mx-auto space-y-2">
              <div className="inline-flex p-3 rounded-2xl bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 mb-1">
                <GoogleIcon className="w-8 h-8" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-zinc-50 tracking-tight">
                {language === 'fr' ? 'Connexion ou Création de compte' : 'Log In or Create an Account'}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                {language === 'fr' 
                  ? 'Connectez-vous avec votre compte Google réel. S’il existe déjà, vous retrouvez vos commandes et pièces. Sinon, votre compte est créé immédiatement.' 
                  : 'Sign in with your real Google account. If it exists, retrieve your orders and coins. Otherwise, your account is created in 1 click.'}
              </p>
            </div>

            {/* Official Google Sign In Button */}
            <div className="max-w-md mx-auto">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoggingIn}
                className="w-full h-13 px-5 rounded-2xl bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700/80 active:scale-[0.99] border-2 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100 font-bold text-sm sm:text-base flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group"
              >
                {isLoggingIn ? (
                  <>
                    <RefreshCw className="w-5 h-5 text-orange-600 animate-spin" />
                    <span>{language === 'fr' ? 'Connexion Google en cours...' : 'Connecting to Google...'}</span>
                  </>
                ) : (
                  <>
                    <GoogleIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>{language === 'fr' ? 'Continuer avec Google' : 'Continue with Google'}</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-zinc-400 dark:text-zinc-500 text-center mt-2.5 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>{language === 'fr' ? 'Sécurisé par Google Identity Services & Firebase Auth' : 'Secured by Google Identity Services & Firebase Auth'}</span>
              </p>
            </div>

            {/* 4 Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto pt-2">
              <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-xs font-bold text-amber-950 dark:text-amber-200">
                    {language === 'fr' ? '+500 Pièces Offertes' : '+500 Welcome Coins'}
                  </span>
                </div>
                <p className="text-[11px] text-amber-800 dark:text-amber-300">
                  {language === 'fr' ? 'Créditées directement dans votre cagnotte de fidélité dès la connexion.' : 'Credited directly to your loyalty wallet upon sign up.'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-orange-50/70 dark:bg-orange-950/30 border border-orange-200/80 dark:border-orange-900/40 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <Package className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  <span className="text-xs font-bold text-orange-950 dark:text-orange-200">
                    {language === 'fr' ? 'Suivi Choice & Synchronisation' : 'Choice Tracking & Sync'}
                  </span>
                </div>
                <p className="text-[11px] text-orange-800 dark:text-orange-300">
                  {language === 'fr' ? 'Retrouvez vos colis et votre panier en temps réel sur tous vos appareils.' : 'Access your packages and cart in real time on any device.'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/40 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                    {language === 'fr' ? 'Chat WhatsApp Business' : 'WhatsApp Business Chat'}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                  {language === 'fr' ? 'Discutez avec les vendeurs avec votre profil vérifié officiel.' : 'Chat with verified factory sellers with your account profile.'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    {language === 'fr' ? 'Sans mot de passe' : 'No Password Needed'}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                  {language === 'fr' ? 'Connexion en 1 clic grâce aux identifiants Google OAuth officiels.' : '1-click instant login protected by official Google OAuth.'}
                </p>
              </div>
            </div>

            {/* Link to view guest orders if any */}
            {orders.length > 0 && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setShowGuestOrders(true)}
                  className="text-xs font-semibold text-zinc-500 hover:text-orange-600 dark:text-zinc-400 dark:hover:text-orange-400 underline underline-offset-4 cursor-pointer"
                >
                  {language === 'fr' 
                    ? `Voir mes ${orders.length} commande(s) passée(s) en tant qu'invité` 
                    : `View my ${orders.length} guest order(s)`}
                </button>
              </div>
            )}

          </div>
        ) : (
          /* =========================================================================
             STATE B: USER IS LOGGED IN (OR VIEWING ORDERS) -> FULL DASHBOARD & SETTINGS
             ========================================================================= */
          <>
            {/* Navigation Tabs */}
            <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/50 px-4 sm:px-6 gap-6 text-xs font-semibold">
              <button
                onClick={() => {
                  setActiveTab('overview');
                  setShowGuestOrders(false);
                }}
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
                onClick={() => {
                  setActiveTab('settings');
                  setShowGuestOrders(false);
                }}
                className={`py-3.5 border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
                  activeTab === 'settings'
                    ? 'border-orange-600 text-orange-600 dark:text-orange-500 font-bold'
                    : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>{language === 'fr' ? 'Paramètres & Adresses' : 'Settings & Addresses'}</span>
              </button>

              {!isConnectedWithGoogle && (
                <button
                  onClick={() => setShowGuestOrders(false)}
                  className="py-3.5 ml-auto text-orange-600 font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <GoogleIcon className="w-3.5 h-3.5" />
                  <span>{language === 'fr' ? 'Se connecter' : 'Log In'}</span>
                </button>
              )}
            </div>

            {/* Dashboard Content */}
            <div className="p-4 sm:p-6 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-subtle">
              
              {activeTab === 'overview' ? (
                <>
                  {/* Quick Metrics */}
                  <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                    <button
                      onClick={() => {
                        onClose();
                        onOpenCoins();
                      }}
                      className="p-3 bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/50 rounded-xl text-left hover:bg-amber-100/70 dark:hover:bg-amber-900/40 transition-colors cursor-pointer"
                    >
                      <span className="text-[10px] sm:text-[11px] font-semibold text-amber-900 dark:text-amber-200 block truncate">
                        {language === 'fr' ? 'Pièces Récompenses' : 'Reward Coins'}
                      </span>
                      <span className="text-base sm:text-lg font-mono font-bold text-amber-700 dark:text-amber-400 tabular-nums">
                        {user.coinsBalance.toLocaleString('fr-FR')}
                      </span>
                      <span className="text-[9px] sm:text-[10px] text-amber-800 dark:text-amber-300 block mt-0.5 truncate">
                        {language === 'fr' ? 'Cliquez pour convertir' : 'Click to redeem'}
                      </span>
                    </button>

                    <div className="p-3 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-left">
                      <span className="text-[10px] sm:text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 block truncate">
                        {language === 'fr' ? 'Commandes' : 'Recent Orders'}
                      </span>
                      <span className="text-base sm:text-lg font-mono font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
                        {userOrders.length}
                      </span>
                      <span className="text-[9px] sm:text-[10px] text-zinc-500 dark:text-zinc-400 block mt-0.5 truncate">
                        {language === 'fr' ? 'Toutes expédiées Choice' : 'All Choice shipped'}
                      </span>
                    </div>

                    <div className="p-3 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl text-left">
                      <span className="text-[10px] sm:text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 block truncate">
                        {language === 'fr' ? 'Coupons Actifs' : 'Active Coupons'}
                      </span>
                      <span className="text-base sm:text-lg font-mono font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
                        {user.availableCoupons.length}
                      </span>
                      <span className="text-[9px] sm:text-[10px] text-zinc-500 dark:text-zinc-400 block mt-0.5 truncate">
                        {language === 'fr' ? 'Prêts à être appliqués' : 'Ready to apply'}
                      </span>
                    </div>
                  </div>

                  {/* Orders History */}
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                      <Package className="w-4 h-4 text-orange-600 dark:text-orange-500" />
                      <span>{language === 'fr' ? 'Historique des commandes Choice' : 'Choice order history'}</span>
                    </h4>

                    {userOrders.length === 0 ? (
                      <div className="p-5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-center text-xs text-zinc-500 dark:text-zinc-400">
                        {language === 'fr'
                          ? "Vous n'avez pas encore passé de commande. Vos commandes Choice apparaîtront ici avec suivi en direct."
                          : "You haven't placed any orders yet. Your Choice orders will appear here with live tracking."}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {userOrders.map((ord) => (
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
                          className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
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
                          disabled={isConnectedWithGoogle}
                          className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-orange-500 disabled:opacity-60"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                          {language === 'fr' ? 'Numéro WhatsApp / Téléphone (Suivi Colis & Vendeurs)' : 'WhatsApp / Phone (Package Tracking & Sellers)'}
                        </label>
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                          className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-orange-500 font-mono"
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

                    <div className="space-y-2">
                      {(['push', 'email', 'none'] as const).map((pref) => (
                        <label key={pref} className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl cursor-pointer hover:border-orange-500 transition-colors">
                          <input
                            type="radio"
                            name="notifications"
                            value={pref}
                            checked={notificationPreferences === pref}
                            onChange={() => setNotificationPreferences(pref)}
                            className="w-4 h-4 accent-orange-600"
                          />
                          <span className="font-bold text-zinc-900 dark:text-zinc-100 capitalize text-xs">
                            {pref === 'push' ? (language === 'fr' ? 'Notifications Push (App)' : 'Push Notifications (App)') :
                             pref === 'email' ? (language === 'fr' ? 'Notifications par Email' : 'Email Notifications') :
                             (language === 'fr' ? 'Aucune notification' : 'No notifications')}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Google Account Management Section */}
                  <div className="space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                    <h4 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
                      <span>{language === 'fr' ? 'Sécurité & Authentification' : 'Security & Authentication'}</span>
                    </h4>

                    {isConnectedWithGoogle ? (
                      <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <GoogleIcon className="w-5 h-5 shrink-0" />
                          <div>
                            <span className="font-bold text-zinc-900 dark:text-zinc-100 block text-xs">
                              {language === 'fr' ? 'Authentifié via Google Identity' : 'Authenticated via Google Identity'}
                            </span>
                            <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                              {firebaseUser?.email || user.email}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleLogout}
                          className="px-3 py-1.5 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-semibold rounded-lg text-xs transition-colors cursor-pointer shrink-0"
                        >
                          {language === 'fr' ? 'Changer de compte' : 'Switch account'}
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full p-3 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 font-bold flex items-center justify-center gap-2 cursor-pointer hover:bg-orange-100 transition-colors"
                      >
                        <GoogleIcon className="w-4 h-4" />
                        <span>{language === 'fr' ? 'Lier un compte Google officiel' : 'Link official Google account'}</span>
                      </button>
                    )}
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
          </>
        )}

      </div>
    </div>
  );
};
