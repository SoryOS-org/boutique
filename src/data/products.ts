import { Product, CurrencyConfig, CurrencyCode, UserAccount } from '../types';

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  EUR: { code: 'EUR', symbol: '€', rate: 1, position: 'suffix' },
  USD: { code: 'USD', symbol: '$', rate: 1.09, position: 'prefix' },
  XOF: { code: 'XOF', symbol: 'FCFA', rate: 655.957, position: 'suffix' },
  CAD: { code: 'CAD', symbol: 'CA$', rate: 1.48, position: 'prefix' },
};

export function formatPrice(amountEUR: number, currencyCode: CurrencyCode): string {
  const currency = CURRENCIES[currencyCode];
  const converted = amountEUR * currency.rate;
  
  if (currencyCode === 'XOF') {
    const formatted = Math.round(converted).toLocaleString('fr-FR');
    return `${formatted} ${currency.symbol}`;
  }

  const formatted = converted.toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return currency.position === 'prefix'
    ? `${currency.symbol}${formatted}`
    : `${formatted} ${currency.symbol}`;
}

export const INITIAL_USER: UserAccount = {
  name: 'Alexandre Laurent',
  email: 'alexandre.laurent@example.com',
  memberTier: 'Membre VIP Gold',
  coinsBalance: 1250, // 1250 coins = ~12.50€
  streakDays: 4,
  savedAddresses: [
    {
      id: 'addr-1',
      label: 'Domicile Principal',
      address: '14 Rue de la République',
      city: 'Paris',
      postalCode: '75001',
      phone: '+33 6 12 34 56 78',
    },
    {
      id: 'addr-2',
      label: 'Bureau Lyon',
      address: '28 Boulevard Vivier-Merle',
      city: 'Lyon',
      postalCode: '69003',
      phone: '+33 6 98 76 54 32',
    },
  ],
  availableCoupons: [
    { code: 'ALY10', label: '10% de réduction immédiate', minSpendEUR: 30, discountValue: '-10%' },
    { code: 'BIENVENUE5', label: '5€ offerts dès 25€ d’achat', minSpendEUR: 25, discountValue: '-5,00 €' },
    { code: 'CHOICEDAY', label: '15€ offerts dès 100€ d’achat Choice', minSpendEUR: 100, discountValue: '-15,00 €' },
  ],
};

const now = Date.now();

export const PRODUCTS: Product[] = [
  {
    id: 'aly-anc-900',
    name: 'Casque Audio Aurum Studio ANC Titane 45dB',
    category: 'audio',
    categoryLabel: 'Audio & Casques',
    priceEUR: 49.99,
    originalPriceEUR: 99.00,
    rating: 4.88,
    reviewsCount: 1420,
    salesCount: 8940,
    image: '/src/assets/images/product_anc_headphones_1791748514535.jpg',
    isChoice: true,
    isDirectFactory: true,
    stockQuantity: 18,
    freeShippingThresholdEUR: 20,
    description: 'Casque circum-auriculaire sans fil avec réduction active du bruit hybride 45dB, transducteurs en titane 40mm et autonomie de 60 heures. Certification Hi-Res Audio sans fil LDAC.',
    features: [
      'Réduction de bruit hybride jusqu’à -45 dB',
      'Double micro ENC pour des appels d’une clarté studio',
      'Batterie longue durée 60h avec charge rapide USB-C',
      'Connexion multipoint Bluetooth 5.4 à très faible latence'
    ],
    variants: [
      { id: 'titanium-dark', name: 'Titane Graphite', colorHex: '#27272a', inStock: true },
      { id: 'silver-matte', name: 'Argent Lunaire', colorHex: '#e4e4e7', inStock: true },
      { id: 'champagne-gold', name: 'Or Champêtre', colorHex: '#d4af37', inStock: true }
    ],
    seller: {
      id: 'sel-aurum',
      name: 'Aurum Acoustic Official Store',
      ratingPercent: 99.1,
      yearsActive: 6,
      location: 'Shenzhen Tech District, CN',
      isOfficialFactory: true,
      followersCount: 124000
    },
    flashDeal: {
      endTimeMs: now + 1000 * 60 * 60 * 14, // 14 hours left
      percentClaimed: 84
    },
    reviews: [
      {
        id: 'rev-1',
        author: 'Julien B.',
        rating: 5,
        date: '14 mars 2026',
        comment: 'Qualité de fabrication impressionnante pour le prix. Le son rivalise avec des modèles à plus de 200 euros en magasin.',
        country: 'France',
        verifiedBuyer: true
      },
      {
        id: 'rev-2',
        author: 'Aïcha K.',
        rating: 5,
        date: '02 mars 2026',
        comment: 'Livraison Choice très rapide (6 jours reçue à Lyon). La batterie tient largement la semaine.',
        country: 'France',
        verifiedBuyer: true
      }
    ]
  },
  {
    id: 'aly-towel-set',
    name: 'Set de Serviettes Égyptiennes Douceur Spa',
    category: 'textile',
    categoryLabel: 'Maison & Textile',
    priceEUR: 24.90,
    originalPriceEUR: 45.00,
    rating: 4.90,
    reviewsCount: 310,
    salesCount: 1850,
    image: '/src/assets/images/product_towel_set_1791753220261.jpg',
    isChoice: true,
    isDirectFactory: true,
    stockQuantity: 3,
    freeShippingThresholdEUR: 20,
    description: 'Ensemble de serviettes en coton égyptien premium, extrêmement absorbantes et douces au toucher. Idéal pour une ambiance spa à domicile.',
    features: ['100% coton égyptien', 'Absorption haute performance', 'Lavage en machine', 'Séchage rapide'],
    variants: [
      { id: 'white', name: 'Blanc Pur', colorHex: '#ffffff', inStock: true },
      { id: 'beige', name: 'Beige Sable', colorHex: '#f5f5dc', inStock: true }
    ],
    seller: {
      id: 'sel-textile',
      name: 'Luxury Home Textiles Factory',
      ratingPercent: 99.5,
      yearsActive: 5,
      location: 'Jiangsu Textile Hub, CN',
      isOfficialFactory: true,
      followersCount: 52000
    },
    reviews: []
  },
  {
    id: 'aly-silk-caftan',
    name: 'Caftan en Soie Brodé Élégance Traditionnelle',
    category: 'mode',
    categoryLabel: 'Mode & Artisanat',
    priceEUR: 129.00,
    originalPriceEUR: 250.00,
    rating: 4.95,
    reviewsCount: 150,
    salesCount: 890,
    image: '/src/assets/images/product_luxury_caftan_1791753232952.jpg',
    isChoice: true,
    isDirectFactory: true,
    stockQuantity: 2,
    freeShippingThresholdEUR: 20,
    description: 'Caftan luxueux en soie avec broderies artisanales complexes. Une pièce maîtresse pour les événements spéciaux.',
    features: ['Soie premium', 'Broderies artisanales', 'Coupe ajustée', 'Finitions de haute qualité'],
    variants: [
      { id: 'blue', name: 'Bleu Pétrole', colorHex: '#005f73', inStock: true },
      { id: 'green', name: 'Vert Émeraude', colorHex: '#047857', inStock: true }
    ],
    seller: {
      id: 'sel-fashion',
      name: 'Traditional Luxury Couture',
      ratingPercent: 99.8,
      yearsActive: 10,
      location: 'Marrakech Artisanat, MA/CN',
      isOfficialFactory: true,
      followersCount: 35000
    },
    reviews: []
  },
  {
    id: 'aly-curtain-set',
    name: 'Rideaux Occultants en Lin Premium',
    category: 'textile',
    categoryLabel: 'Maison & Textile',
    priceEUR: 45.00,
    originalPriceEUR: 80.00,
    rating: 4.82,
    reviewsCount: 450,
    salesCount: 2100,
    image: '/src/assets/images/product_curtain_set_1791753243761.jpg',
    isChoice: true,
    isDirectFactory: true,
    stockQuantity: 4,
    freeShippingThresholdEUR: 20,
    description: 'Rideaux occultants épais en lin naturel. Parfaits pour une chambre minimaliste et élégante.',
    features: ['100% Lin naturel', 'Occultation totale', 'Prêt à poser', 'Élégance intemporelle'],
    variants: [
      { id: 'natural', name: 'Naturel', colorHex: '#d2b48c', inStock: true },
      { id: 'grey', name: 'Gris Perle', colorHex: '#9ca3af', inStock: true }
    ],
    seller: {
      id: 'sel-textile',
      name: 'Luxury Home Textiles Factory',
      ratingPercent: 99.5,
      yearsActive: 5,
      location: 'Jiangsu Textile Hub, CN',
      isOfficialFactory: true,
      followersCount: 52000
    },
    reviews: []
  },
  {
    id: 'aly-duvet-set',
    name: 'Parure de Lit en Coton Satiné',
    category: 'textile',
    categoryLabel: 'Maison & Textile',
    priceEUR: 55.00,
    originalPriceEUR: 100.00,
    rating: 4.88,
    reviewsCount: 520,
    salesCount: 3000,
    image: '/src/assets/images/product_duvet_set_1791753254247.jpg',
    isChoice: true,
    isDirectFactory: true,
    stockQuantity: 14,
    freeShippingThresholdEUR: 20,
    description: 'Parure de lit élégante en coton satiné, douce et respirante. Style scandinave pour un sommeil réparateur.',
    features: ['Coton satiné', 'Respirant', 'Style scandinave', 'Finition premium'],
    variants: [
      { id: 'beige', name: 'Beige', colorHex: '#d2b48c', inStock: true },
      { id: 'white', name: 'Blanc', colorHex: '#ffffff', inStock: true }
    ],
    seller: {
      id: 'sel-textile',
      name: 'Luxury Home Textiles Factory',
      ratingPercent: 99.5,
      yearsActive: 5,
      location: 'Jiangsu Textile Hub, CN',
      isOfficialFactory: true,
      followersCount: 52000
    },
    reviews: []
  },
  {
    id: 'aly-curtain-rod',
    name: 'Barre de Rideau Industrielle Mate',
    category: 'hardware',
    categoryLabel: 'Quincaillerie',
    priceEUR: 18.00,
    originalPriceEUR: 35.00,
    rating: 4.75,
    reviewsCount: 280,
    salesCount: 1500,
    image: '/src/assets/images/product_curtain_rod_1791753264642.jpg',
    isChoice: true,
    isDirectFactory: true,
    stockQuantity: 9,
    freeShippingThresholdEUR: 20,
    description: 'Barre de rideau élégante en acier mat avec finitions minimalistes. Facile à installer et robuste.',
    features: ['Acier mat', 'Design minimaliste', 'Facile à installer', 'Robuste'],
    variants: [
      { id: 'black', name: 'Noir Mat', colorHex: '#1c1917', inStock: true }
    ],
    seller: {
      id: 'sel-hardware',
      name: 'Industrial Home Hardware',
      ratingPercent: 98.0,
      yearsActive: 4,
      location: 'Foshan Hardware Hub, CN',
      isOfficialFactory: true,
      followersCount: 30000
    },
    reviews: []
  },
  {
    id: 'aly-drone-4k',
    name: 'Drone Pliable Aerox Pro 4K Cardan 3 Axes GPS',
    category: 'drones',
    categoryLabel: 'Drones & Caméras',
    priceEUR: 89.90,
    originalPriceEUR: 179.00,
    rating: 4.85,
    reviewsCount: 840,
    salesCount: 4610,
    image: '/src/assets/images/product_drone_camera_1791749176698.jpg',
    isChoice: true,
    isDirectFactory: true,
    stockQuantity: 3,
    freeShippingThresholdEUR: 20,
    description: 'Mini drone compact pliable pesant moins de 249g. Caméra 4K stabilisée sur nacelle mécanique 3 axes, capteur Sony 1/2.3", transmission vidéo HD 5 km et retour automatique RTH.',
    features: [
      'Poids plume <249g : sans contrainte d’enregistrement lourd',
      'Nacelle mécanique motorisée 3 axes pour une vidéo ultra-fluide',
      'Portée de transmission jusqu’à 5 000 m avec retour vidéo fluide',
      'Autonomie jusqu’à 32 min par batterie avec capteurs d’obstacles'
    ],
    variants: [
      { id: 'single-bat', name: 'Pack Standard (1 Batterie)', colorHex: '#3f3f46', inStock: true },
      { id: 'combo-3bat', name: 'Pack Fly More (3 Batteries + Sacoche)', colorHex: '#18181b', inStock: true }
    ],
    seller: {
      id: 'sel-aerox',
      name: 'Aerox Flight Dynamics Lab',
      ratingPercent: 98.6,
      yearsActive: 8,
      location: 'Dongguan Aerial Tech Park, CN',
      isOfficialFactory: true,
      followersCount: 89000
    },
    flashDeal: {
      endTimeMs: now + 1000 * 60 * 60 * 9,
      percentClaimed: 91
    },
    reviews: [
      {
        id: 'rev-d1',
        author: 'Nicolas F.',
        rating: 5,
        date: '10 mars 2026',
        comment: 'La stabilité dans le vent est bluffante. Le retour automatique GPS fonctionne à la perfection.',
        country: 'France',
        verifiedBuyer: true
      }
    ]
  },
  {
    id: 'aly-chronos-ultra',
    name: 'Montre Connectée Chronos Ultra Titane Sapphire AMOLED',
    category: 'watches',
    categoryLabel: 'Montres & Wearables',
    priceEUR: 59.90,
    originalPriceEUR: 129.00,
    rating: 4.82,
    reviewsCount: 960,
    salesCount: 6150,
    image: '/src/assets/images/product_smartwatch_ultra_1791748525731.jpg',
    isChoice: true,
    isDirectFactory: true,
    stockQuantity: 24,
    freeShippingThresholdEUR: 20,
    description: 'Boîtier en alliage de titane CNC avec écran AMOLED haute luminosité 2 000 nits. Capteurs biométriques avancés, suivi GPS double fréquence et étanchéité IP68 / 5 ATM.',
    features: [
      'Écran AMOLED 1.43" tactile avec verre saphir inrayable',
      'Suivi de fréquence cardiaque 24/7, SpO2 et analyse de sommeil profond',
      'Plus de 100 modes sportifs avec détection automatique',
      'Autonomie jusqu’à 14 jours en usage standard'
    ],
    variants: [
      { id: 'black-silicone', name: 'Bracelet Sport Noir', colorHex: '#18181b', inStock: true },
      { id: 'titanium-mesh', name: 'Maille Milanaise Métal', colorHex: '#71717a', inStock: true },
      { id: 'orange-trail', name: 'Boucle Trail Orange', colorHex: '#ea580c', inStock: true }
    ],
    seller: {
      id: 'sel-chronos',
      name: 'Chronos Wearables Direct',
      ratingPercent: 98.9,
      yearsActive: 5,
      location: 'Huizhou Precision Instruments, CN',
      isOfficialFactory: true,
      followersCount: 145000
    },
    reviews: [
      {
        id: 'rev-4',
        author: 'Thomas R.',
        rating: 5,
        date: '28 février 2026',
        comment: 'La fluidité de l’écran AMOLED est spectaculaire. Reçue emballée avec chargeur magnétique.',
        country: 'France',
        verifiedBuyer: true
      }
    ]
  },
  {
    id: 'aly-espresso-pro',
    name: 'Moulin à Café Électrique Fellow Precision Meules Coniques',
    category: 'home',
    categoryLabel: 'Maison & Barista',
    priceEUR: 68.00,
    originalPriceEUR: 135.00,
    rating: 4.93,
    reviewsCount: 620,
    salesCount: 3180,
    image: '/src/assets/images/product_espresso_grinder_1791749167713.jpg',
    isChoice: true,
    isDirectFactory: true,
    stockQuantity: 4,
    freeShippingThresholdEUR: 20,
    description: 'Moulin à meules coniques 48mm en acier inoxydable trempé à haute teneur en carbone. 41 réglages micrométriques pour espresso, V60, Chemex et piston. Zéro rétention de mouture.',
    features: [
      'Meules coniques 48mm en acier inox trempé de grade pro',
      'Moteur silencieux à couple élevé avec arrêt automatique',
      'Gobelet doseur magnétique en inox avec système anti-statique',
      'Réglage micrométrique étalonné du grain turc au cold brew'
    ],
    variants: [
      { id: 'matte-black', name: 'Noir Mat Barista', colorHex: '#1c1917', inStock: true },
      { id: 'brushed-steel', name: 'Acier Brossé', colorHex: '#a8a29e', inStock: true }
    ],
    seller: {
      id: 'sel-barista',
      name: 'Craft Coffee Hardware Factory',
      ratingPercent: 99.4,
      yearsActive: 7,
      location: 'Zhejiang Appliance Hub, CN',
      isOfficialFactory: true,
      followersCount: 64000
    },
    flashDeal: {
      endTimeMs: now + 1000 * 60 * 60 * 18,
      percentClaimed: 76
    },
    reviews: [
      {
        id: 'rev-grind1',
        author: 'Guillaume B.',
        rating: 5,
        date: '08 mars 2026',
        comment: 'Extraction espresso parfaite sur ma machine manuelle. Aucune poussière statique.',
        country: 'France',
        verifiedBuyer: true
      }
    ]
  },
  {
    id: 'aly-mech-lumina',
    name: 'Clavier Mécanique Sans Fil Lumina 65% Hot-Swap Gasket',
    category: 'keyboards',
    categoryLabel: 'PC & Claviers',
    priceEUR: 44.50,
    originalPriceEUR: 85.00,
    rating: 4.91,
    reviewsCount: 2130,
    salesCount: 11200,
    image: '/src/assets/images/product_mechanical_keyboard_1791748537176.jpg',
    isChoice: true,
    isDirectFactory: true,
    stockQuantity: 15,
    freeShippingThresholdEUR: 20,
    description: 'Clavier mécanique compact 65% avec structure gasket mount pour un son feutré ("thock"). Touches doubles couches PBT sublimées, switches lubrifiés d’usine et triple connectivité.',
    features: [
      'Structure Gasket Mount insonorisée avec mousses Poron 5 couches',
      'Switches linéaires pré-lubrifiés interchangeables à chaud (Hot-Swap)',
      'Triple mode : Bluetooth 5.2 / 2.4GHz Dongle / Câble tressé Type-C',
      'Rétroéclairage réglable blanc chaud avec profil ergonomique OEM'
    ],
    variants: [
      { id: 'graphite-white', name: 'Teinte Deux-Tons Rétro', colorHex: '#52525b', inStock: true },
      { id: 'stealth-dark', name: 'Noir Carbone', colorHex: '#27272a', inStock: true }
    ],
    seller: {
      id: 'sel-lumina',
      name: 'Lumina Custom Keyboards Official',
      ratingPercent: 99.0,
      yearsActive: 6,
      location: 'Shenzhen Gaming Industrial Zone, CN',
      isOfficialFactory: true,
      followersCount: 210000
    },
    reviews: [
      {
        id: 'rev-6',
        author: 'Lucas V.',
        rating: 5,
        date: '05 mars 2026',
        comment: 'La sonorité est digne d’un clavier custom à 180€. La sensation de frappe est ultra douce.',
        country: 'France',
        verifiedBuyer: true
      }
    ]
  },
  {
    id: 'aly-backpack-commuter',
    name: 'Sac à Dos Urbain Étanche Nomad Commuter 25L Antivol',
    category: 'gear',
    categoryLabel: 'Bagagerie & Lifestyle',
    priceEUR: 38.90,
    originalPriceEUR: 79.00,
    rating: 4.87,
    reviewsCount: 1120,
    salesCount: 7890,
    image: '/src/assets/images/product_minimalist_backpack_1791749157581.jpg',
    isChoice: true,
    isDirectFactory: true,
    stockQuantity: 2,
    freeShippingThresholdEUR: 20,
    description: 'Sac à dos technique étanche en tissu enduit Oxford 900D haute densité. Compartiment pour ordinateur portable 16 pouces rembourré anti-choc, fermetures éclair YKK étanches et poche antivol dissimulée.',
    features: [
      'Toile enduite mate déperlante IPX4 et fermetures hermétiques YKK',
      'Poche dédiée molletonnée pour ordinateur 16" et tablette',
      'Sangle dorsale pour valise trolley et port de chargeur USB traversant',
      'Dossier thermoformé respirant avec répartition ergonomique du poids'
    ],
    variants: [
      { id: 'anthracite-grey', name: 'Gris Anthracite Mat', colorHex: '#374151', inStock: true },
      { id: 'deep-black', name: 'Noir Minéral', colorHex: '#18181b', inStock: true }
    ],
    seller: {
      id: 'sel-nomad',
      name: 'Nomad Gear Workshop',
      ratingPercent: 98.8,
      yearsActive: 9,
      location: 'Guangzhou Leather & Bags Cluster, CN',
      isOfficialFactory: true,
      followersCount: 168000
    },
    reviews: [
      {
        id: 'rev-bp1',
        author: 'Sébastien M.',
        rating: 5,
        date: '12 mars 2026',
        comment: 'Utilisé sous une pluie battante à vélo, mon ordinateur était parfaitement au sec. Superbes finitions.',
        country: 'France',
        verifiedBuyer: true
      }
    ]
  },
  {
    id: 'aly-skincare-aura',
    name: 'Coffret Rituel Botanique Aura Sérum Éclat & Crème Régénérante',
    category: 'beauty',
    categoryLabel: 'Beauté & Soin',
    priceEUR: 29.50,
    originalPriceEUR: 58.00,
    rating: 4.89,
    reviewsCount: 540,
    salesCount: 3950,
    image: '/src/assets/images/product_skincare_set_1791749186944.jpg',
    isChoice: true,
    isDirectFactory: true,
    stockQuantity: 32,
    freeShippingThresholdEUR: 20,
    description: 'Duo de soin visage régénérant formulé avec de l’acide hyaluronique pur, peptides bioactifs et extrait botanique de thé blanc. Flacon en verre ambré recyclable avec pipette doseuse de précision.',
    features: [
      'Hydratation cellulaire profonde 72h cliniquement démontrée',
      'Formule propre sans parabènes, sulfates ni parfum synthétique',
      'Flacon ambré anti-UV préservant les principes actifs vivants',
      'Texture ultra-légère à absorption rapide sans film gras'
    ],
    variants: [
      { id: 'duo-set', name: 'Coffret Duo Sérum 30ml + Crème 50ml', colorHex: '#d97706', inStock: true }
    ],
    seller: {
      id: 'sel-aura',
      name: 'Aura Botanical Laboratories',
      ratingPercent: 99.2,
      yearsActive: 4,
      location: 'Cosmetic Valley Partner Hub, FR/CN',
      isOfficialFactory: true,
      followersCount: 75000
    },
    reviews: [
      {
        id: 'rev-sk1',
        author: 'Clara D.',
        rating: 5,
        date: '04 mars 2026',
        comment: 'Ma peau est douce et lumineuse dès la première semaine. Texture très agréable.',
        country: 'Belgique',
        verifiedBuyer: true
      }
    ]
  },
  {
    id: 'aly-acoustic-cyl',
    name: 'Enceinte Portable 360° Stone & Fabric 30W IPX7',
    category: 'audio',
    categoryLabel: 'Audio & Casques',
    priceEUR: 36.80,
    originalPriceEUR: 69.90,
    rating: 4.79,
    reviewsCount: 780,
    salesCount: 4320,
    image: '/src/assets/images/product_portable_speaker_1791748549510.jpg',
    isChoice: true,
    isDirectFactory: true,
    stockQuantity: 8,
    freeShippingThresholdEUR: 20,
    description: 'Enceinte acoustique cylindrique avec diffusion audio omnidirectionnelle à 360°. Double radiateur passif pour des basses profondes et clarté des voix. Résistante aux éclaboussures IPX7.',
    features: [
      'Puissance 30W RMS avec amplification numérique DSP stéréo',
      'Son spatial 360° pour remplir toute la pièce sans angle mort',
      'Étanchéité totale IPX7 (résiste à l’immersion et aux projections)',
      'Jumelage stéréo TWS sans fil pour coupler 2 enceintes'
    ],
    variants: [
      { id: 'anthracite-fabric', name: 'Tissu Anthracite & Aluminium', colorHex: '#3f3f46', inStock: true },
      { id: 'mineral-grey', name: 'Gris Minéral', colorHex: '#a1a1aa', inStock: true }
    ],
    seller: {
      id: 'sel-aurum',
      name: 'Aurum Acoustic Official Store',
      ratingPercent: 99.1,
      yearsActive: 6,
      location: 'Shenzhen Tech District, CN',
      isOfficialFactory: true,
      followersCount: 124000
    },
    reviews: [
      {
        id: 'rev-8',
        author: 'Karim N.',
        rating: 5,
        date: '11 mars 2026',
        comment: 'Les basses sont nettes et ne saturent jamais à haut volume. Superbe finition textile.',
        country: 'France',
        verifiedBuyer: true
      }
    ]
  }
];

export const CATEGORIES = [
  { id: 'all', label: 'Toutes les offres' },
  { id: 'audio', label: 'Audio & Casques' },
  { id: 'drones', label: 'Drones & Caméras' },
  { id: 'watches', label: 'Montres & Wearables' },
  { id: 'keyboards', label: 'PC & Claviers' },
  { id: 'gear', label: 'Bagagerie & Lifestyle' },
  { id: 'textile', label: 'Maison & Textile' },
  { id: 'mode', label: 'Mode & Artisanat' },
  { id: 'hardware', label: 'Quincaillerie' },
  { id: 'home', label: 'Maison & Barista' },
  { id: 'beauty', label: 'Beauté & Soin' },
];
