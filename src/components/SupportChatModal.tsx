import React, { useState } from 'react';
import { X, Send, Bot, Sparkles, Loader2, ShoppingBag, Eye, Check, AlertTriangle, Star, ArrowRight } from 'lucide-react';
import { Product, CurrencyCode } from '../types';
import { formatPrice } from '../data/products';

interface SupportChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  currency: CurrencyCode;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  selectedCategory: string;
  cartCount: number;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  products?: Product[];
  suggestedQuestions?: string[];
}

export const SupportChatModal: React.FC<SupportChatModalProps> = ({
  isOpen,
  onClose,
  products,
  currency,
  onAddToCart,
  onSelectProduct,
  selectedCategory,
  cartCount,
}) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'bot',
      text: "Bonjour ! Je suis SoryBot, votre assistant d'achat intelligent officiel de SoryOS boutique en ligne.\n\nJe peux analyser notre catalogue, vous expliquer les caractéristiques et matières de chaque article en détail et faire apparaître les cartes produits uniquement lorsque vous le demandez. Que souhaitez-vous découvrir ?",
      timestamp: 'À l’instant',
      products: [],
      suggestedQuestions: [
        'Montre-moi les serviettes et rideaux',
        'Quels sont les articles en stock limité ?',
        'Conseille-moi un caftan traditionnel',
        'Quels articles tech sont disponibles ?',
      ],
    },
  ]);

  const handleAddFromChat = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setAddedItemIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1600);
  };

  const handleSend = async (textToSend?: string) => {
    const question = textToSend || input.trim();
    if (!question || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: question,
      timestamp: 'À l’instant',
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      // Send compact catalog context and page context so the assistant reads the whole shop
      const compactCatalog = products.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        categoryLabel: p.categoryLabel,
        priceEUR: p.priceEUR,
        originalPriceEUR: p.originalPriceEUR,
        stockQuantity: p.stockQuantity,
        isChoice: p.isChoice,
        description: p.description,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: question,
          history: messages.slice(-6),
          catalogContext: compactCatalog,
          pageContext: {
            selectedCategory,
            cartCount,
            currency,
          },
        }),
      });

      const data = await res.json();
      const botText = data.reply || data.error || "Désolé, je n'ai pas pu générer de réponse.";
      
      // Match returned product IDs to actual rich Product objects
      let matchedProducts: Product[] = [];
      if (Array.isArray(data.productIds) && data.productIds.length > 0) {
        matchedProducts = products.filter((p) => data.productIds.includes(p.id));
      }

      // If no productIds returned by model but user explicitly asked for products, run client matcher
      if (matchedProducts.length === 0) {
        const lowerQ = question.toLowerCase();
        const asksForProducts = lowerQ.includes('montre') || lowerQ.includes('voir') || lowerQ.includes('article') || lowerQ.includes('produit') || lowerQ.includes('serviette') || lowerQ.includes('caftan') || lowerQ.includes('rideau') || lowerQ.includes('lit') || lowerQ.includes('tech') || lowerQ.includes('audio') || lowerQ.includes('drone') || lowerQ.includes('casque') || lowerQ.includes('sac') || lowerQ.includes('café') || lowerQ.includes('coffret') || lowerQ.includes('clavier') || lowerQ.includes('stock');
        
        if (asksForProducts) {
          if (lowerQ.includes('serviette') || lowerQ.includes('bain')) {
            matchedProducts = products.filter((p) => p.id === 'aly-towel-set');
          } else if (lowerQ.includes('caftan') || lowerQ.includes('robe') || lowerQ.includes('soie')) {
            matchedProducts = products.filter((p) => p.id === 'aly-silk-caftan');
          } else if (lowerQ.includes('rideau') || lowerQ.includes('barre')) {
            matchedProducts = products.filter((p) => ['aly-curtains-linen', 'aly-curtain-rod'].includes(p.id));
          } else if (lowerQ.includes('lit') || lowerQ.includes('couette') || lowerQ.includes('drap')) {
            matchedProducts = products.filter((p) => ['aly-duvet-set', 'aly-towel-set'].includes(p.id));
          } else if (lowerQ.includes('stock') || lowerQ.includes('urgence') || lowerQ.includes('limité')) {
            matchedProducts = products.filter((p) => typeof p.stockQuantity === 'number' && p.stockQuantity < 5);
          } else if (lowerQ.includes('tech') || lowerQ.includes('audio') || lowerQ.includes('casque')) {
            matchedProducts = products.filter((p) => ['aly-anc-900', 'aly-acoustic-cyl', 'aly-drone-4k'].includes(p.id));
          }
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: botText,
          timestamp: 'À l’instant',
          products: matchedProducts,
          suggestedQuestions: data.suggestedQuestions || [],
        },
      ]);
    } catch (err: any) {
      console.error('Erreur API Chat:', err);
      const lowerQ = question.toLowerCase();
      let matched: Product[] = [];
      const asksForProducts = lowerQ.includes('montre') || lowerQ.includes('voir') || lowerQ.includes('article') || lowerQ.includes('produit') || lowerQ.includes('serviette') || lowerQ.includes('caftan') || lowerQ.includes('rideau');
      if (asksForProducts) {
        matched = products.filter((p) =>
          ['aly-towel-set', 'aly-curtains-linen', 'aly-silk-caftan'].includes(p.id)
        );
      }
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: "Je suis à votre écoute ! Posez-moi vos questions sur nos articles ou notre service (livraison Choice en 5 à 8 jours, retours offerts).",
          timestamp: 'À l’instant',
          products: matched,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col h-[650px] max-h-[92vh] transition-colors">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-2xl backdrop-blur-md flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base tracking-tight">SoryBot · Concierge Officiel SoryOS</h3>
                <span className="text-[10px] bg-white/25 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                  <Sparkles className="w-2.5 h-2.5" />
                  Gemini IA Connecté
                </span>
              </div>
              <p className="text-[11px] text-orange-100 flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Analyse la page en direct · Recommande et affiche les cartes de vos articles</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Fermer l'assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/70 dark:bg-zinc-950/80 scrollbar-subtle transition-colors">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'bot' && (
                <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center text-xs shrink-0 font-bold shadow-xs mt-1">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}

              <div
                className={`max-w-[88%] sm:max-w-[82%] rounded-2xl p-4 text-xs leading-relaxed space-y-3 ${
                  msg.sender === 'user'
                    ? 'bg-zinc-950 dark:bg-orange-600 text-white rounded-br-xs shadow-sm ml-auto'
                    : 'bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border border-zinc-200/90 dark:border-zinc-800 shadow-xs rounded-bl-xs'
                }`}
              >
                {/* Message Text Explanation */}
                <div className="whitespace-pre-wrap leading-relaxed text-xs sm:text-[13px]">
                  {msg.text}
                </div>

                {/* Interactive Embedded Product Cards Rail */}
                {msg.products && msg.products.length > 0 && (
                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center justify-between text-[11px] font-bold text-zinc-500 dark:text-zinc-400 mb-2">
                      <span className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                        <Sparkles className="w-3 h-3" />
                        <span>Articles recommandés ({msg.products.length}) :</span>
                      </span>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500">Glissez pour voir</span>
                    </div>

                    <div className="flex items-stretch gap-3 overflow-x-auto scroll-smooth scrollbar-subtle py-1 -mx-1 px-1">
                      {msg.products.map((p) => {
                        const isLow = typeof p.stockQuantity === 'number' && p.stockQuantity < 5;
                        const isAdded = !!addedItemIds[p.id];
                        const discountPercent = Math.round(
                          ((p.originalPriceEUR - p.priceEUR) / p.originalPriceEUR) * 100
                        );

                        return (
                          <div
                            key={p.id}
                            onClick={() => onSelectProduct(p)}
                            className="w-[210px] sm:w-[230px] shrink-0 bg-zinc-50 dark:bg-zinc-800/80 hover:bg-orange-50/20 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-orange-400/80 dark:hover:border-orange-500 rounded-2xl p-2.5 flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-2xs group"
                          >
                            {/* Card Media with Badges */}
                            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-zinc-200 dark:bg-zinc-700 mb-2">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                loading="lazy"
                              />
                              <div className="absolute top-1.5 left-1.5 flex flex-col gap-1">
                                {p.isChoice && (
                                  <span className="bg-orange-600 text-white text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded shadow-xs">
                                    Choice
                                  </span>
                                )}
                                {isLow && (
                                  <span className="bg-rose-600 text-white text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded shadow-xs flex items-center gap-0.5 animate-pulse">
                                    <AlertTriangle className="w-2 h-2" />
                                    <span>Stock: {p.stockQuantity}</span>
                                  </span>
                                )}
                              </div>
                              {discountPercent > 0 && (
                                <span className="absolute bottom-1.5 right-1.5 bg-zinc-950/80 dark:bg-zinc-900/90 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                                  -{discountPercent}%
                                </span>
                              )}
                            </div>

                            {/* Card Details */}
                            <div className="mb-2">
                              <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider block truncate">
                                {p.categoryLabel}
                              </span>
                              <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 line-clamp-2 leading-tight group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors mt-0.5">
                                {p.name}
                              </h4>
                              <div className="flex items-center gap-1.5 mt-1 text-[11px]">
                                <div className="flex items-center text-amber-500 font-bold">
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-0.5" />
                                  <span>{p.rating}</span>
                                </div>
                                <span className="text-zinc-300 dark:text-zinc-600">·</span>
                                <span className="text-zinc-400 dark:text-zinc-500 text-[10px]">{p.salesCount} vendus</span>
                              </div>
                            </div>

                            {/* Price & Action Buttons */}
                            <div className="pt-2 border-t border-zinc-200/80 dark:border-zinc-700/80 mt-auto">
                              <div className="flex items-baseline gap-1.5 mb-2">
                                <span className="text-sm font-extrabold font-mono text-zinc-950 dark:text-white tabular-nums">
                                  {formatPrice(p.priceEUR, currency)}
                                </span>
                                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 line-through font-mono tabular-nums">
                                  {formatPrice(p.originalPriceEUR, currency)}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-1.5">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectProduct(p);
                                  }}
                                  className="px-2 py-1.5 bg-white dark:bg-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-650 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-600 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                                >
                                  <Eye className="w-3 h-3 text-zinc-500 dark:text-zinc-400" />
                                  <span>Détails</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={(e) => handleAddFromChat(p, e)}
                                  className={`px-2 py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-xs ${
                                    isAdded
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-zinc-950 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-500 text-white active:scale-95'
                                  }`}
                                >
                                  {isAdded ? (
                                    <>
                                      <Check className="w-3 h-3" />
                                      <span>Ajouté !</span>
                                    </>
                                  ) : (
                                    <>
                                      <ShoppingBag className="w-3 h-3 text-orange-400 dark:text-white" />
                                      <span>Panier</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Suggested Follow-up Questions Chips */}
                {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {msg.suggestedQuestions.map((sq, sqIdx) => (
                      <button
                        key={sqIdx}
                        type="button"
                        onClick={() => handleSend(sq)}
                        className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 hover:bg-orange-100 dark:hover:bg-orange-900/60 text-orange-800 dark:text-orange-300 border border-orange-200/80 dark:border-orange-800/60 cursor-pointer transition-colors flex items-center gap-1"
                      >
                        <span>{sq}</span>
                        <ArrowRight className="w-2.5 h-2.5 text-orange-600 dark:text-orange-400" />
                      </button>
                    ))}
                  </div>
                )}

                <span
                  className={`text-[10px] block mt-1 ${
                    msg.sender === 'user' ? 'text-zinc-400 dark:text-orange-200 text-right' : 'text-zinc-400 dark:text-zinc-500'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex items-center gap-2.5 text-xs text-zinc-600 dark:text-zinc-300 bg-white dark:bg-zinc-900 p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs w-fit animate-in fade-in">
              <Loader2 className="w-4 h-4 text-orange-600 dark:text-orange-500 animate-spin" />
              <div className="flex flex-col">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">SoryBot analyse le catalogue...</span>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500">Recherche des meilleurs articles et explications détaillées</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Form Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 sm:p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex gap-2 transition-colors"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Posez votre question (ex: 'Montre-moi des rideaux et des serviettes', 'Articles < 20€')..."
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white rounded-2xl cursor-pointer transition-all active:scale-95 flex items-center justify-center shadow-xs"
            aria-label="Envoyer"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>

      </div>
    </div>
  );
};
