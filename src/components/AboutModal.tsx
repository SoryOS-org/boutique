import React from 'react';
import { X, Check, ShieldCheck, Truck, Factory, Globe } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/60">
          <div>
            <h3 className="font-bold text-zinc-950 dark:text-white text-base">À Propos de SoryOS boutique en ligne</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Histoire, modèle économique et garanties d'achat</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-zinc-700 dark:text-zinc-300 text-xs sm:text-sm leading-relaxed">
          
          <div>
            <h4 className="font-bold text-zinc-950 dark:text-white mb-2 flex items-center gap-2">
              <Globe className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <span>SoryOS boutique en ligne : la vente directe fabricant réinventée</span>
            </h4>
            <p className="text-zinc-600 dark:text-zinc-400">
              <strong>SoryOS boutique en ligne</strong> connecte directement les consommateurs aux meilleurs fabricants et ateliers certifiés. En éliminant les intermédiaires superflus, nous vous offrons des produits de haute qualité à prix d'usine avec une logistique suivie et des garanties d'achat complètes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl border border-zinc-200/80 dark:border-zinc-700/60">
              <div className="flex items-center gap-2 text-zinc-950 dark:text-white font-bold mb-1.5 text-xs">
                <Factory className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <span>Modèle Direct Fabricant</span>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 text-xs">
                En supprimant les distributeurs multiples, les prix sont souvent 50% à 70% inférieurs aux tarifs des boutiques traditionnelles.
              </p>
            </div>

            <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl border border-zinc-200/80 dark:border-zinc-700/60">
              <div className="flex items-center gap-2 text-zinc-950 dark:text-white font-bold mb-1.5 text-xs">
                <Truck className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <span>Le Programme Choice</span>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 text-xs">
                AliExpress gère directement la logistique et l’emballage des produits labellisés <em>Choice</em>, assurant des délais rapides de 5 à 8 jours en Europe.
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-zinc-950 dark:text-white mb-2.5 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <span>Les garanties clés de SoryOS boutique en ligne :</span>
            </h4>
            <ul className="space-y-2 text-zinc-600 dark:text-zinc-400 text-xs">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Catalogue sélectionné Choice :</strong> Produits électroniques et lifestyle avec vérification de conformité usine.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Conversion multidevise en temps réel :</strong> Affichage instantané en Euros (€), Dollars ($), Francs CFA (FCFA) ou Dollars Canadiens (CA$).</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Suivi de commande transparent :</strong> Visualisation des étapes logistiques de Shenzhen jusqu’au domicile.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Protection acheteur 90 jours :</strong> Remboursement garanti si l'article n'arrive pas ou est non conforme.</span>
              </li>
            </ul>
          </div>

          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-zinc-950 dark:bg-orange-600 hover:bg-zinc-800 dark:hover:bg-orange-500 rounded-xl transition-colors cursor-pointer"
            >
              Découvrir les offres de la boutique
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
