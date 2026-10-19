import React, { useState } from 'react';
import { X, Search, CheckCircle2, Clock, Plane, Truck, Package, MapPin } from 'lucide-react';
import { Order } from '../types';
import { generateOrderReceiptPDF } from '../utils/pdfGenerator';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  recentOrders: Order[];
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  recentOrders,
}) => {
  const defaultTracking = recentOrders.length > 0
    ? recentOrders[0].trackingNumber
    : 'ALY-FR-48921045';

  const [inputCode, setInputCode] = useState(defaultTracking);
  const [activeTracking, setActiveTracking] = useState(defaultTracking);

  const trackingSteps = [
    {
      title: 'Commande validée & Traitée',
      location: 'Hub Logistique International de Shenzhen',
      time: 'Il y a 3 jours · 08:30',
      done: true,
      icon: Package,
    },
    {
      title: 'Dédouanement export réussi',
      location: 'Aéroport International de Hong Kong',
      time: 'Il y a 2 jours · 14:15',
      done: true,
      icon: CheckCircle2,
    },
    {
      title: 'Vol cargo international & Arrivée en Europe',
      location: 'Hub Cargo Paris CDG',
      time: 'Hier · 22:40',
      done: true,
      icon: Plane,
    },
    {
      title: 'Pris en charge par le transporteur local (Colissimo / Chronopost)',
      location: 'Centre de tri régional',
      time: "Aujourd'hui · 06:12",
      done: true,
      icon: Truck,
    },
    {
      title: 'En cours de distribution au destinataire',
      location: 'Véhicule de livraison',
      time: 'Livraison prévue avant 18h00',
      done: false,
      icon: MapPin,
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      setActiveTracking(inputCode.trim().toUpperCase());
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden my-6 transition-colors">
        
        {/* Header */}
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900 transition-colors">
          <div>
            <h3 className="font-bold text-zinc-950 dark:text-zinc-100 text-base">Suivi de Colis en Temps Réel</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Réseau logistique SoryOS Global Express</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Tracking Search Input */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Ex : ALY-FR-48921045"
                className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg font-mono uppercase focus:outline-none focus:border-orange-500 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-zinc-950 dark:bg-orange-600 hover:bg-zinc-800 dark:hover:bg-orange-500 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              Suivre
            </button>
          </form>

          {/* Current Package Overview */}
          <div className="p-4 bg-orange-50/70 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/40 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-orange-800 dark:text-orange-300 uppercase tracking-wide block">
                Colis Express Choice
              </span>
              <span className="font-mono text-sm font-bold text-zinc-950 dark:text-white tabular-nums">
                {activeTracking}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/60 border border-emerald-300/40 dark:border-emerald-800/40 px-2 py-0.5 rounded">
                En transit accéléré
              </span>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block mt-0.5">Délai estimé 5–8j</span>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-200 dark:before:bg-zinc-800">
            {trackingSteps.map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <div key={idx} className="relative flex items-start gap-4">
                  <div
                    className={`absolute -left-6 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-zinc-900 ${
                      step.done
                        ? 'bg-orange-600 text-white'
                        : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                    }`}
                  >
                    <StepIcon className="w-3 h-3" />
                  </div>

                  <div className="flex-1">
                    <p className={`text-xs font-bold ${step.done ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 dark:text-zinc-400'}`}>
                      {step.title}
                    </p>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-300 mt-0.5">{step.location}</p>
                    <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-mono mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{step.time}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 text-center space-y-3">
            {recentOrders.find(o => o.trackingNumber === activeTracking) && (
              <button
                onClick={() => {
                  const order = recentOrders.find(o => o.trackingNumber === activeTracking);
                  if (order) generateOrderReceiptPDF(order);
                }}
                className="w-full py-2.5 px-4 text-sm font-semibold text-zinc-900 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-white rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Package className="w-4 h-4" />
                Télécharger le reçu (PDF)
              </button>
            )}
            <button
              onClick={onClose}
              className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 underline cursor-pointer"
            >
              Fermer la fenêtre de suivi
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
