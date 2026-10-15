import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Truck, RotateCcw, CheckCircle2 } from 'lucide-react';

interface HeroBannerProps {
  onExploreClick: () => void;
  onOpenAbout: () => void;
  language: 'fr' | 'en';
}

const translations = {
  fr: {
    kicker: "Sélection Officielle Choice · Direct Usine",
    title: "Sélection exclusive SoryOS boutique en ligne.",
    exploreBtn: "Découvrir la sélection",
    aboutBtn: "Comprendre SoryOS",
    trust1Title: "Livraison Offerte",
    trust1Sub: "Dès 20 € d'achats Choice",
    trust2Title: "Protection 90j",
    trust2Sub: "Remboursement garanti",
    trust3Title: "Retours 15j",
    trust3Sub: "Étiquette locale sans frais",
    badge: "Audité & Certifié Choice",
    ecosystem: "Écosystème SoryOS Boutique en Ligne",
    shippingInfo: "Expédition internationale optimisée & Dédouanement inclus",
    deliveryTime: "5 - 8 Jours",
    delaySub: "Délai moyen constaté"
  },
  en: {
    kicker: "Official Choice Selection · Factory Direct",
    title: "Exclusive SoryOS online store selection.",
    exploreBtn: "Explore Selection",
    aboutBtn: "About SoryOS",
    trust1Title: "Free Delivery",
    trust1Sub: "From €20 Choice purchases",
    trust2Title: "90-Day Protection",
    trust2Sub: "Guaranteed refund",
    trust3Title: "15-Day Returns",
    trust3Sub: "Free local return label",
    badge: "Audited & Certified Choice",
    ecosystem: "SoryOS Online Store Ecosystem",
    shippingInfo: "Optimized international shipping & customs included",
    deliveryTime: "5 - 8 Days",
    delaySub: "Average delivery time"
  }
};

export const HeroBanner: React.FC<HeroBannerProps> = ({ onExploreClick, onOpenAbout, language }) => {
  const [imageError, setImageError] = useState(false);
  const t = translations[language] || translations.fr;

  return (
    <section className="relative overflow-hidden bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Left Text Column */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
            {/* Top Kicker Box */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 dark:bg-orange-950/40 border border-orange-200/80 dark:border-orange-800/60 rounded-full w-fit mb-4">
              <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
              <span className="text-xs font-bold text-orange-800 dark:text-orange-300 tracking-wide uppercase">
                {t.kicker}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-white text-balance leading-[1.15] mb-7">
              {t.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3.5 mb-8">
              <button
                onClick={onExploreClick}
                className="inline-flex items-center gap-2.5 px-6 py-3 text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl transition-all cursor-pointer shadow-md shadow-orange-600/20 active:scale-98"
              >
                <span>{t.exploreBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenAbout}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl transition-colors cursor-pointer border border-transparent dark:border-zinc-700/60"
              >
                {t.aboutBtn}
              </button>
            </div>

            {/* 3 Trust Strip Cards */}
            <div className="grid grid-cols-3 gap-2.5 pt-6 border-t border-zinc-100 dark:border-zinc-800/80">
              <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800 rounded-xl">
                <Truck className="w-4 h-4 text-orange-600 dark:text-orange-500 mb-1" />
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block">{t.trust1Title}</span>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400">{t.trust1Sub}</span>
              </div>
              <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-orange-600 dark:text-orange-500 mb-1" />
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block">{t.trust2Title}</span>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400">{t.trust2Sub}</span>
              </div>
              <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800 rounded-xl">
                <RotateCcw className="w-4 h-4 text-orange-600 dark:text-orange-500 mb-1" />
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block">{t.trust3Title}</span>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400">{t.trust3Sub}</span>
              </div>
            </div>

          </div>

          {/* Right Image Showcase Box */}
          <div className="lg:col-span-6 relative rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-md bg-zinc-100 dark:bg-zinc-900 min-h-[340px] lg:min-h-[460px] flex items-center justify-center group">
            {!imageError ? (
              <img
                src="/src/assets/images/hero_marketplace_showcase_1791748501665.jpg"
                alt="Showcase produits et marketplace SoryOS boutique en ligne"
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover lg:absolute lg:inset-0 transition-transform duration-700 ease-out group-hover:scale-104"
              />
            ) : (
              <div className="p-8 text-center text-zinc-500 dark:text-zinc-400">
                <p className="font-semibold text-zinc-800 dark:text-zinc-200 mb-1">Showcase Produits Usine</p>
                <p className="text-xs">Matériel sélectionné & certifié SoryOS Choice</p>
              </div>
            )}
            
            {/* Top-Right Floating Choice Badge */}
            <div className="absolute top-4 right-4 bg-zinc-950/85 dark:bg-zinc-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 dark:border-zinc-700 text-xs text-white shadow-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-orange-400" />
              <span className="font-semibold">{t.badge}</span>
            </div>

            {/* Bottom Floating Stats Box */}
            <div className="absolute bottom-4 inset-x-4 sm:inset-x-6 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-orange-600 dark:text-orange-400 block">
                  {t.ecosystem}
                </span>
                <span className="text-xs sm:text-sm font-bold text-zinc-950 dark:text-zinc-100 block">
                  {t.shippingInfo}
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-base sm:text-lg font-black font-mono text-zinc-950 dark:text-white block tabular-nums">
                  {t.deliveryTime}
                </span>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block">{t.delaySub}</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
