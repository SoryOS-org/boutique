import React, { useState } from 'react';
import { X, Search, CheckCircle2, Clock, Plane, Truck, Package, MapPin, AlertCircle, ShoppingBag } from 'lucide-react';
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
  const initialTracking = recentOrders.length > 0 ? recentOrders[0].trackingNumber : '';
  const [inputCode, setInputCode] = useState(initialTracking);
  const [activeTracking, setActiveTracking] = useState(initialTracking);

  const matchedOrder = recentOrders.find(
    (o) =>
      o.trackingNumber.toUpperCase() === activeTracking.toUpperCase() ||
      o.id.toUpperCase() === activeTracking.toUpperCase()
  );

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
            <h3 className="font-bold text-zinc-950 dark:text-zinc-100 text-base">Suivi de Colis & Commandes Réelles</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Réseau logistique et commandes validées SoryOS</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg cursor-pointer"
            aria-label="Fermer"
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
                placeholder="Entrez votre numéro (ex : ALY-FR-... ou ORD-...)"
                className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg font-mono uppercase focus:outline-none focus:border-orange-500 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-zinc-950 dark:bg-orange-600 hover:bg-zinc-800 dark:hover:bg-orange-500 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              Rechercher
            </button>
          </form>

          {/* Quick selector of real user orders */}
          {recentOrders.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-subtle">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider shrink-0">Mes commandes :</span>
              {recentOrders.map((o) => (
                <button
                  key={o.id}
                  onClick={() => {
                    setInputCode(o.trackingNumber);
                    setActiveTracking(o.trackingNumber);
                  }}
                  className={`px-2.5 py-1 text-xs font-mono rounded-lg border transition-all shrink-0 cursor-pointer ${
                    activeTracking === o.trackingNumber
                      ? 'bg-orange-600 text-white border-orange-600'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
                  }`}
                >
                  {o.id} ({o.trackingNumber.slice(0, 10)}...)
                </button>
              ))}
            </div>
          )}

          {/* If a real matched order exists */}
          {matchedOrder ? (
            <div className="space-y-5">
              {/* Current Package Overview */}
              <div className="p-4 bg-orange-50/70 dark:bg-orange-950/30 border border-orange-200/80 dark:border-orange-900/40 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-orange-800 dark:text-orange-300 uppercase tracking-wide block">
                    Commande {matchedOrder.id}
                  </span>
                  <span className="font-mono text-sm font-bold text-zinc-950 dark:text-white tabular-nums">
                    {matchedOrder.trackingNumber}
                  </span>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block mt-0.5">
                    Destinataire : {matchedOrder.customer.fullName} · {matchedOrder.customer.city}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/60 border border-emerald-300/40 dark:border-emerald-800/40 px-2.5 py-1 rounded-md capitalize">
                    {matchedOrder.status === 'processing' && 'En préparation'}
                    {matchedOrder.status === 'shipped' && 'Expédié'}
                    {matchedOrder.status === 'customs' && 'En dédouanement'}
                    {matchedOrder.status === 'out_for_delivery' && 'En livraison'}
                    {matchedOrder.status === 'delivered' && 'Livré'}
                  </span>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block mt-1">
                    Arrivée estimée : {matchedOrder.estimatedDelivery}
                  </span>
                </div>
              </div>

              {/* Items summary */}
              <div className="p-3 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/70 dark:border-zinc-700/60 rounded-xl space-y-2">
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">Articles ({matchedOrder.items.length})</span>
                {matchedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="text-zinc-800 dark:text-zinc-200 font-medium">
                      {item.quantity}x {item.product.name}
                    </span>
                    <span className="font-mono text-zinc-500 dark:text-zinc-400">
                      {(item.product.priceEUR * item.quantity).toFixed(2)} €
                    </span>
                  </div>
                ))}
                <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700 flex justify-between text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  <span>Total payé</span>
                  <span className="font-mono">{matchedOrder.totalEUR.toFixed(2)} €</span>
                </div>
              </div>

              {/* Real Timeline */}
              <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-200 dark:before:bg-zinc-800">
                <div className="relative flex items-start gap-4">
                  <div className="absolute -left-6 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-zinc-900 bg-orange-600 text-white">
                    <Package className="w-3 h-3" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      Commande validée et enregistrée
                    </p>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-300 mt-0.5">
                      Paiement sécurisé et préparation chez le fabricant certifié
                    </p>
                    <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-mono mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{matchedOrder.date}</span>
                    </p>
                  </div>
                </div>

                <div className="relative flex items-start gap-4">
                  <div className={`absolute -left-6 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-zinc-900 ${
                    matchedOrder.status !== 'processing' ? 'bg-orange-600 text-white' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
                  }`}>
                    <Truck className="w-3 h-3" />
                  </div>
                  <div className="flex-1">
                    <p className={`text-xs font-bold ${matchedOrder.status !== 'processing' ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 dark:text-zinc-400'}`}>
                      Expédition internationale Choice
                    </p>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-300 mt-0.5">
                      Prise en charge par le transporteur prioritaire
                    </p>
                  </div>
                </div>

                <div className="relative flex items-start gap-4">
                  <div className={`absolute -left-6 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-zinc-900 ${
                    matchedOrder.status === 'delivered' ? 'bg-orange-600 text-white' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
                  }`}>
                    <MapPin className="w-3 h-3" />
                  </div>
                  <div className="flex-1">
                    <p className={`text-xs font-bold ${matchedOrder.status === 'delivered' ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 dark:text-zinc-400'}`}>
                      Livraison à l'adresse de destination
                    </p>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-300 mt-0.5">
                      {matchedOrder.customer.address}, {matchedOrder.customer.postalCode} {matchedOrder.customer.city}
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => generateOrderReceiptPDF(matchedOrder)}
                className="w-full py-2.5 px-4 text-xs font-bold text-zinc-900 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-white rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Package className="w-4 h-4" />
                Télécharger le reçu d'achat officiel (PDF)
              </button>
            </div>
          ) : activeTracking ? (
            /* Search with no results */
            <div className="p-8 text-center bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 space-y-3">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
              <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                Aucun colis trouvé avec la référence « {activeTracking} »
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                Vérifiez le numéro saisi ou passez une commande pour obtenir votre code de suivi officiel.
              </p>
            </div>
          ) : (
            /* No orders placed yet */
            <div className="p-8 text-center bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 space-y-3">
              <ShoppingBag className="w-10 h-10 text-zinc-400 dark:text-zinc-500 mx-auto stroke-1" />
              <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                Aucune commande active pour le moment
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                Lorsque vous validez une commande sur la boutique, votre numéro de suivi officiel et l'acheminement en direct apparaîtront automatiquement ici.
              </p>
            </div>
          )}

          <div className="pt-2 text-center">
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
