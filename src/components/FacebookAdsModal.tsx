import React, { useState } from 'react';
import { Megaphone, Globe, CheckCircle2, DollarSign, Target, Sparkles, X, Plus, BarChart2, Eye, ExternalLink, Settings, AlertCircle } from 'lucide-react';
import { Product } from '../types';

interface FacebookAdsModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  showToast: (msg: string) => void;
}

interface AdCampaign {
  id: string;
  name: string;
  productName: string;
  pageName: string;
  budgetDaily: number;
  currency: string;
  targetAudience: string;
  status: 'active' | 'paused' | 'pending';
  impressions: number;
  clicks: number;
  spent: number;
  createdAt: string;
}

export const FacebookAdsModal: React.FC<FacebookAdsModalProps> = ({
  isOpen,
  onClose,
  products,
  showToast,
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'campaigns' | 'sync' | 'accounts'>('create');

  // Meta Account connection state
  const [isConnected, setIsConnected] = useState(true);
  const [selectedPage, setSelectedPage] = useState('SoryOS Official Store (124.5k abonnés)');
  const [selectedAdAccount, setSelectedAdAccount] = useState('act_9823419284 (Compte Principal France)');
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [catalogId, setCatalogId] = useState('CAT-928194829104');
  const [syncFrequency, setSyncFrequency] = useState<'realtime' | 'hourly'>('realtime');

  // Campaign creation form state
  const [campaignName, setCampaignName] = useState('Campagne Choice - SoryOS 2026');
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[0] || null);
  const [objective, setObjective] = useState<'CONVERSIONS' | 'TRAFFIC' | 'ENGAGEMENT'>('CONVERSIONS');
  const [dailyBudget, setDailyBudget] = useState(15);
  const [targetLocation, setTargetLocation] = useState('France, Belgique, Suisse (Francophone)');
  const [targetAge, setTargetAge] = useState('18 - 55+');
  const [interests, setInterests] = useState('Shopping en ligne, Bonnes affaires, High-Tech, AliExpress, E-commerce');
  const [adHeadline, setAdHeadline] = useState('Offre Limitée Choice - Livraison 5-8 jours');
  const [adPrimaryText, setAdPrimaryText] = useState('Découvrez les meilleures nouveautés directement depuis les fabricants. Qualité certifiée et retours gratuits.');
  const [callToAction, setCallToAction] = useState<'SHOP_NOW' | 'LEARN_MORE' | 'ORDER_NOW'>('SHOP_NOW');

  // Campaigns list state
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([
    {
      id: 'FB-ADS-8921',
      name: 'Promo Été High-Tech & Audio',
      productName: PRODUCTS_FALLBACK_NAME(products, 0),
      pageName: 'SoryOS Official Store',
      budgetDaily: 25,
      currency: 'EUR',
      targetAudience: 'France (18-45 ans) - Tech & Audio',
      status: 'active',
      impressions: 14280,
      clicks: 894,
      spent: 125.50,
      createdAt: '10 oct. 2026',
    },
    {
      id: 'FB-ADS-8922',
      name: 'Lancement Maison & Déco Smart',
      productName: PRODUCTS_FALLBACK_NAME(products, 1),
      pageName: 'SoryOS Official Store',
      budgetDaily: 15,
      currency: 'EUR',
      targetAudience: 'Belgique & France - Maison',
      status: 'active',
      impressions: 8920,
      clicks: 412,
      spent: 60.00,
      createdAt: '8 oct. 2026',
    }
  ]);

  function PRODUCTS_FALLBACK_NAME(prods: Product[], index: number) {
    return prods[index]?.name || 'Produit Phare SoryOS';
  }

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignName.trim()) {
      showToast('Veuillez entrer un nom de campagne valide.');
      return;
    }

    const newCamp: AdCampaign = {
      id: `FB-ADS-${Math.floor(1000 + Math.random() * 9000)}`,
      name: campaignName,
      productName: selectedProduct?.name || 'Produit SoryOS',
      pageName: selectedPage.split('(')[0].trim(),
      budgetDaily: dailyBudget,
      currency: 'EUR',
      targetAudience: `${targetLocation} (${targetAge})`,
      status: 'active',
      impressions: 0,
      clicks: 0,
      spent: 0,
      createdAt: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
    };

    setCampaigns([newCamp, ...campaigns]);
    showToast(`Campagne Facebook "${campaignName}" lancée avec succès !`);
    setActiveTab('campaigns');
  };

  const handleToggleStatus = (id: string) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === id) {
        const nextStatus = c.status === 'active' ? 'paused' : 'active';
        showToast(`Campagne ${c.name} ${nextStatus === 'active' ? 'activée' : 'mise en pause'}.`);
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md">
              <Megaphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Meta Ads Studio & Pages Manager</h2>
              <p className="text-xs text-blue-100">Diffusez vos produits directement sur vos pages Facebook & Instagram</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Subheader / Tabs */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 px-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex items-center gap-2 py-3 px-4 font-medium text-sm border-b-2 transition whitespace-nowrap ${
              activeTab === 'create'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-zinc-900'
                : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            <Plus className="w-4 h-4" />
            Créer une Publicité
          </button>
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`flex items-center gap-2 py-3 px-4 font-medium text-sm border-b-2 transition whitespace-nowrap ${
              activeTab === 'campaigns'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-zinc-900'
                : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            Campagnes Actives ({campaigns.length})
          </button>
          <button
            onClick={() => setActiveTab('sync')}
            className={`flex items-center gap-2 py-3 px-4 font-medium text-sm border-b-2 transition whitespace-nowrap ${
              activeTab === 'sync'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-zinc-900'
                : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            <Globe className="w-4 h-4" />
            Catalogue & Sync Temps Réel
          </button>
          <button
            onClick={() => setActiveTab('accounts')}
            className={`flex items-center gap-2 py-3 px-4 font-medium text-sm border-b-2 transition whitespace-nowrap ${
              activeTab === 'accounts'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-zinc-900'
                : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            Comptes & Pages Facebook
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'create' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Form Settings */}
              <form onSubmit={handleCreateCampaign} className="lg:col-span-7 space-y-6">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900 text-sm text-blue-800 dark:text-blue-300 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Diffusion Instantanée Meta :</span> Vos annonces seront optimisées pour le fil d'actualité Facebook et Instagram avec ciblage automatique des acheteurs potentiels.
                  </div>
                </div>

                {/* Page & Ad Account Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Page Facebook Diffuseur
                    </label>
                    <select
                      value={selectedPage}
                      onChange={(e) => setSelectedPage(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="SoryOS Official Store (124.5k abonnés)">SoryOS Official Store (124.5k abonnés)</option>
                      <option value="SoryOS Boutique France (45k abonnés)">SoryOS Boutique France (45k abonnés)</option>
                      <option value="Choice Direct Usine (89k abonnés)">Choice Direct Usine (89k abonnés)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Compte Publicitaire Meta
                    </label>
                    <select
                      value={selectedAdAccount}
                      onChange={(e) => setSelectedAdAccount(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="act_9823419284 (Compte Principal France)">act_9823419284 (Compte Principal)</option>
                      <option value="act_4920194812 (Compte International)">act_4920194812 (Compte International)</option>
                    </select>
                  </div>
                </div>

                {/* Campaign Name & Product */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Nom de la Campagne
                    </label>
                    <input
                      type="text"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Produit Promu
                    </label>
                    <select
                      value={selectedProduct?.id}
                      onChange={(e) => {
                        const found = products.find(p => p.id === e.target.value);
                        if (found) setSelectedProduct(found);
                      }}
                      className="w-full px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.priceEUR} €)</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Objective & Budget */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Objectif Publicitaire
                    </label>
                    <select
                      value={objective}
                      onChange={(e: any) => setObjective(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="CONVERSIONS">Conversions & Achats sur le site</option>
                      <option value="TRAFFIC">Trafic & Visites de la boutique</option>
                      <option value="ENGAGEMENT">Engagement & Commentaires</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Budget Quotidien (€ / jour)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="5"
                        max="1000"
                        value={dailyBudget}
                        onChange={(e) => setDailyBudget(Number(e.target.value))}
                        className="w-full pl-8 pr-3 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <DollarSign className="w-4 h-4 text-zinc-400 absolute left-2.5 top-2.5" />
                    </div>
                  </div>
                </div>

                {/* Ad Texts */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Texte Principal (Post Facebook)
                    </label>
                    <textarea
                      rows={3}
                      value={adPrimaryText}
                      onChange={(e) => setAdPrimaryText(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        Titre de la Carte Produit
                      </label>
                      <input
                        type="text"
                        value={adHeadline}
                        onChange={(e) => setAdHeadline(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        Bouton d'Action (CTA)
                      </label>
                      <select
                        value={callToAction}
                        onChange={(e: any) => setCallToAction(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        <option value="SHOP_NOW">Acheter maintenant</option>
                        <option value="LEARN_MORE">En savoir plus</option>
                        <option value="ORDER_NOW">Commander</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Targeting */}
                <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-blue-600" /> Paramètres de Ciblage Avancé
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">Zones Géographiques</label>
                      <input
                        type="text"
                        value={targetLocation}
                        onChange={(e) => setTargetLocation(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">Tranche d'Âge</label>
                      <input
                        type="text"
                        value={targetAge}
                        onChange={(e) => setTargetAge(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">Intérêts et Comportements cibles</label>
                    <input
                      type="text"
                      value={interests}
                      onChange={(e) => setInterests(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                >
                  <Megaphone className="w-5 h-5" /> Lancer la Publicité sur Facebook & Instagram
                </button>
              </form>

              {/* Live Preview Column */}
              <div className="lg:col-span-5 bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                    <Eye className="w-4 h-4 text-blue-600" /> Aperçu de l'Annonce Facebook
                  </span>
                  <span className="text-[10px] bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium">Fil d'actualité</span>
                </div>

                {/* Facebook Ad Mockup Card */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-md border border-zinc-200 dark:border-zinc-800 overflow-hidden text-sm">
                  {/* Page header */}
                  <div className="p-3 flex items-center gap-2.5 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow">
                      S
                    </div>
                    <div>
                      <div className="font-bold text-xs text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
                        {selectedPage.split('(')[0].trim()}
                        <span className="inline-block w-3 h-3 bg-blue-500 rounded-full text-[8px] text-white text-center leading-3">✓</span>
                      </div>
                      <div className="text-[10px] text-zinc-500">Sponsorisé · <Globe className="w-2.5 h-2.5 inline" /></div>
                    </div>
                  </div>

                  {/* Primary text */}
                  <div className="p-3 text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap">
                    {adPrimaryText}
                  </div>

                  {/* Product image */}
                  <div className="relative aspect-[4/3] bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                    <img
                      src={selectedProduct?.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'}
                      alt="Ad Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow">
                      -60% Choice
                    </div>
                  </div>

                  {/* Bottom banner */}
                  <div className="p-3 bg-zinc-50 dark:bg-zinc-800/80 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800">
                    <div>
                      <div className="text-[10px] uppercase font-semibold text-zinc-500">soryos.com</div>
                      <div className="font-bold text-xs text-zinc-900 dark:text-zinc-100 line-clamp-1">{adHeadline}</div>
                    </div>
                    <button type="button" className="px-3 py-1.5 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-900 dark:text-zinc-100 font-semibold text-xs rounded-lg transition">
                      {callToAction === 'SHOP_NOW' ? 'Acheter' : callToAction === 'LEARN_MORE' ? 'En savoir plus' : 'Commander'}
                    </button>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-300">
                  <div className="font-semibold mb-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" /> Synchronisation Pixel Meta
                  </div>
                  Le pixel de suivi SoryOS (ID: 982148921) est actif et mesurera automatiquement les conversions d'achats.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'campaigns' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">Vos Campagnes Publicitaires</h3>
                  <p className="text-xs text-zinc-500">Suivi en temps réel des performances de vos annonces sur Facebook et Instagram.</p>
                </div>
                <button
                  onClick={() => setActiveTab('create')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Nouvelle Campagne
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                  <div className="text-xs text-zinc-500 font-medium mb-1">Impressions Totales</div>
                  <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">23,200</div>
                  <div className="text-[11px] text-emerald-600 font-semibold mt-1">↑ +18.4% cette semaine</div>
                </div>
                <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                  <div className="text-xs text-zinc-500 font-medium mb-1">Clics & Visiteurs</div>
                  <div className="text-2xl font-black text-blue-600 dark:text-blue-400">1,306</div>
                  <div className="text-[11px] text-emerald-600 font-semibold mt-1">Taux de clic (CTR) : 5.62%</div>
                </div>
                <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                  <div className="text-xs text-zinc-500 font-medium mb-1">Dépense Totale</div>
                  <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">185.50 €</div>
                  <div className="text-[11px] text-blue-600 font-semibold mt-1">ROAS Moyen : 4.8x</div>
                </div>
              </div>

              {/* Campaigns table */}
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 uppercase font-semibold border-b border-zinc-200 dark:border-zinc-800">
                      <tr>
                        <th className="p-3.5">Campagne & Produit</th>
                        <th className="p-3.5">Page / Compte</th>
                        <th className="p-3.5">Budget</th>
                        <th className="p-3.5">Performances</th>
                        <th className="p-3.5">Statut</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-800 dark:text-zinc-200">
                      {campaigns.map((camp) => (
                        <tr key={camp.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition">
                          <td className="p-3.5">
                            <div className="font-bold text-zinc-900 dark:text-zinc-100">{camp.name}</div>
                            <div className="text-zinc-500 text-[11px]">Produit : {camp.productName}</div>
                          </td>
                          <td className="p-3.5">
                            <div className="font-medium">{camp.pageName}</div>
                            <div className="text-zinc-500 text-[11px]">{camp.targetAudience}</div>
                          </td>
                          <td className="p-3.5">
                            <div className="font-bold">{camp.budgetDaily} € / jour</div>
                            <div className="text-zinc-500 text-[11px]">Dépensé : {camp.spent} €</div>
                          </td>
                          <td className="p-3.5">
                            <div className="font-medium">{camp.impressions.toLocaleString()} vues</div>
                            <div className="text-blue-600 dark:text-blue-400 font-semibold">{camp.clicks} clics</div>
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              camp.status === 'active'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300'
                            }`}>
                              {camp.status === 'active' ? 'Active' : 'En pause'}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => handleToggleStatus(camp.id)}
                              className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 font-medium rounded-lg text-zinc-700 dark:text-zinc-300 transition"
                            >
                              {camp.status === 'active' ? 'Mettre en pause' : 'Activer'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sync' && (
            <div className="space-y-6 max-w-3xl mx-auto py-4">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                  <Globe className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Synchronisation Catalogue Facebook en Temps Réel</h3>
                <p className="text-xs text-zinc-500">Publiez automatiquement chaque nouveau produit ou modification de stock sur votre catalogue Meta Commerce en temps réel.</p>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
                {/* Status card */}
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-900 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                      ✓
                    </div>
                    <div>
                      <div className="font-bold text-sm text-emerald-900 dark:text-emerald-200">Webhooks Meta Actifs & Prêts</div>
                      <div className="text-xs text-emerald-700 dark:text-emerald-400">Les ajouts de produits déclenchent l'API Graph Meta instantanément.</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoSyncEnabled}
                      onChange={(e) => {
                        setAutoSyncEnabled(e.target.checked);
                        showToast(e.target.checked ? 'Synchronisation automatique activée' : 'Synchronisation automatique mise en pause');
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      ID du Catalogue Meta Commerce
                    </label>
                    <input
                      type="text"
                      value={catalogId}
                      onChange={(e) => setCatalogId(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Fréquence de Synchronisation
                    </label>
                    <select
                      value={syncFrequency}
                      onChange={(e: any) => setSyncFrequency(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="realtime">Temps Réel (Instantané via Webhook)</option>
                      <option value="hourly">Toutes les heures (Flux CSV / API)</option>
                    </select>
                  </div>
                </div>

                {/* Explanation guide */}
                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-200 space-y-2">
                  <div className="font-bold flex items-center gap-1.5 text-blue-800 dark:text-blue-300">
                    <Sparkles className="w-4 h-4 text-blue-600 shrink-0" /> Comment ça fonctionne en production :
                  </div>
                  <p className="leading-relaxed">
                    1. <strong>Ajout de Produit</strong> : Dès que vous créez ou modifiez un produit dans votre application SoryOS, un événement système (Webhook) est déclenché.<br />
                    2. <strong>Appel Graph API Meta</strong> : L'API Graph Meta (`POST /v20.0/{catalogId}/products`) reçoit instantanément le titre, le prix, la description, l'image et le lien direct de l'article.<br />
                    3. <strong>Diffusion sur Facebook & Instagram</strong> : Le produit apparaît automatiquement dans votre Boutique Facebook, votre Instagram Shopping et peut être promu en un clic dans vos publicités.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    showToast('Test de synchronisation réussi ! Le dernier produit a été publié sur le catalogue Facebook.');
                  }}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-xs"
                >
                  <Globe className="w-4 h-4" /> Tester la synchronisation d'un nouveau produit en direct
                </button>
              </div>
            </div>
          )}

          {activeTab === 'accounts' && (
            <div className="space-y-6 max-w-2xl mx-auto py-4">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl mx-auto flex items-center justify-center shadow-lg text-2xl font-black">
                  f
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Connexion Meta Business Manager</h3>
                <p className="text-xs text-zinc-500">Gérez vos pages Facebook, comptes publicitaires et catalogues produits en toute sécurité.</p>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                      ✓
                    </div>
                    <div>
                      <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Compte Facebook Connecté</div>
                      <div className="text-xs text-zinc-500">Connecté en tant que SoryOS Admin (soryos621@gmail.com)</div>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 text-xs font-bold rounded-full">Actif</span>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Pages Facebook gérées</label>
                  <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-zinc-900 dark:text-zinc-100">SoryOS Official Store</div>
                      <div className="text-[11px] text-zinc-500">ID: 104829182948192 • 124.5k abonnés</div>
                    </div>
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-lg font-semibold">Par défaut</span>
                  </div>
                  <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-zinc-900 dark:text-zinc-100">SoryOS Boutique France</div>
                      <div className="text-[11px] text-zinc-500">ID: 104829182948193 • 45k abonnés</div>
                    </div>
                    <button onClick={() => showToast('Page sélectionnée')} className="text-xs text-blue-600 font-semibold hover:underline">Sélectionner</button>
                  </div>
                </div>

                <button
                  onClick={() => showToast('Redirection vers l\'authentification Meta Business...')}
                  className="w-full py-2.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" /> Connecter un autre compte ou une nouvelle Page Facebook
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="text-xs text-zinc-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Meta Marketing API v20.0 connectée
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold rounded-xl hover:opacity-95 transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
