import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Headphones } from 'lucide-react';

interface FooterProps {
  onOpenTracker: () => void;
  onOpenAbout: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenTracker, onOpenAbout }) => {
  return (
    <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 mt-16 transition-colors">
      {/* 4 Pillars Strip with elevated boxes */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-zinc-100 dark:border-zinc-850">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-xs">
          
          <div className="flex items-start gap-3.5 p-4 bg-zinc-50/80 dark:bg-zinc-900/80 border border-zinc-200/70 dark:border-zinc-800 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-850 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-2xs">
            <div className="p-2.5 bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 rounded-xl shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-zinc-950 dark:text-white mb-0.5 text-xs">Livraison Choice Accélérée</h5>
              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-[11px]">Expédition prioritaire sous 24h et livraison suivie sous 5 à 8 jours ouvrés.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 bg-zinc-50/80 dark:bg-zinc-900/80 border border-zinc-200/70 dark:border-zinc-800 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-850 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-2xs">
            <div className="p-2.5 bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 rounded-xl shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-zinc-950 dark:text-white mb-0.5 text-xs">Protection Acheteur 90 Jours</h5>
              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-[11px]">Remboursement intégral garanti en cas de colis non reçu, endommagé ou non conforme.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 bg-zinc-50/80 dark:bg-zinc-900/80 border border-zinc-200/70 dark:border-zinc-800 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-850 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-2xs">
            <div className="p-2.5 bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 rounded-xl shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-zinc-950 dark:text-white mb-0.5 text-xs">Retours Gratuits 15 Jours</h5>
              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-[11px]">Étiquette prépayée de retour local fournie automatiquement sans justification requise.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 bg-zinc-50/80 dark:bg-zinc-900/80 border border-zinc-200/70 dark:border-zinc-800 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-850 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-2xs">
            <div className="p-2.5 bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 rounded-xl shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-zinc-950 dark:text-white mb-0.5 text-xs">Support Client Dédié</h5>
              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-[11px]">Assistance 24/7 au <strong className="font-mono text-zinc-700 dark:text-zinc-300">621 09 03 88</strong> (WhatsApp & Téléphone).</p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Footer Links & Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400">
        <div className="flex items-center gap-6">
          <button onClick={onOpenAbout} className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors cursor-pointer font-medium">
            À propos de SoryOS boutique en ligne
          </button>
          <button onClick={onOpenTracker} className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors cursor-pointer font-medium">
            Suivi de commande
          </button>
          <span className="text-zinc-400 dark:text-zinc-500">Paiements sécurisés SSL</span>
          <span className="text-zinc-400 dark:text-zinc-500">Programme Choice Partenaires</span>
        </div>

        <p className="text-zinc-400 dark:text-zinc-500 font-mono text-[11px]">
          © {new Date().getFullYear()} SoryOS boutique en ligne. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
};
