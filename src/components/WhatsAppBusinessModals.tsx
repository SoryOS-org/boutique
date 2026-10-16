import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Store, BadgeCheck, Clock, MapPin, Phone, Mail, Globe, 
  Search, ShoppingBag, Send, ArrowRight, ShieldCheck, Star, 
  ExternalLink, Sparkles, MessageCircle, Truck, CreditCard, ChevronRight
} from 'lucide-react';
import { Product, CurrencyCode } from '../types';
import { formatPrice } from '../data/products';

interface WhatsAppCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  currency: CurrencyCode;
  onShareProductToChat: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  language: 'fr' | 'en';
}

export const WhatsAppCatalogModal: React.FC<WhatsAppCatalogModalProps> = ({
  isOpen,
  onClose,
  products,
  currency,
  onShareProductToChat,
  onAddToCart,
  language,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: language === 'fr' ? 'Tous les articles' : 'All items' },
    { id: 'audio', label: 'Audio & Son' },
    { id: 'gear', label: 'Tech & Setup' },
    { id: 'watches', label: 'Montres' },
    { id: 'home', label: 'Maison & Déco' },
    { id: 'mode', label: 'Mode & Caftans' },
  ];

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.categoryLabel.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white dark:bg-[#111b21] w-full max-w-2xl max-h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-zinc-200 dark:border-zinc-800"
      >
        {/* WhatsApp Business Header */}
        <div className="bg-[#008069] dark:bg-[#1f2c34] text-white p-4 sm:p-5 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center text-white">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-base sm:text-lg">
                  {language === 'fr' ? "Catalogue de l'entreprise" : "Business Catalog"}
                </h3>
                <BadgeCheck className="w-4 h-4 text-emerald-300 fill-emerald-300/20" />
              </div>
              <p className="text-xs text-white/80">
                SoryOS Global Import • {products.length} {language === 'fr' ? 'articles certifiés usine' : 'factory certified items'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-3 sm:p-4 bg-zinc-50 dark:bg-[#1f2c34]/50 border-b border-zinc-200 dark:border-zinc-800 space-y-2.5 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === 'fr' ? "Rechercher dans le catalogue WhatsApp..." : "Search business catalog..."}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#2a3942] rounded-xl text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 border border-zinc-200 dark:border-transparent focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#008069] text-white shadow-xs'
                    : 'bg-white dark:bg-[#202c33] text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 sm:space-y-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-zinc-400 text-xs">
              {language === 'fr' ? "Aucun article trouvé dans le catalogue." : "No items found in catalog."}
            </div>
          ) : (
            filteredProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white dark:bg-[#202c33] border border-zinc-200 dark:border-zinc-700/80 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs hover:border-emerald-500/50 transition-all group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 border border-zinc-100 dark:border-zinc-700 bg-zinc-100"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        {p.categoryLabel}
                      </span>
                      {p.isChoice && (
                        <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400">
                          Choice Direct Usine
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 truncate mt-0.5">
                      {p.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-black text-sm text-[#008069] dark:text-emerald-400">
                        {formatPrice(p.priceEUR, currency)}
                      </span>
                      <span className="text-xs text-zinc-400 line-through">
                        {formatPrice(p.originalPriceEUR, currency)}
                      </span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                        En stock
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => {
                      onShareProductToChat(p);
                      onClose();
                    }}
                    className="flex-1 sm:flex-none px-3 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Envoyer dans le chat WhatsApp"
                  >
                    <Send className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Envoyer au chat</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onAddToCart(p);
                      onClose();
                    }}
                    className="flex-1 sm:flex-none px-3.5 py-2 bg-[#008069] hover:bg-[#00705b] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Commander</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-zinc-50 dark:bg-[#1f2c34] border-t border-zinc-200 dark:border-zinc-800 text-center text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Paiement sécurisé & garantie 90 jours</span>
          </span>
          <span>WhatsApp Business Certifié</span>
        </div>
      </motion.div>
    </div>
  );
};

interface WhatsAppBusinessProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCatalog: () => void;
  onCallPhone: () => void;
  products: Product[];
  currency: CurrencyCode;
  language: 'fr' | 'en';
}

export const WhatsAppBusinessProfileModal: React.FC<WhatsAppBusinessProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenCatalog,
  onCallPhone,
  products,
  currency,
  language,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white dark:bg-[#111b21] w-full max-w-lg max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-zinc-200 dark:border-zinc-800"
      >
        {/* Header Cover */}
        <div className="relative h-28 sm:h-32 bg-gradient-to-r from-[#008069] via-emerald-700 to-teal-800 p-4 flex items-start justify-between text-white">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/25 text-[11px] font-bold backdrop-blur-xs">
            <BadgeCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>Compte Professionnel Vérifié</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-black/25 hover:bg-black/40 rounded-full text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Business Avatar & Core Info */}
        <div className="px-5 pb-5 pt-0 relative flex-1 overflow-y-auto">
          <div className="-mt-12 mb-3 flex items-end justify-between">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white font-black text-3xl flex items-center justify-center border-4 border-white dark:border-[#111b21] shadow-lg">
              S
            </div>
            <button
              onClick={onOpenCatalog}
              className="px-4 py-2 bg-[#008069] hover:bg-[#00705b] text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Store className="w-4 h-4" />
              <span>Voir le catalogue</span>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-black text-xl text-zinc-900 dark:text-zinc-100">
                  SoryOS Global Import
                </h3>
                <BadgeCheck className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
              </div>
              <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">
                Boutique d'importation directe d'usines partenaires & E-Commerce
              </p>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-2 leading-relaxed">
                Fournisseur officiel vérifié en produits High-Tech, Maison & Textile. Tous nos produits sont contrôlés avant expédition, garantis 90 jours et vendus à prix direct usine sans intermédiaire.
              </p>
            </div>

            {/* Quick Contact & Action Buttons */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                onClick={onCallPhone}
                className="p-2.5 rounded-xl bg-zinc-100 dark:bg-[#1f2c34] hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 flex items-center justify-center gap-2 text-xs font-bold transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4 text-[#008069]" />
                <span>Appeler (621 09 03 88)</span>
              </button>

              <button
                onClick={() => {
                  try {
                    navigator.clipboard?.writeText('+224621090388');
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2500);
                  } catch {
                    // Fallback
                  }
                }}
                className={`p-2.5 rounded-xl text-zinc-900 dark:text-zinc-100 flex items-center justify-center gap-2 text-xs font-bold transition-colors cursor-pointer ${
                  copied ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40' : 'bg-zinc-100 dark:bg-[#1f2c34] hover:bg-zinc-200 dark:hover:bg-zinc-800'
                }`}
              >
                <MessageCircle className="w-4 h-4 text-[#008069]" />
                <span>{copied ? '✓ Numéro copié !' : 'Copier WhatsApp'}</span>
              </button>
            </div>

            {/* WhatsApp Business Metadata List */}
            <div className="space-y-3 pt-3 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-300">
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                <div>
                  <div className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                    <span>Horaires d'ouverture</span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold">
                      Ouvert maintenant
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500">Lundi - Samedi : 08h00 - 21h00 • Dimanche : 09h00 - 18h00</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                <div>
                  <div className="font-bold text-zinc-900 dark:text-zinc-100">Adresse officielle</div>
                  <p className="text-[11px] text-zinc-500">Conakry, République de Guinée (Expédition rapide tout pays)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CreditCard className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                <div>
                  <div className="font-bold text-zinc-900 dark:text-zinc-100">Modes de paiement</div>
                  <p className="text-[11px] text-zinc-500">Orange Money (621 09 03 88), Wave, CB Visa/Mastercard & Paiement à la livraison</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                <div>
                  <div className="font-bold text-zinc-900 dark:text-zinc-100">Email commercial</div>
                  <p className="text-[11px] text-zinc-500">contact@soryos.com / service-client@soryos.com</p>
                </div>
              </div>
            </div>

            {/* Catalog Carousel Preview */}
            <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between mb-2.5">
                <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                  Articles populaires du catalogue
                </span>
                <button
                  onClick={onOpenCatalog}
                  className="text-xs text-[#008069] dark:text-emerald-400 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Tout voir</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {products.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    onClick={onOpenCatalog}
                    className="p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#1f2c34] cursor-pointer hover:border-emerald-500 transition-colors"
                  >
                    <img src={item.image} alt={item.name} className="w-full h-16 object-cover rounded-lg mb-1" />
                    <p className="font-bold text-[11px] truncate text-zinc-900 dark:text-zinc-100">{item.name}</p>
                    <p className="font-black text-[11px] text-[#008069] dark:text-emerald-400">{formatPrice(item.priceEUR, currency)}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </motion.div>
    </div>
  );
};

interface WhatsAppQuickRepliesBarProps {
  onSelectQuickReply: (text: string) => void;
  onOpenCatalog: () => void;
  language: 'fr' | 'en';
}

export const WhatsAppQuickRepliesBar: React.FC<WhatsAppQuickRepliesBarProps> = ({
  onSelectQuickReply,
  onOpenCatalog,
  language,
}) => {
  const quickActions = [
    { id: 'cat', icon: '🛍️', label: language === 'fr' ? 'Voir le catalogue' : 'View catalog', action: onOpenCatalog },
    { id: 'deliv', icon: '📦', label: language === 'fr' ? 'Délais de livraison' : 'Delivery times', question: language === 'fr' ? 'Quels sont vos délais et frais de livraison ?' : 'What are your delivery times and rates?' },
    { id: 'pay', icon: '💳', label: language === 'fr' ? 'Moyens de paiement' : 'Payment methods', question: language === 'fr' ? 'Comment payer par Orange Money ou Carte Bancaire ?' : 'How can I pay via Orange Money or Card?' },
    { id: 'whole', icon: '🏷️', label: language === 'fr' ? 'Tarif de gros (-30%)' : 'Wholesale pricing', question: language === 'fr' ? 'Bonjour, je souhaite un devis pour un achat en gros.' : 'Hello, I would like a wholesale price quote.' },
    { id: 'guar', icon: '🛡️', label: language === 'fr' ? 'Garantie & Retours' : 'Warranty & returns', question: language === 'fr' ? 'Quelle est votre garantie et politique de retour ?' : 'What is your warranty and return policy?' },
    { id: 'advisor', icon: '💬', label: language === 'fr' ? 'Parler à un conseiller' : 'Talk to agent', question: language === 'fr' ? 'Bonjour, je souhaite échanger directement avec un conseiller commercial.' : 'Hello, I would like to speak directly with an agent.' },
  ];

  return (
    <div className="px-3 py-1.5 bg-zinc-100/90 dark:bg-[#182229] border-t border-zinc-200/90 dark:border-zinc-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 shrink-0 flex items-center gap-1 pr-1 border-r border-zinc-300 dark:border-zinc-700">
        <Sparkles className="w-3 h-3 text-emerald-600" />
        <span>Business</span>
      </span>

      {quickActions.map((qa) => (
        <button
          key={qa.id}
          type="button"
          onClick={() => {
            if (qa.action) {
              qa.action();
            } else if (qa.question) {
              onSelectQuickReply(qa.question);
            }
          }}
          className="px-2.5 py-1 rounded-full bg-white dark:bg-[#202c33] hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 text-[11px] font-semibold whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer shrink-0 shadow-2xs hover:border-emerald-500"
        >
          <span>{qa.icon}</span>
          <span>{qa.label}</span>
        </button>
      ))}
    </div>
  );
};
