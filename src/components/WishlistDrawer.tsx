import React, { useState } from 'react';
import { X, Heart, ShoppingBag, Trash2, Share2, Plus, Edit3, Check, FolderHeart, Link2 } from 'lucide-react';
import { Product, CurrencyCode, WishlistItemMeta } from '../types';
import { formatPrice } from '../data/products';
import { getTranslation, Language } from '../i18n/translations';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  wishlistMetas: WishlistItemMeta[];
  onUpdateWishlistMeta: (productId: string, listName: string, note: string) => void;
  currency: CurrencyCode;
  onRemoveFromWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onShowToast: (msg: string) => void;
  language: Language;
}

const DEFAULT_LISTS = ['Favoris Principaux', 'Appartement & Déco', 'Idées Cadeaux', 'Tech & Setup'];

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  wishlistMetas,
  onUpdateWishlistMeta,
  currency,
  onRemoveFromWishlist,
  onAddToCart,
  onShowToast,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<string>('Favoris Principaux');
  const [customLists, setCustomLists] = useState<string[]>([]);
  const [newListName, setNewListName] = useState('');
  const [showAddListInput, setShowAddListInput] = useState(false);
  const [editingNoteProductId, setEditingNoteProductId] = useState<string | null>(null);
  const [tempNoteText, setTempNoteText] = useState('');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const allLists = [...DEFAULT_LISTS, ...customLists];

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    const name = newListName.trim();
    if (!allLists.includes(name)) {
      setCustomLists([...customLists, name]);
      setActiveTab(name);
      onShowToast(language === 'fr' ? `Liste "${name}" créée avec succès !` : `List "${name}" created successfully!`);
    }
    setNewListName('');
    setShowAddListInput(false);
  };

  const currentListProducts = wishlistProducts.filter((product) => {
    const meta = wishlistMetas.find((m) => m.productId === product.id);
    const listName = meta ? meta.listName : 'Favoris Principaux';
    return listName === activeTab;
  });

  const getProductMeta = (productId: string) => {
    return wishlistMetas.find((m) => m.productId === productId);
  };

  const handleCopyShareLink = () => {
    const shareUrl = `${window.location.origin}/?wishlist=${encodeURIComponent(activeTab)}`;
    navigator.clipboard.writeText(shareUrl);
    setShareCopied(true);
    onShowToast(language === 'fr' ? `Lien de partage de la liste "${activeTab}" copié !` : `Share link for list "${activeTab}" copied!`);
    setTimeout(() => setShareCopied(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200 border-l border-transparent dark:border-zinc-800 transition-colors">
        
        {/* Header */}
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h2 className="text-lg font-bold text-zinc-950 dark:text-zinc-100">{getTranslation(language, 'yourWishlists')}</h2>
            <span className="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2 py-0.5 rounded-full font-mono font-bold tabular-nums">
              {wishlistProducts.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {wishlistProducts.length > 0 && (
              <button
                onClick={() => setShareModalOpen(true)}
                title={getTranslation(language, 'shareList')}
                className="p-2 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">{getTranslation(language, 'shareList')}</span>
              </button>
            )}
            <button
              onClick={onClose}
              aria-label={getTranslation(language, 'close')}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Thematic Lists Tabs */}
        <div className="px-5 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/50 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
          {allLists.map((listName) => {
            const count = wishlistProducts.filter((p) => {
              const m = wishlistMetas.find((meta) => meta.productId === p.id);
              return (m ? m.listName : 'Favoris Principaux') === listName;
            }).length;

            return (
              <button
                key={listName}
                onClick={() => setActiveTab(listName)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === listName
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:border-orange-300'
                }`}
              >
                <FolderHeart className="w-3.5 h-3.5" />
                <span>{listName}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${activeTab === listName ? 'bg-orange-700 text-white' : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300'}`}>
                  {count}
                </span>
              </button>
            );
          })}

          {!showAddListInput ? (
            <button
              onClick={() => setShowAddListInput(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap bg-zinc-200/70 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors cursor-pointer flex items-center gap-1 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{getTranslation(language, 'newList')}</span>
            </button>
          ) : (
            <form onSubmit={handleCreateList} className="flex items-center gap-1 shrink-0">
              <input
                type="text"
                autoFocus
                placeholder={getTranslation(language, 'listNamePlaceholder')}
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className="px-2.5 py-1 text-xs bg-white dark:bg-zinc-800 border border-orange-500 rounded-lg text-zinc-900 dark:text-white focus:outline-none w-36"
              />
              <button
                type="submit"
                className="p-1 bg-orange-600 text-white rounded-lg hover:bg-orange-700 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-subtle">
          {currentListProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 text-zinc-400 dark:text-zinc-500">
              <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center mb-4 text-rose-400">
                <Heart className="w-8 h-8" />
              </div>
              <p className="text-zinc-900 dark:text-zinc-100 font-semibold mb-1">
                {language === 'fr' ? `Aucun article dans "${activeTab}"` : `No items in "${activeTab}"`}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mb-6">
                {getTranslation(language, 'emptyWishlist')}
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-white bg-zinc-950 dark:bg-orange-600 rounded-lg hover:bg-zinc-800 dark:hover:bg-orange-500 transition-colors cursor-pointer"
              >
                {getTranslation(language, 'continueShopping')}
              </button>
            </div>
          ) : (
            currentListProducts.map((product) => {
              const meta = getProductMeta(product.id);
              const note = meta?.note || '';
              const isEditing = editingNoteProductId === product.id;

              return (
                <div
                  key={product.id}
                  className="flex flex-col gap-3 p-3.5 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/40 transition-all shadow-2xs"
                >
                  <div className="flex gap-3.5 items-center justify-between">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shrink-0"
                    />

                    <div className="flex-1 min-w-0 pr-2">
                      <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        {product.categoryLabel}
                      </p>
                      <p className="text-xs font-bold font-mono text-zinc-950 dark:text-white mt-1 tabular-nums">
                        {formatPrice(product.priceEUR, currency)}
                      </p>
                    </div>

                    <div className="flex flex-col gap-1.5 shrink-0">
                      <button
                        onClick={() => {
                          onAddToCart(product);
                          onRemoveFromWishlist(product.id);
                        }}
                        title={language === 'fr' ? 'Déplacer vers le panier' : 'Move to cart'}
                        className="p-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition-colors cursor-pointer shadow-xs active:scale-95"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onRemoveFromWishlist(product.id)}
                        title={getTranslation(language, 'remove')}
                        className="p-2 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 border border-zinc-200 dark:border-zinc-700 rounded-xl transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Personal Note Box */}
                  <div className="pt-2.5 border-t border-zinc-200/70 dark:border-zinc-700 text-xs">
                    {isEditing ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder={getTranslation(language, 'notePlaceholder')}
                          value={tempNoteText}
                          onChange={(e) => setTempNoteText(e.target.value)}
                          className="flex-1 px-2.5 py-1 text-xs bg-white dark:bg-zinc-900 border border-orange-500 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none"
                        />
                        <button
                          onClick={() => {
                            onUpdateWishlistMeta(product.id, activeTab, tempNoteText);
                            setEditingNoteProductId(null);
                          }}
                          className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold cursor-pointer"
                        >
                          {getTranslation(language, 'save')}
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-300">
                        <span className="italic text-[11px] truncate max-w-[280px]">
                          {note ? `Note : "${note}"` : (language === 'fr' ? 'Aucune note personnelle' : 'No personal note')}
                        </span>
                        <button
                          onClick={() => {
                            setEditingNoteProductId(product.id);
                            setTempNoteText(note);
                          }}
                          className="text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 font-semibold text-[11px] cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>{note ? (language === 'fr' ? 'Modifier' : 'Edit') : (language === 'fr' ? 'Ajouter une note' : 'Add note')}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 pt-1">
                    <span>{getTranslation(language, 'moveToList')}</span>
                    <select
                      value={activeTab}
                      onChange={(e) => {
                        onUpdateWishlistMeta(product.id, e.target.value, note);
                        onShowToast(language === 'fr' ? `Article déplacé vers "${e.target.value}"` : `Item moved to "${e.target.value}"`);
                      }}
                      className="px-2 py-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none font-medium cursor-pointer"
                    >
                      {allLists.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {shareModalOpen && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 max-w-sm w-full border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-zinc-950 dark:text-white flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-orange-600" />
                  <span>{language === 'fr' ? `Partager la liste "${activeTab}"` : `Share list "${activeTab}"`}</span>
                </h3>
                <button
                  onClick={() => setShareModalOpen(false)}
                  className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {language === 'fr' ? 'Partagez ce lien unique avec vos proches (anniversaire, mariage, cadeaux groupés).' : 'Share this unique link with family or friends for birthdays, group gifting or wishlists.'}
              </p>
              <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono text-zinc-600 dark:text-zinc-300 truncate">
                  {window.location.origin}/?wishlist={encodeURIComponent(activeTab)}
                </span>
                <button
                  onClick={handleCopyShareLink}
                  className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-lg shrink-0 cursor-pointer flex items-center gap-1 shadow-xs"
                >
                  <Link2 className="w-3.5 h-3.5" />
                  <span>{shareCopied ? (language === 'fr' ? 'Copié !' : 'Copied!') : (language === 'fr' ? 'Copier' : 'Copy')}</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
