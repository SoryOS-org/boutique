export type CurrencyCode = 'EUR' | 'USD' | 'XOF' | 'CAD';

export type PriceRangeId = 'all' | 'under-20' | '20-50' | 'over-50';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rate: number;
  position: 'prefix' | 'suffix';
}

export interface SellerInfo {
  id: string;
  name: string;
  ratingPercent: number; // e.g. 98.7%
  yearsActive: number;
  location: string;
  isOfficialFactory: boolean;
  followersCount: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  colorHex?: string;
  inStock: boolean;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  country: string;
  verifiedBuyer?: boolean;
  photos?: string[];
  helpfulCount?: number;
}

export interface WishlistItemMeta {
  productId: string;
  listName: string;
  note?: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'audio' | 'watches' | 'keyboards' | 'home' | 'gear' | 'drones' | 'beauty' | 'textile' | 'mode' | 'hardware';
  categoryLabel: string;
  priceEUR: number;
  originalPriceEUR: number;
  rating: number;
  reviewsCount: number;
  salesCount: number;
  image: string;
  isChoice: boolean;
  isDirectFactory: boolean;
  freeShippingThresholdEUR: number;
  description: string;
  features: string[];
  variants: ProductVariant[];
  reviews: Review[];
  seller: SellerInfo;
  stockQuantity?: number;
  flashDeal?: {
    endTimeMs: number;
    percentClaimed: number;
  };
}

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  trackingNumber: string;
  status: 'processing' | 'shipped' | 'customs' | 'out_for_delivery' | 'delivered';
  customer: {
    fullName: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
  };
  items: CartItem[];
  totalEUR: number;
  currency: CurrencyCode;
  estimatedDelivery: string;
}

export interface UserAccount {
  name: string;
  email: string;
  memberTier: 'Membre Standard' | 'Membre VIP Gold' | 'Membre Diamant';
  coinsBalance: number;
  streakDays: number;
  savedAddresses: Array<{
    id: string;
    label: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
  }>;
  availableCoupons: Array<{
    code: string;
    label: string;
    minSpendEUR: number;
    discountValue: string;
  }>;
}
export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  avatarBg: string;
  text: string;
  timestamp: Date | string;
  isMe: boolean;
  status?: 'sent' | 'delivered' | 'read';
  product?: Product;
  promoCode?: string;
  image?: string;
  voiceNote?: {
    duration: string;
    seconds: number;
    audioUrl?: string;
  };
  quotedMessage?: {
    sender: string;
    text: string;
  };
  reactions?: Record<string, number>;
}
