import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Send, Search, Phone, Video, MoreVertical, Paperclip, Smile, 
  Check, CheckCheck, ArrowLeft, Mic, Image, ShoppingBag, Users, 
  MessageCircle, Play, Pause, Heart, ThumbsUp, Flame, Sparkles, Filter,
  PhoneCall, PhoneIncoming, PhoneOutgoing, PhoneMissed, Camera, FileText,
  MapPin, Tag, Plus, Pin, MicOff, Volume2, VolumeX, Reply, Trash2,
  Copy, CircleDot, ChevronRight, Share2, AlertCircle, Settings, LogIn,
  Store, BadgeCheck, Clock, CreditCard
} from 'lucide-react';
import { useMessaging } from '../context/MessagingContext';
import { ChatSettingsModal } from './ChatSettingsModal';
import { 
  WhatsAppCatalogModal, 
  WhatsAppBusinessProfileModal, 
  WhatsAppQuickRepliesBar 
} from './WhatsAppBusinessModals';
import { Product, CurrencyCode, UserAccount } from '../types';
import { formatPrice } from '../data/products';
import { RealVoiceRecorder, generateDemoVoiceWav, VoiceDictation } from '../utils/audioRecorder';
import { ImageLightbox } from './ImageLightbox';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  avatarBg: string;
  text: string;
  timestamp: string;
  isMe: boolean;
  status: 'sent' | 'delivered' | 'read';
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

export interface Conversation {
  id: string;
  name: string;
  avatarBg: string;
  avatarText: string;
  avatarImage?: string;
  isGroup: boolean;
  memberCount?: number;
  online: boolean;
  statusText: string;
  unreadCount: number;
  pinned?: boolean;
  messages: ChatMessage[];
  lastMessageTime: string;
}

export interface WhatsAppStatus {
  id: string;
  authorName: string;
  authorAvatar: string;
  avatarBg: string;
  timeAgo: string;
  mediaUrl: string;
  caption: string;
  viewed: boolean;
}

export interface WhatsAppCall {
  id: string;
  contactName: string;
  avatarBg: string;
  avatarText: string;
  type: 'incoming' | 'outgoing' | 'missed';
  isVideo: boolean;
  timestamp: string;
}

interface CommunityChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount;
  products: Product[];
  currency: CurrencyCode;
  onAddToCart: (product: Product) => void;
  language: 'fr' | 'en';
  onLanguageChange: (lang: 'fr' | 'en') => void;
  initialProduct?: Product | null;
}

export const CommunityChatModal: React.FC<CommunityChatModalProps> = ({
  isOpen,
  onClose,
  user,
  products,
  currency,
  onAddToCart,
  language,
  onLanguageChange,
  initialProduct,
}) => {
  const {
    messages: firestoreMessages,
    sendMessage,
    addReaction: firestoreAddReaction,
    deleteMessage: firestoreDeleteMessage,
    typingUsers,
    firebaseUser,
    isFirestoreConnected,
    setActiveChatId: setContextChatId,
    setTyping,
    users: presenceUsers,
    login: loginFirebase,
    logout: logoutFirebase,
  } = useMessaging();
  // Navigation tabs state
  const [activeTab, setActiveTab] = useState<'chats' | 'status' | 'communities' | 'calls'>('chats');

  // Conversations state
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'group-club',
      name: language === 'fr' ? 'Club SoryOS Officiel' : 'Official SoryOS Club',
      avatarBg: 'bg-emerald-600',
      avatarText: 'CS',
      isGroup: true,
      memberCount: 348,
      online: true,
      statusText: language === 'fr' ? '348 membres • 42 en ligne' : '348 members • 42 online',
      unreadCount: 2,
      pinned: true,
      lastMessageTime: '10:42',
      messages: [
        {
          id: 'm1',
          senderId: 'fatoumata',
          senderName: 'Fatoumata Diallo',
          senderAvatar: 'FD',
          avatarBg: 'bg-rose-500',
          text: language === 'fr'
            ? "Bonjour tout le monde ! J'ai reçu mon caftan en soie brodé à la main aujourd'hui, la coupe et le tissu sont exceptionnels 😍 !"
            : "Hello everyone! Received my handcrafted silk caftan today, amazing fit and fabric 😍!",
          timestamp: '10:35',
          isMe: false,
          status: 'read',
          reactions: { '❤️': 6, '🔥': 3 },
        },
        {
          id: 'm2',
          senderId: 'marc',
          senderName: 'Marc Vancamp',
          senderAvatar: 'MV',
          avatarBg: 'bg-blue-600',
          text: language === 'fr'
            ? "Quelqu'un a testé le drone 4K pliable ? La batterie tient bien en extérieur ?"
            : "Anyone tried the 4K folding drone? How is the outdoor battery life?",
          timestamp: '10:38',
          isMe: false,
          status: 'read',
        },
        {
          id: 'm3',
          senderId: 'admin',
          senderName: 'SoryOS Officiel ✅',
          senderAvatar: 'SO',
          avatarBg: 'bg-orange-600',
          text: language === 'fr'
            ? "Bienvenue aux nouveaux membres ! Utilisez le code promo exclusif SORYOS20 pour -20% immédiats sur votre panier direct usine 🎁"
            : "Welcome new members! Use exclusive promo code SORYOS20 for instant 20% off direct factory prices 🎁",
          timestamp: '10:42',
          isMe: false,
          status: 'read',
          product: products[0],
          promoCode: 'SORYOS20',
          reactions: { '🔥': 14, '👏': 8 },
        },
      ],
    },
    {
      id: 'group-deals',
      name: language === 'fr' ? '🏷️ SuperDeals & Bons Plans Usine' : '🏷️ Factory Deals & Coupons',
      avatarBg: 'bg-amber-600',
      avatarText: 'SD',
      isGroup: true,
      memberCount: 215,
      online: true,
      statusText: language === 'fr' ? 'Partage de promos & réductions' : 'Discounts & coupon sharing',
      unreadCount: 1,
      lastMessageTime: '09:15',
      messages: [
        {
          id: 'md1',
          senderId: 'aissatou',
          senderName: 'Aïssatou Barry',
          senderAvatar: 'AB',
          avatarBg: 'bg-purple-600',
          text: language === 'fr'
            ? "Le set de serviettes en coton égyptien est en promo flash avec -45% ! Je viens de le commander."
            : "The Egyptian cotton towel set is on flash sale at -45%! Just ordered it.",
          timestamp: '09:15',
          isMe: false,
          status: 'read',
          product: products[1] || products[0],
          reactions: { '👍': 9 },
        },
      ],
    },
    {
      id: 'seller-support',
      name: language === 'fr' ? 'Boutique SoryOS (Direct Usine) ✅' : 'SoryOS Store (Direct Factory) ✅',
      avatarBg: 'bg-orange-600',
      avatarText: 'SO',
      isGroup: false,
      online: true,
      statusText: language === 'fr' ? 'En ligne • Répond en 2 min' : 'Online • Replies in 2 min',
      unreadCount: 0,
      lastMessageTime: 'Hier',
      messages: [
        {
          id: 'ms1',
          senderId: 'store',
          senderName: 'Boutique SoryOS',
          senderAvatar: 'SO',
          avatarBg: 'bg-orange-600',
          text: language === 'fr'
            ? "Bonjour et bienvenue sur SoryOS ! Tous nos articles sont vérifiés avant emballage et livrés directement d'usine avec garantie satisfait ou remboursé. Comment puis-je vous aider ?"
            : "Hello and welcome to SoryOS! All our items are inspected before shipment and delivered direct from factory with money-back guarantee. How can I help you today?",
          timestamp: 'Hier 18:20',
          isMe: false,
          status: 'read',
        },
      ],
    },
    {
      id: 'user-mamadou',
      name: 'Mamadou Sylla (VIP)',
      avatarBg: 'bg-teal-600',
      avatarText: 'MS',
      isGroup: false,
      online: true,
      statusText: language === 'fr' ? 'En ligne' : 'Online',
      unreadCount: 0,
      lastMessageTime: 'Hier',
      messages: [
        {
          id: 'mm1',
          senderId: 'mamadou',
          senderName: 'Mamadou Sylla',
          senderAvatar: 'MS',
          avatarBg: 'bg-teal-600',
          text: language === 'fr'
            ? "Salut ! Tu as vu le casque audio sans fil ? La réduction de bruit active est bluffante pour le prix."
            : "Hey! Did you check the wireless headphones? Active noise cancelling is top notch for the price.",
          timestamp: 'Hier 16:40',
          isMe: false,
          status: 'read',
          voiceNote: {
            duration: '0:18',
            seconds: 18,
          },
        },
      ],
    },
  ]);

  // WhatsApp Status / Stories
  const [statuses, setStatuses] = useState<WhatsAppStatus[]>([
    {
      id: 'st-1',
      authorName: 'Boutique SoryOS ✅',
      authorAvatar: 'SO',
      avatarBg: 'bg-orange-600',
      timeAgo: 'Il y a 12 min',
      mediaUrl: products[0]?.image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      caption: language === 'fr' ? '✨ Arrivage direct usine disponible dès aujourd’hui ! Stock certifié.' : '✨ Direct factory arrival available today! Certified stock.',
      viewed: false,
    },
    {
      id: 'st-2',
      authorName: 'Fatoumata Diallo',
      authorAvatar: 'FD',
      avatarBg: 'bg-rose-500',
      timeAgo: 'Il y a 45 min',
      mediaUrl: products[1]?.image || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
      caption: language === 'fr' ? 'Trop contente de mon colis SoryOS, qualité 5 étoiles 🌟' : 'So happy with my SoryOS parcel, 5-star quality 🌟',
      viewed: false,
    },
    {
      id: 'st-3',
      authorName: 'Mamadou Sylla',
      authorAvatar: 'MS',
      avatarBg: 'bg-teal-600',
      timeAgo: 'Il y a 2 heures',
      mediaUrl: products[2]?.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      caption: language === 'fr' ? 'Test audio validé à 100% avec réduction de bruit !' : 'Audio test 100% approved with noise cancellation!',
      viewed: true,
    },
  ]);

  // WhatsApp Call History
  const [calls] = useState<WhatsAppCall[]>([
    {
      id: 'call-1',
      contactName: 'Boutique SoryOS (Direct Usine)',
      avatarBg: 'bg-orange-600',
      avatarText: 'SO',
      type: 'incoming',
      isVideo: false,
      timestamp: language === 'fr' ? 'Aujourd’hui, 10:14' : 'Today, 10:14',
    },
    {
      id: 'call-2',
      contactName: 'Conseiller SoryOS',
      avatarBg: 'bg-emerald-600',
      avatarText: 'CS',
      type: 'missed',
      isVideo: true,
      timestamp: language === 'fr' ? 'Hier, 18:22' : 'Yesterday, 18:22',
    },
    {
      id: 'call-3',
      contactName: 'Mamadou Sylla (VIP)',
      avatarBg: 'bg-teal-600',
      avatarText: 'MS',
      type: 'outgoing',
      isVideo: false,
      timestamp: language === 'fr' ? '11 oct., 14:05' : 'Oct 11, 14:05',
    },
  ]);

  // Active chat and UI state
  const [activeChatId, setActiveChatId] = useState<string>('group-club');
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('chat');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'groups' | 'sellers'>('all');
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [selectedProductToShare, setSelectedProductToShare] = useState<Product | null>(null);
  // WhatsApp Business specific states
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isBusinessProfileOpen, setIsBusinessProfileOpen] = useState(false);
  const [isTypingSimulated, setIsTypingSimulated] = useState(false);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [voicePlaybackProgress, setVoicePlaybackProgress] = useState<number>(0);
  const [voiceSpeed, setVoiceSpeed] = useState<number>(1);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordingVolume, setRecordingVolume] = useState<number>(0);
  const [frequencyBars, setFrequencyBars] = useState<number[]>([25, 45, 60, 40, 75, 55, 80, 65, 40, 70, 50, 85, 45, 60, 75, 35]);
  const [voiceRecordedPreview, setVoiceRecordedPreview] = useState<{
    audioUrl: string;
    blob: Blob;
    durationStr: string;
    durationSec: number;
  } | null>(null);
  const [previewPlaying, setPreviewPlaying] = useState(false);
  const [isDictatingText, setIsDictatingText] = useState(false);
  const [voicePermissionModal, setVoicePermissionModal] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [bubbleColor, setBubbleColor] = useState('emerald');
  const [visibilityStatus, setVisibilityStatus] = useState<'online' | 'offline' | 'busy'>('online');
  const [replyingToMessage, setReplyingToMessage] = useState<ChatMessage | null>(null);
  
  // Media & Attachment states
  const [selectedImageToShare, setSelectedImageToShare] = useState<string | null>(null);
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [activeReactionMessageId, setActiveReactionMessageId] = useState<string | null>(null);
  const [newStoryModalOpen, setNewStoryModalOpen] = useState(false);
  const [newStoryCaption, setNewStoryCaption] = useState('');
  const [newStoryImage, setNewStoryImage] = useState('');

  // Status story viewer modal state
  const [activeStory, setActiveStory] = useState<WhatsAppStatus | null>(null);
  const [storyProgress, setStoryProgress] = useState(0);

  // In-call screen modal state
  const [activeCallContact, setActiveCallContact] = useState<{ name: string; isVideo: boolean } | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isCallMuted, setIsCallMuted] = useState(false);
  const [isCallSpeaker, setIsCallSpeaker] = useState(true);
  const [isVideoCamOn, setIsVideoCamOn] = useState(true);

  // Top notification banner
  const [bannerNotice, setBannerNotice] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const realRecorderRef = useRef<RealVoiceRecorder | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const dictationRef = useRef<VoiceDictation | null>(null);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const storyFileInputRef = useRef<HTMLInputElement>(null);

  // Auto-attach product when opened via "Discuter avec le vendeur"
  useEffect(() => {
    if (initialProduct) {
      setSelectedProductToShare(initialProduct);
      setActiveChatId('seller-support');
      setMobileView('chat');
      setBannerNotice(language === 'fr' 
        ? `Article "${initialProduct.name}" pré-sélectionné pour discuter avec le vendeur` 
        : `Product "${initialProduct.name}" pre-attached to chat with seller`);
      setTimeout(() => setBannerNotice(null), 4000);
    }
  }, [initialProduct, language]);

  const activeChat = conversations.find((c) => c.id === activeChatId) || conversations[0];

  // Sync context activeChatId whenever local activeChatId changes
  useEffect(() => {
    setContextChatId(activeChatId);
  }, [activeChatId, setContextChatId]);

  // Merge conversation base messages with real Firestore messages without duplication
  const displayedMessages = useMemo(() => {
    const baseMessages = activeChat.messages;
    const baseIds = new Set(baseMessages.map((m) => m.id));

    const liveConverted = firestoreMessages.map((m) => {
      let timeStr: string;
      if (typeof m.timestamp === 'string') {
        timeStr = m.timestamp;
      } else if (m.timestamp instanceof Date) {
        timeStr = m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else {
        timeStr = 'À l’instant';
      }

      const isMine = m.isMe !== undefined ? m.isMe : (firebaseUser ? m.senderId === firebaseUser.uid : (m.senderId === 'me' || m.isMe));

      return {
        id: m.id,
        senderId: m.senderId,
        senderName: isMine ? (user.name || firebaseUser?.displayName || (language === 'fr' ? 'Moi' : 'Me')) : m.senderName,
        senderAvatar: m.senderAvatar || (isMine ? (user.name ? user.name.slice(0, 2).toUpperCase() : 'ME') : 'SO'),
        avatarBg: m.avatarBg || (isMine ? 'bg-orange-600' : 'bg-emerald-600'),
        text: m.text,
        timestamp: timeStr,
        isMe: isMine,
        status: (m.status as 'sent' | 'delivered' | 'read') || 'sent',
        product: m.product,
        promoCode: m.promoCode,
        image: m.image,
        voiceNote: m.voiceNote,
        quotedMessage: m.quotedMessage,
        reactions: m.reactions,
      };
    });

    const newLiveMessages = liveConverted.filter((m) => !baseIds.has(m.id));
    return [...baseMessages, ...newLiveMessages];
  }, [activeChat.messages, firestoreMessages, firebaseUser, user.name, language]);

  const someoneElseTyping = useMemo(() => {
    const myName = firebaseUser?.displayName || user.name || 'Moi';
    return typingUsers.some((u) => u !== myName) || isTypingSimulated;
  }, [typingUsers, firebaseUser, user.name, isTypingSimulated]);

  // Auto-scroll when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayedMessages]);

  // Voice Note recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecordingVoice) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecordingVoice]);

  // In-Call timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeCallContact) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [activeCallContact]);

  // Story auto-advance timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeStory) {
      setStoryProgress(0);
      interval = setInterval(() => {
        setStoryProgress((prev) => {
          if (prev >= 100) {
            setActiveStory(null);
            return 100;
          }
          return prev + 2;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [activeStory]);

  // Start real microphone recording with live visualizer
  const startRealVoiceRecording = async () => {
    try {
      setVoicePermissionModal(false);
      setVoiceRecordedPreview(null);
      setRecordingVolume(0);
      setFrequencyBars([25, 45, 60, 40, 75, 55, 80, 65, 40, 70, 50, 85, 45, 60, 75, 35]);

      if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        setVoicePermissionModal(true);
        return;
      }

      const recorder = new RealVoiceRecorder();
      realRecorderRef.current = recorder;

      await recorder.start((vol, freqs) => {
        setRecordingVolume(vol);
        if (freqs && freqs.length > 0) {
          setFrequencyBars(freqs.slice(0, 16));
        }
      });

      setIsRecordingVoice(true);
      setRecordingSeconds(0);
      setBannerNotice(language === 'fr' 
        ? "🎙️ Micro actif : Parlez maintenant, votre voix est captée en direct !" 
        : "🎙️ Mic active: Speak now, your live voice is being captured!");
      setTimeout(() => setBannerNotice(null), 3000);
    } catch (err: any) {
      console.warn("Microphone access error:", err);
      setIsRecordingVoice(false);
      // Automatically trigger HD Studio Demo voice if mic is blocked, 
      // as physical mic access is restricted in the preview environment.
      handleUseStudioDemoVoice();
    }
  };

  // Cancel voice recording
  const cancelVoiceRecording = () => {
    if (realRecorderRef.current) {
      realRecorderRef.current.cancel();
      realRecorderRef.current = null;
    }
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current = null;
    }
    setIsRecordingVoice(false);
    setVoiceRecordedPreview(null);
    setPreviewPlaying(false);
    setRecordingSeconds(0);
    setRecordingVolume(0);
    setBannerNotice(language === 'fr' ? "Enregistrement vocal annulé" : "Voice recording cancelled");
    setTimeout(() => setBannerNotice(null), 2000);
  };

  // Stop recording: either preview it first or send immediately
  const stopVoiceRecording = async (sendImmediately: boolean = true) => {
    if (!realRecorderRef.current) {
      setIsRecordingVoice(false);
      return;
    }

    try {
      const result = await realRecorderRef.current.stop();
      realRecorderRef.current = null;
      setIsRecordingVoice(false);

      if (sendImmediately) {
        sendVoiceMessage(result.audioUrl, result.durationFormatted, result.durationSeconds);
      } else {
        setVoiceRecordedPreview({
          audioUrl: result.audioUrl,
          blob: result.audioBlob,
          durationStr: result.durationFormatted,
          durationSec: result.durationSeconds,
        });
      }
    } catch (err) {
      console.warn("Error stopping voice recording:", err);
      setIsRecordingVoice(false);
    }
  };

  // Send completed voice note to chat
  const sendVoiceMessage = async (audioUrl: string, durationStr: string, durationSeconds: number) => {
    const voicePayload = {
      duration: durationStr,
      seconds: durationSeconds,
      audioUrl,
    };

    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current = null;
    }
    setVoiceRecordedPreview(null);
    setPreviewPlaying(false);
    setRecordingSeconds(0);
    setRecordingVolume(0);

    try {
      await sendMessage(
        language === 'fr' ? "🎤 Note vocale WhatsApp" : "🎤 WhatsApp Voice Note",
        activeChatId,
        { voiceNote: voicePayload }
      );
    } catch (err) {
      console.warn('Realtime voice note sync notice:', err);
    }
  };

  // Toggle playing the recorded preview before sending
  const handleToggleVoicePreview = () => {
    if (!voiceRecordedPreview) return;

    if (previewPlaying) {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
      }
      setPreviewPlaying(false);
      return;
    }

    const audio = new Audio(voiceRecordedPreview.audioUrl);
    previewAudioRef.current = audio;
    setPreviewPlaying(true);

    audio.onended = () => {
      setPreviewPlaying(false);
      previewAudioRef.current = null;
    };
    audio.onerror = () => {
      setPreviewPlaying(false);
      previewAudioRef.current = null;
    };

    audio.play().catch(() => {
      setPreviewPlaying(false);
    });
  };

  // Generate and send audible HD Studio voice note when browser permissions block mic
  const handleUseStudioDemoVoice = () => {
    const { url } = generateDemoVoiceWav(4, 280);
    sendVoiceMessage(url, "0:04", 4);
    setVoicePermissionModal(false);
    setBannerNotice(language === 'fr' 
      ? "✅ Note vocale avec audio haute-fidélité générée et envoyée !" 
      : "✅ High-fidelity voice note generated and sent!");
    setTimeout(() => setBannerNotice(null), 3000);
  };

  // Speech-to-text dictation toggle
  const toggleSpeechDictation = () => {
    if (isDictatingText) {
      if (dictationRef.current) {
        dictationRef.current.stop();
        dictationRef.current = null;
      }
      setIsDictatingText(false);
      setBannerNotice(language === 'fr' ? "Dictée vocale terminée" : "Voice dictation finished");
      setTimeout(() => setBannerNotice(null), 2000);
    } else {
      const dictation = new VoiceDictation(language === 'fr' ? 'fr-FR' : 'en-US');
      if (!dictation.isSupported) {
        setBannerNotice(language === 'fr' 
          ? "Dictée vocale non prise en charge par ce navigateur." 
          : "Voice dictation not supported by this browser.");
        setTimeout(() => setBannerNotice(null), 3000);
        return;
      }
      dictationRef.current = dictation;
      setIsDictatingText(true);
      setBannerNotice(language === 'fr' 
        ? "🗣️ Dictée vocale active : Parlez, votre texte s'écrit tout seul !" 
        : "🗣️ Voice dictation active: Speak to type!");

      dictation.start(
        (transcript) => {
          setInputText((prev) => (prev ? prev + ' ' : '') + transcript);
        },
        (err) => {
          console.warn("Dictation error:", err);
          setIsDictatingText(false);
        }
      );
    }
  };

  // Toggle voice note real playback in chat bubble
  const handleToggleVoice = (msg: ChatMessage) => {
    if (playingVoiceId === msg.id) {
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
        activeAudioRef.current = null;
      }
      setPlayingVoiceId(null);
      setVoicePlaybackProgress(0);
      return;
    }

    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }

    setPlayingVoiceId(msg.id);
    setVoicePlaybackProgress(0);

    const audioUrl = msg.voiceNote?.audioUrl;
    if (audioUrl) {
      try {
        const audio = new Audio(audioUrl);
        activeAudioRef.current = audio;
        audio.playbackRate = voiceSpeed;

        audio.ontimeupdate = () => {
          if (audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
            setVoicePlaybackProgress(audio.currentTime / audio.duration);
          }
        };

        audio.onended = () => {
          setPlayingVoiceId(null);
          setVoicePlaybackProgress(0);
          activeAudioRef.current = null;
        };

        audio.onerror = () => {
          setPlayingVoiceId(null);
          setVoicePlaybackProgress(0);
          activeAudioRef.current = null;
        };

        audio.play().catch(() => {
          setPlayingVoiceId(null);
          setVoicePlaybackProgress(0);
        });
      } catch {
        setPlayingVoiceId(null);
        setVoicePlaybackProgress(0);
      }
    } else {
      // For legacy messages without audioUrl, synthesize audible tone WAV
      const demo = generateDemoVoiceWav(msg.voiceNote?.seconds || 3);
      const audio = new Audio(demo.url);
      activeAudioRef.current = audio;
      audio.playbackRate = voiceSpeed;
      audio.ontimeupdate = () => {
        if (audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
          setVoicePlaybackProgress(audio.currentTime / audio.duration);
        }
      };
      audio.onended = () => {
        setPlayingVoiceId(null);
        setVoicePlaybackProgress(0);
        activeAudioRef.current = null;
      };
      audio.play().catch(() => {
        setPlayingVoiceId(null);
        setVoicePlaybackProgress(0);
      });
    }
  };

  // Toggle voice speed 1x -> 1.5x -> 2x
  const handleToggleVoiceSpeed = () => {
    const nextSpeed = voiceSpeed === 1 ? 1.5 : voiceSpeed === 1.5 ? 2 : 1;
    setVoiceSpeed(nextSpeed);
    if (activeAudioRef.current) {
      activeAudioRef.current.playbackRate = nextSpeed;
    }
  };

  // Clean up audio hardware on unmount
  useEffect(() => {
    return () => {
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
        activeAudioRef.current = null;
      }
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        previewAudioRef.current = null;
      }
      if (realRecorderRef.current) {
        realRecorderRef.current.cancel();
        realRecorderRef.current = null;
      }
      if (dictationRef.current) {
        dictationRef.current.stop();
        dictationRef.current = null;
      }
    };
  }, []);

  // Add Reaction (local + Firestore)
  const handleAddReaction = async (msgId: string, emoji: string) => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id !== activeChatId) return conv;
        return {
          ...conv,
          messages: conv.messages.map((m) => {
            if (m.id !== msgId) return m;
            const currentReactions = { ...(m.reactions || {}) };
            currentReactions[emoji] = (currentReactions[emoji] || 0) + 1;
            return { ...m, reactions: currentReactions };
          }),
        };
      })
    );

    setActiveReactionMessageId(null);

    try {
      await firestoreAddReaction(msgId, emoji, activeChatId);
    } catch (err) {
      console.warn('Reaction sync error:', err);
    }
  };

  // Delete message
  const handleDeleteMessage = async (msgId: string) => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id !== activeChatId) return conv;
        return {
          ...conv,
          messages: conv.messages.filter((m) => m.id !== msgId),
        };
      })
    );

    try {
      await firestoreDeleteMessage(msgId, activeChatId);
      setBannerNotice(language === 'fr' ? "Message supprimé" : "Message deleted");
      setTimeout(() => setBannerNotice(null), 2500);
    } catch (err) {
      console.warn('Delete message sync error:', err);
    }
  };

  // Copy message text
  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    setBannerNotice(language === 'fr' ? "Texte copié dans le presse-papier !" : "Text copied to clipboard!");
    setTimeout(() => setBannerNotice(null), 2500);
  };

  // Handle image upload from user device
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      setBannerNotice(language === 'fr' ? "L'image est trop volumineuse (max 4 Mo)" : "Image too large (max 4MB)");
      setTimeout(() => setBannerNotice(null), 3000);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImageToShare(reader.result as string);
      setBannerNotice(language === 'fr' ? "Photo sélectionnée prête à l'envoi !" : "Photo selected, ready to send!");
      setTimeout(() => setBannerNotice(null), 2500);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Start direct conversation with contact or seller
  const handleStartDirectChat = (contact: { id: string; name: string; avatarBg: string; avatarText: string; isGroup?: boolean }) => {
    const existing = conversations.find(c => c.id === contact.id);
    if (!existing) {
      const newConv: Conversation = {
        id: contact.id,
        name: contact.name,
        avatarBg: contact.avatarBg,
        avatarText: contact.avatarText,
        isGroup: !!contact.isGroup,
        online: true,
        statusText: language === 'fr' ? 'En ligne' : 'Online',
        unreadCount: 0,
        lastMessageTime: 'À l’instant',
        messages: [
          {
            id: `welcome-${Date.now()}`,
            senderId: contact.id,
            senderName: contact.name,
            senderAvatar: contact.avatarText,
            avatarBg: contact.avatarBg,
            text: language === 'fr' 
              ? `Bonjour ! Bienvenue dans la discussion avec ${contact.name}. Comment pouvons-nous vous aider ?` 
              : `Hello! Welcome to the chat with ${contact.name}. How can we assist you?`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: false,
            status: 'read',
          }
        ],
      };
      setConversations(prev => [newConv, ...prev]);
    }
    setActiveChatId(contact.id);
    setShowNewChatModal(false);
    setMobileView('chat');
  };

  // Create new group chat
  const handleCreateNewGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    const groupId = `group-${Date.now()}`;
    const initials = newGroupName.trim().slice(0, 2).toUpperCase();
    const newGroup: Conversation = {
      id: groupId,
      name: newGroupName.trim(),
      avatarBg: 'bg-emerald-600',
      avatarText: initials,
      isGroup: true,
      memberCount: 1,
      online: true,
      statusText: language === 'fr' ? '1 membre • Vous êtes administrateur' : '1 member • You are admin',
      unreadCount: 0,
      lastMessageTime: 'À l’instant',
      messages: [
        {
          id: `init-${Date.now()}`,
          senderId: firebaseUser ? firebaseUser.uid : 'me',
          senderName: user.name || (language === 'fr' ? 'Moi' : 'Me'),
          senderAvatar: initials,
          avatarBg: 'bg-emerald-600',
          text: language === 'fr' ? `Groupe "${newGroupName.trim()}" créé avec succès !` : `Group "${newGroupName.trim()}" successfully created!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: true,
          status: 'sent',
        }
      ],
    };

    setConversations(prev => [newGroup, ...prev]);
    setActiveChatId(groupId);
    setNewGroupName('');
    setShowNewChatModal(false);
    setMobileView('chat');
    setBannerNotice(language === 'fr' ? `Nouveau groupe "${newGroup.name}" créé !` : `New group "${newGroup.name}" created!`);
    setTimeout(() => setBannerNotice(null), 3000);
  };

  // Send message
  const handleSendMessage = async (e?: React.FormEvent, customText?: string, customProduct?: Product) => {
    if (e && e.preventDefault) e.preventDefault();
    const messageBody = customText !== undefined ? customText : inputText;
    if (!messageBody.trim() && !selectedProductToShare && !selectedImageToShare && !customProduct) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const sentText = messageBody.trim() || (selectedImageToShare ? (language === 'fr' ? "📷 Photo partagée" : "📷 Shared photo") : (language === 'fr' ? "Regardez cet article direct usine !" : "Check out this direct factory deal!"));
    const productToSend = customProduct || selectedProductToShare || undefined;
    const imageToSend = selectedImageToShare || undefined;

    if (customText === undefined) {
      setInputText('');
    }
    setSelectedProductToShare(null);
    setSelectedImageToShare(null);
    setShowEmojiPicker(false);
    setShowAttachmentMenu(false);
    setReplyingToMessage(null);
    setTyping(false, activeChatId);

    // Persist and distribute via real Firebase Firestore backend
    try {
      await sendMessage(sentText, activeChatId, {
        product: productToSend,
        image: imageToSend,
        quotedMessage: replyingToMessage
          ? { sender: replyingToMessage.senderName, text: replyingToMessage.text }
          : undefined,
      });
    } catch (err) {
      console.warn('Realtime message dispatch notice:', err);
    }

    // Realistic WhatsApp Business auto-reply simulation
    setIsTypingSimulated(true);
    setTimeout(async () => {
      setIsTypingSimulated(false);
      const replyTime = `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`;
      
      let replyAuthor = 'SoryOS Business ✅';
      let replyBg = 'bg-[#008069]';
      let replyText = language === 'fr'
        ? "Merci pour votre message ! Notre équipe commerciale WhatsApp Business reste à votre entière disposition."
        : "Thank you for contacting SoryOS Business! Our sales team is ready to assist you.";

      const lower = sentText.toLowerCase();

      if (lower.includes('catalogue') || lower.includes('produit') || lower.includes('article') || lower.includes('voir')) {
        replyText = language === 'fr'
          ? "🛍️ Bienvenue dans notre catalogue officiel direct usine ! Vous pouvez consulter tous nos articles certifiés en cliquant sur le bouton 'Catalogue' en haut à droite ou commander directement dans cette discussion."
          : "🛍️ Welcome to our official factory direct catalog! You can browse all items by clicking the top 'Catalog' button or order directly in this chat.";
      } else if (lower.includes('livraison') || lower.includes('délai') || lower.includes('suivi') || lower.includes('colis')) {
        replyText = language === 'fr'
          ? "📦 Expédition & Livraison SoryOS Business :\n• Traitement et contrôle qualité en entrepôt sous 24h.\n• Livraison suivie en 2 à 5 jours ouvrés à domicile ou en point relais.\n• Remise en main propre contre signature avec numéro de suivi en temps réel."
          : "📦 SoryOS Business Shipping & Delivery:\n• Warehouse quality inspection within 24h.\n• Tracked delivery within 2 to 5 business days.\n• Signature required with live tracking code.";
      } else if (lower.includes('paiement') || lower.includes('payer') || lower.includes('orange') || lower.includes('wave') || lower.includes('carte')) {
        replyText = language === 'fr'
          ? "💳 Moyens de Paiement WhatsApp Business :\n• Orange Money officiel : +224 621 09 03 88\n• Wave & Virement bancaire sécurisé\n• Carte Bancaire (Visa / Mastercard)\n• Paiement à la livraison après inspection de votre colis."
          : "💳 WhatsApp Business Payment Methods:\n• Official Orange Money: +224 621 09 03 88\n• Wave & Secure Bank Transfer\n• Credit/Debit Card\n• Pay on delivery after inspecting your package.";
      } else if (lower.includes('devis') || lower.includes('gros') || lower.includes('revendeur') || lower.includes('quantité')) {
        replyText = language === 'fr'
          ? "🏷️ Tarifs Achat en Gros & Revendeurs :\nBénéficiez de -30% de remise immédiate dès 5 pièces d'un même article avec facture proforma certifiée SoryOS Import. Utilisez le code promo exclusif GROS30 lors de votre commande !"
          : "🏷️ Wholesale & Reseller Pricing:\nGet -30% off on 5+ units with certified SoryOS Import proforma invoice. Use promo code GROS30 at checkout!";
      } else if (lower.includes('garantie') || lower.includes('retour') || lower.includes('rembourse')) {
        replyText = language === 'fr'
          ? "🛡️ Garantie Professionnelle SoryOS :\n• 90 jours de protection acheteur intégrale.\n• 15 jours de retours gratuits sans justification.\n• Remplacement à neuf ou remboursement immédiat en cas de défaut usine."
          : "🛡️ SoryOS Professional Guarantee:\n• 90-day comprehensive buyer protection.\n• 15-day hassle-free returns.\n• Immediate replacement or refund on any factory defect.";
      } else if (lower.includes('conseiller') || lower.includes('humain') || lower.includes('parler') || lower.includes('téléphone')) {
        replyText = language === 'fr'
          ? "👨‍💼 Vous êtes mis en relation avec notre responsable commercial d'astreinte WhatsApp (+224 621 09 03 88). Un instant, nous traitons votre dossier."
          : "👨‍💼 Connecting you with a SoryOS sales specialist. You can also reach our direct hotline at +224 621 09 03 88.";
      } else if (activeChat.isGroup) {
        replyAuthor = 'Fatoumata Diallo';
        replyBg = 'bg-rose-500';
        replyText = language === 'fr'
          ? "Top ! Les articles SoryOS sont validés par les membres de la communauté 👍"
          : "Awesome! SoryOS products are 100% community approved 👍";
      }

      try {
        await sendMessage(replyText, activeChatId, {
          senderId: 'soryos-bot',
          senderName: replyAuthor,
          avatarBg: replyBg,
          isMe: false,
          reactions: { '❤️': 1 },
        });
      } catch (err) {
        console.warn('Auto-reply dispatch error:', err);
      }
    }, 1800);
  };

  const filteredConversations = conversations.filter((c) => {
    if (activeFilter === 'unread' && c.unreadCount === 0) return false;
    if (activeFilter === 'groups' && !c.isGroup) return false;
    if (activeFilter === 'sellers' && c.id !== 'seller-support') return false;
    if (searchQuery.trim()) {
      return c.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const popularEmojis = ['👍', '❤️', '🔥', '😂', '👏', '🎉', '🛍️', '😍', '✨', '💯', '🙏', '😮'];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-0 sm:p-3 md:p-5 select-none"
    >
      
      {/* ================= IN-CALL SCREEN MODAL (WhatsApp Voice/Video) ================= */}
      {activeCallContact && (
        <div className="fixed inset-0 z-60 bg-[#111b21]/95 text-white flex flex-col items-center justify-between p-8 animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between w-full max-w-md">
            <span className="text-xs text-emerald-400 font-mono tracking-widest uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              🔒 Appel WhatsApp Chiffré
            </span>
            <button 
              onClick={() => setActiveCallContact(null)}
              className="p-1 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-3xl shadow-2xl ring-4 ring-emerald-500/30 animate-pulse">
                {activeCallContact.name.slice(0, 2).toUpperCase()}
              </div>
              <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#111b21] flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">{activeCallContact.name}</h3>
              <p className="text-sm text-emerald-400 font-mono mt-1">
                {activeCallContact.isVideo ? "Appel vidéo WhatsApp en cours..." : "Appel vocal WhatsApp en cours..."}
              </p>
              <span className="text-xs font-mono text-zinc-400 mt-2 block">
                {String(Math.floor(callDuration / 60)).padStart(2, '0')}:{String(callDuration % 60).padStart(2, '0')}
              </span>
            </div>

            <div className="p-3 bg-zinc-800/60 rounded-xl text-xs text-zinc-300 max-w-xs border border-zinc-700">
              Assistance officielle SoryOS : joignable 24/7 au <strong>621 09 03 88</strong>
            </div>
          </div>

          {/* In-Call Controls */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsCallMuted(!isCallMuted)}
              className={`p-4 rounded-full transition-transform hover:scale-110 cursor-pointer ${
                isCallMuted ? 'bg-red-600 text-white' : 'bg-zinc-800 text-white hover:bg-zinc-700'
              }`}
              title="Micro"
            >
              {isCallMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>

            <button
              onClick={() => setActiveCallContact(null)}
              className="p-5 rounded-full bg-red-600 hover:bg-red-700 text-white transition-transform hover:scale-110 cursor-pointer shadow-xl shadow-red-900/50"
              title="Raccrocher"
            >
              <Phone className="w-7 h-7 rotate-[135deg]" />
            </button>

            <button
              onClick={() => setIsCallSpeaker(!isCallSpeaker)}
              className={`p-4 rounded-full transition-transform hover:scale-110 cursor-pointer ${
                isCallSpeaker ? 'bg-emerald-600 text-white' : 'bg-zinc-800 text-white hover:bg-zinc-700'
              }`}
              title="Haut-parleur"
            >
              {isCallSpeaker ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
            </button>
          </div>
        </div>
      )}

      {/* ================= FULLSCREEN STORY VIEWER (WhatsApp Status) ================= */}
      {activeStory && (
        <div className="fixed inset-0 z-60 bg-black/95 text-white flex flex-col items-center justify-between p-4 sm:p-6 animate-in fade-in duration-200">
          {/* Story Progress Bar */}
          <div className="w-full max-w-md bg-zinc-800 h-1 rounded-full overflow-hidden mb-3">
            <div 
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{ width: `${storyProgress}%` }}
            ></div>
          </div>

          <div className="w-full max-w-md flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-full ${activeStory.avatarBg} text-white font-bold flex items-center justify-center text-xs ring-2 ring-emerald-500`}>
                {activeStory.authorAvatar}
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">{activeStory.authorName}</h4>
                <p className="text-[10px] text-zinc-400">{activeStory.timeAgo}</p>
              </div>
            </div>
            <button onClick={() => setActiveStory(null)} className="p-1 text-zinc-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 w-full max-w-md my-4 flex flex-col items-center justify-center relative">
            <img 
              src={activeStory.mediaUrl} 
              alt={activeStory.caption} 
              className="w-full max-h-[60vh] object-cover rounded-2xl shadow-2xl border border-zinc-800"
            />
            <p className="text-center text-sm font-semibold mt-4 px-4 text-white drop-shadow-md">
              {activeStory.caption}
            </p>
          </div>

          <div className="w-full max-w-md flex items-center gap-2">
            <input 
              type="text" 
              placeholder="Répondre au statut..." 
              className="flex-1 px-4 py-2.5 rounded-full bg-zinc-800/90 text-white placeholder:text-zinc-500 border border-zinc-700 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <button 
              onClick={() => {
                setActiveStory(null);
                setBannerNotice("Réponse envoyée au statut !");
                setTimeout(() => setBannerNotice(null), 3000);
              }}
              className="p-2.5 rounded-full bg-emerald-600 text-white hover:bg-emerald-700"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= MAIN WHATSAPP WINDOW ================= */}
      <div className="relative w-full h-[100dvh] sm:h-[92vh] sm:max-h-[860px] max-w-6xl bg-white dark:bg-[#111b21] sm:rounded-2xl shadow-2xl border border-zinc-300 dark:border-zinc-800 flex overflow-hidden flex-col sm:flex-row">
        
        {/* ================= LEFT COLUMN: Navigation Tabs & List ================= */}
        <div 
          className={`w-full md:w-84 lg:w-96 bg-white dark:bg-[#111b21] border-r border-zinc-200 dark:border-zinc-800 flex flex-col shrink-0 ${
            mobileView === 'chat' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* WhatsApp Brand Header */}
          <div className="p-3 bg-zinc-100 dark:bg-[#202c33] border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                  {user.name ? user.name.slice(0, 2).toUpperCase() : 'SO'}
                </div>
                <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-[#202c33] ${
                  {
                    online: 'bg-emerald-500',
                    offline: 'bg-zinc-500',
                    busy: 'bg-rose-500',
                  }[visibilityStatus]
                }`}></span>
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <span className="text-emerald-600 dark:text-emerald-400">WhatsApp</span>
                  <span className="text-zinc-500 font-normal">SoryOS</span>
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button 
                onClick={() => setIsSettingsModalOpen(true)}
                className="p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                aria-label="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button 
                onClick={onClose}
                className="p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* WhatsApp Primary Tabs: Discussions | Actus | Communautés | Appels */}
          <div className="flex items-center border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#111b21] text-xs font-semibold">
            <button
              onClick={() => setActiveTab('chats')}
              className={`flex-1 py-3 text-center transition-colors cursor-pointer relative ${
                activeTab === 'chats'
                  ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 font-bold'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5">
                <MessageCircle className="w-4 h-4" />
                <span>Discussions</span>
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-600 text-white text-[9px] font-bold">3</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('status')}
              className={`flex-1 py-3 text-center transition-colors cursor-pointer relative ${
                activeTab === 'status'
                  ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 font-bold'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5">
                <CircleDot className="w-4 h-4" />
                <span>Actus</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('communities')}
              className={`flex-1 py-3 text-center transition-colors cursor-pointer relative ${
                activeTab === 'communities'
                  ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 font-bold'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5">
                <Users className="w-4 h-4" />
                <span>Groupes</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('calls')}
              className={`flex-1 py-3 text-center transition-colors cursor-pointer relative ${
                activeTab === 'calls'
                  ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 font-bold'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5">
                <PhoneCall className="w-4 h-4" />
                <span>Appels</span>
              </div>
            </button>
          </div>

          {/* TAB CONTENT: CHATS */}
          {activeTab === 'chats' && (
            <>
              {/* Search Box */}
              <div className="p-2.5 bg-white dark:bg-[#111b21] border-b border-zinc-200/80 dark:border-zinc-800">
                <div className="relative">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={language === 'fr' ? "Rechercher ou démarrer une discussion..." : "Search or start a new chat..."}
                    className="w-full pl-9 pr-3 py-2 bg-zinc-100 dark:bg-[#202c33] rounded-lg text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Filter Pills */}
              <div className="px-3 py-2 flex items-center gap-1.5 border-b border-zinc-100 dark:border-zinc-800/60 overflow-x-auto scrollbar-none">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    activeFilter === 'all'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-zinc-100 dark:bg-[#202c33] text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {language === 'fr' ? 'Toutes' : 'All'}
                </button>
                <button
                  onClick={() => setActiveFilter('unread')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    activeFilter === 'unread'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-zinc-100 dark:bg-[#202c33] text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {language === 'fr' ? 'Non lues' : 'Unread'}
                </button>
                <button
                  onClick={() => setActiveFilter('groups')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    activeFilter === 'groups'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-zinc-100 dark:bg-[#202c33] text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {language === 'fr' ? 'Groupes' : 'Groups'}
                </button>
                <button
                  onClick={() => setActiveFilter('sellers')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    activeFilter === 'sellers'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-zinc-100 dark:bg-[#202c33] text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {language === 'fr' ? 'Vendeurs' : 'Sellers'}
                </button>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/40">
                {filteredConversations.map((conv) => {
                  const isSelected = conv.id === activeChatId;
                  const lastMsg = conv.messages[conv.messages.length - 1];

                  return (
                    <div
                      key={conv.id}
                      onClick={() => {
                        setActiveChatId(conv.id);
                        setMobileView('chat');
                        setConversations((prev) =>
                          prev.map((c) => (c.id === conv.id ? { ...c, unreadCount: 0 } : c))
                        );
                      }}
                      className={`p-3 flex items-center gap-3 cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-zinc-100 dark:bg-[#2a3942]'
                          : 'hover:bg-zinc-50 dark:hover:bg-[#202c33]/70'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <div className={`w-12 h-12 rounded-full ${conv.avatarBg} text-white font-bold flex items-center justify-center text-sm shadow-xs`}>
                          {conv.avatarText}
                        </div>
                        {conv.online && (
                          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#111b21]"></span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 truncate flex items-center gap-1">
                            {conv.pinned && <Pin className="w-3 h-3 text-zinc-400 shrink-0" />}
                            <span>{conv.name}</span>
                          </h5>
                          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono shrink-0">
                            {conv.lastMessageTime}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-[170px] sm:max-w-[200px] flex items-center gap-1">
                            {lastMsg?.isMe && <CheckCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                            <span>{lastMsg ? lastMsg.text : '...'}</span>
                          </p>

                          {conv.unreadCount > 0 && (
                            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* TAB CONTENT: STATUTS (Actus WhatsApp) */}
          {activeTab === 'status' && (
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              {/* Mon Statut */}
              <div className="flex items-center gap-3 p-2 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-orange-600 text-white font-bold flex items-center justify-center text-sm">
                    {user.name ? user.name.slice(0, 2).toUpperCase() : 'SO'}
                  </div>
                  <button className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <div>
                  <h5 className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">Mon statut</h5>
                  <p className="text-[11px] text-zinc-400">Appuyez pour ajouter une actualité</p>
                </div>
              </div>

              <div>
                <h6 className="text-[11px] font-bold uppercase text-zinc-400 tracking-wider mb-2 px-1">
                  Mises à jour récentes
                </h6>
                <div className="space-y-2">
                  {statuses.map((st) => (
                    <div
                      key={st.id}
                      onClick={() => setActiveStory(st)}
                      className="flex items-center gap-3 p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 rounded-xl cursor-pointer transition-colors"
                    >
                      <div className="relative">
                        <div className={`w-12 h-12 rounded-full ${st.avatarBg} text-white font-bold flex items-center justify-center text-sm ring-2 ${
                          st.viewed ? 'ring-zinc-400' : 'ring-emerald-500'
                        } p-0.5`}>
                          {st.authorAvatar}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 truncate">{st.authorName}</h5>
                        <p className="text-[11px] text-zinc-400 truncate">{st.timeAgo}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: COMMUNAUTES (Groupes et Rayons) */}
          {activeTab === 'communities' && (
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs sm:text-sm">
                  <Users className="w-4 h-4" />
                  <span>Communauté Officielle SoryOS</span>
                </div>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-300 mt-1">
                  Connectez-vous directement aux acheteurs et fabricants certifiés pour chaque univers de produits.
                </p>
              </div>

              <div className="space-y-1 divide-y divide-zinc-100 dark:divide-zinc-800/50">
                <div 
                  onClick={() => {
                    setActiveTab('chats');
                    setActiveChatId('group-club');
                    setMobileView('chat');
                  }}
                  className="pt-2 pb-2 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/40 p-2 rounded-xl cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-orange-600 text-white font-bold flex items-center justify-center text-xs">
                      CS
                    </div>
                    <div>
                      <h5 className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100"># Général & Présentations</h5>
                      <p className="text-[10px] text-zinc-400">348 membres actifs</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-400" />
                </div>

                <div 
                  onClick={() => {
                    setActiveTab('chats');
                    setActiveChatId('group-deals');
                    setMobileView('chat');
                  }}
                  className="pt-2 pb-2 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/40 p-2 rounded-xl cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-600 text-white font-bold flex items-center justify-center text-xs">
                      SD
                    </div>
                    <div>
                      <h5 className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100"># SuperDeals & Codes Promo</h5>
                      <p className="text-[10px] text-zinc-400">215 membres actifs</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-400" />
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: APPELS (Calls Log) */}
          {activeTab === 'calls' && (
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {/* Call link header */}
              <div 
                onClick={() => {
                  setBannerNotice("Lien d'appel vocal copié dans le presse-papier !");
                  setTimeout(() => setBannerNotice(null), 3000);
                }}
                className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">Créer un lien d'appel</h5>
                  <p className="text-[11px] text-zinc-400">Partager un lien pour un appel SoryOS</p>
                </div>
              </div>

              <div>
                <h6 className="text-[11px] font-bold uppercase text-zinc-400 tracking-wider mb-2 px-1">
                  Récents
                </h6>
                <div className="space-y-2">
                  {calls.map((call) => (
                    <div 
                      key={call.id}
                      className="flex items-center justify-between p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${call.avatarBg} text-white font-bold flex items-center justify-center text-xs`}>
                          {call.avatarText}
                        </div>
                        <div>
                          <h5 className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">{call.contactName}</h5>
                          <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                            {call.type === 'incoming' && <PhoneIncoming className="w-3 h-3 text-emerald-500" />}
                            {call.type === 'outgoing' && <PhoneOutgoing className="w-3 h-3 text-emerald-500" />}
                            {call.type === 'missed' && <PhoneMissed className="w-3 h-3 text-red-500" />}
                            <span>{call.timestamp}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveCallContact({ name: call.contactName, isVideo: call.isVideo })}
                        className="p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-full cursor-pointer"
                      >
                        {call.isVideo ? <Video className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ================= RIGHT COLUMN: Active Conversation Window ================= */}
        <div 
          className={`flex-1 flex flex-col bg-zinc-200/50 dark:bg-[#0b141a] h-full ${
            mobileView === 'list' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Active Chat Header */}
          <div className="p-2.5 sm:p-3 bg-zinc-100 dark:bg-[#202c33] border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between shrink-0 shadow-xs">
            <div 
              onClick={() => setIsBusinessProfileOpen(true)}
              className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group hover:opacity-90 transition-opacity"
              title="Toucher pour voir le profil professionnel WhatsApp"
            >
              {/* Back button on mobile */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMobileView('list');
                }}
                className="p-1.5 -ml-1 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full md:hidden cursor-pointer"
                aria-label="Retour"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="relative">
                <div className={`w-10 h-10 rounded-full ${activeChat.avatarBg} text-white font-bold flex items-center justify-center text-sm shadow-xs group-hover:scale-105 transition-transform`}>
                  {activeChat.avatarText}
                </div>
                {activeChat.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#202c33]"></span>
                )}
              </div>

              <div>
                <h4 className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <span>{activeChat.name}</span>
                  <BadgeCheck className="w-4 h-4 text-emerald-500 fill-emerald-500/20 shrink-0" />
                  {activeChat.isGroup && (
                    <Users className="w-3.5 h-3.5 text-zinc-400" />
                  )}
                </h4>
                <p className="text-[11px] text-zinc-500 dark:text-emerald-400 flex items-center gap-1 font-medium">
                  {someoneElseTyping ? (
                    <span className="text-emerald-600 dark:text-emerald-400 animate-pulse font-semibold">
                      {language === 'fr' ? 'en train d’écrire...' : 'typing...'}
                    </span>
                  ) : (
                    <span>Compte professionnel officiel • Ouvert</span>
                  )}
                </p>
              </div>
            </div>

            {/* Real-time Backend Sync Indicator, Business Catalog & Calls */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* WhatsApp Business Catalog Button */}
              <button
                type="button"
                onClick={() => setIsCatalogOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-[#008069] hover:bg-[#00705b] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
                title="Consulter le catalogue de l'entreprise"
              >
                <Store className="w-4 h-4" />
                <span className="hidden sm:inline font-bold">Catalogue</span>
              </button>

              <div 
                className={`hidden lg:flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                  isFirestoreConnected
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                    : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                }`}
                title={isFirestoreConnected ? "Base de données Firebase Firestore synchronisée en temps réel" : "Mode local"}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isFirestoreConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                <span>{isFirestoreConnected ? 'Live' : 'Hors-ligne'}</span>
              </div>

              {firebaseUser ? (
                <div className="hidden xl:flex items-center gap-1 text-[11px] text-zinc-600 dark:text-zinc-300 bg-zinc-200/60 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span className="max-w-[80px] truncate">{firebaseUser.displayName || firebaseUser.email?.split('@')[0]}</span>
                  <button 
                    onClick={logoutFirebase} 
                    className="text-[10px] text-red-500 hover:text-red-700 dark:hover:text-red-400 ml-1 font-bold cursor-pointer"
                    title="Déconnexion Firebase"
                  >
                    ×
                  </button>
                </div>
              ) : null}

              <button
                onClick={() => setActiveCallContact({ name: activeChat.name, isVideo: false })}
                className="p-2 text-zinc-600 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-zinc-200 dark:hover:bg-zinc-700/80 rounded-full transition-colors cursor-pointer"
                title="Appel vocal WhatsApp"
              >
                <Phone className="w-4.5 h-4.5" />
              </button>

              <button
                onClick={() => setActiveCallContact({ name: activeChat.name, isVideo: true })}
                className="p-2 text-zinc-600 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-zinc-200 dark:hover:bg-zinc-700/80 rounded-full transition-colors cursor-pointer"
                title="Appel vidéo WhatsApp"
              >
                <Video className="w-4.5 h-4.5" />
              </button>

              <button
                onClick={onClose}
                className="p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700/80 rounded-full transition-colors cursor-pointer ml-1"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Top Banner Notice if triggered */}
          {bannerNotice && (
            <div className="bg-emerald-600 text-white text-xs font-semibold py-2 px-4 text-center animate-in fade-in slide-in-from-top-1 flex items-center justify-between">
              <span>{bannerNotice}</span>
              <button onClick={() => setBannerNotice(null)} className="p-1 hover:bg-emerald-700 rounded-md">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* ================= WhatsApp Messages Stream Area ================= */}
          <div 
            className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px]"
          >
            {/* Encryption notice banner */}
            <div className="flex justify-center mb-4">
              <div className="bg-amber-100/90 dark:bg-[#182229] border border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 text-[10px] sm:text-[11px] px-3.5 py-1.5 rounded-lg max-w-md text-center shadow-xs">
                🔒 {language === 'fr'
                  ? "Espace sécurisé SoryOS. Les prix usine, avis d'achats et messages sont partagés en toute transparence."
                  : "Secure SoryOS space. Factory prices, verified purchases, and messages are shared openly."}
              </div>
            </div>

            {displayedMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'} group`}
              >
                {/* Message Bubble Container */}
                <div
                  className={`relative max-w-[85%] sm:max-w-md md:max-w-lg rounded-2xl p-3 shadow-xs transition-all ${
                    msg.isMe
                      ? `${{
                          emerald: 'bg-emerald-100 dark:bg-emerald-800',
                          blue: 'bg-blue-100 dark:bg-blue-800',
                          rose: 'bg-rose-100 dark:bg-rose-800',
                          purple: 'bg-purple-100 dark:bg-purple-800',
                        }[bubbleColor] || 'bg-[#d9fdd3] dark:bg-[#005c4b]'} text-zinc-900 dark:text-zinc-100 rounded-tr-xs`
                      : 'bg-white dark:bg-[#202c33] text-zinc-900 dark:text-zinc-100 rounded-tl-xs border border-zinc-200/60 dark:border-transparent'
                  }`}
                >
                  {/* Quoted Message Preview if replying */}
                  {msg.quotedMessage && (
                    <div className="p-2 mb-1.5 bg-black/5 dark:bg-black/20 border-l-4 border-emerald-600 rounded-md text-[11px]">
                      <span className="font-bold text-emerald-700 dark:text-emerald-400 block">{msg.quotedMessage.sender}</span>
                      <p className="truncate text-zinc-600 dark:text-zinc-400">{msg.quotedMessage.text}</p>
                    </div>
                  )}

                  {/* Shared Photo in WhatsApp Bubble */}
                  {msg.image && (
                    <div className="mb-2 overflow-hidden rounded-xl bg-black/5 max-w-sm">
                      <img
                        src={msg.image}
                        alt="Photo WhatsApp"
                        className="w-full max-h-72 object-cover rounded-xl cursor-pointer hover:opacity-95 transition-opacity shadow-xs"
                        onClick={() => setLightboxImage(msg.image || null)}
                      />
                    </div>
                  )}

                  {/* Sender Name in Group Chat */}
                  {!msg.isMe && activeChat.isGroup && (
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="font-bold text-xs text-emerald-700 dark:text-emerald-400">
                        {msg.senderName}
                      </span>
                    </div>
                  )}

                  {/* Voice Note Player */}
                  {msg.voiceNote && (
                    <div className="flex items-center gap-3 p-2.5 bg-black/5 dark:bg-black/25 rounded-2xl mb-1.5 min-w-[220px] sm:min-w-[260px] border border-black/5 dark:border-white/5">
                      <button
                        type="button"
                        onClick={() => handleToggleVoice(msg)}
                        className="w-9 h-9 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center hover:scale-105 transition-all shadow-xs cursor-pointer shrink-0"
                        title={playingVoiceId === msg.id ? "Pause" : "Écouter la note vocale"}
                      >
                        {playingVoiceId === msg.id ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4 ml-0.5" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 h-5">
                          {[30, 65, 45, 90, 60, 85, 40, 100, 35, 75, 90, 50, 80, 45].map((h, i) => {
                            const barFraction = (i + 1) / 14;
                            const isPlayed = playingVoiceId === msg.id && voicePlaybackProgress >= barFraction;
                            return (
                              <div
                                key={i}
                                style={{ height: `${h}%` }}
                                className={`w-1 sm:w-1.5 rounded-full transition-all duration-150 ${
                                  isPlayed
                                    ? 'bg-emerald-600 dark:bg-emerald-400'
                                    : playingVoiceId === msg.id
                                    ? 'bg-emerald-300 dark:bg-emerald-700 animate-pulse'
                                    : 'bg-zinc-400 dark:bg-zinc-500'
                                }`}
                              ></div>
                            );
                          })}
                        </div>
                        <div className="flex items-center justify-between mt-1.5">
                          <span className="text-[10px] font-mono font-medium text-zinc-600 dark:text-zinc-400">
                            {playingVoiceId === msg.id
                              ? `${Math.round(voicePlaybackProgress * 100)}% • Lecture`
                              : msg.voiceNote.duration}
                          </span>
                          <button
                            type="button"
                            onClick={handleToggleVoiceSpeed}
                            className="px-1.5 py-0.5 rounded-md bg-zinc-200 dark:bg-zinc-700 text-[10px] font-mono font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600 cursor-pointer transition-colors"
                            title="Changer la vitesse de lecture"
                          >
                            {voiceSpeed}x
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Message Text */}
                  <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
                    {msg.text}
                  </p>

                  {/* Attached Product Card */}
                  {msg.product && (
                    <div className="mt-2.5 p-2.5 bg-white/90 dark:bg-[#111b21]/90 rounded-xl border border-zinc-200 dark:border-zinc-700/80 shadow-xs flex items-center gap-3">
                      <img
                        src={msg.product.image}
                        alt={msg.product.name}
                        className="w-14 h-14 rounded-lg object-cover bg-white shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider block">
                          Direct Usine
                        </span>
                        <h5 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 truncate">
                          {msg.product.name}
                        </h5>
                        <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {formatPrice(msg.product.priceEUR, currency)}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onAddToCart(msg.product!);
                          setBannerNotice(language === 'fr' ? "Produit ajouté au panier !" : "Product added to cart!");
                          setTimeout(() => setBannerNotice(null), 3000);
                        }}
                        className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-xs flex items-center gap-1"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{language === 'fr' ? 'Acheter' : 'Buy'}</span>
                      </button>
                    </div>
                  )}

                  {/* Promo Code Card */}
                  {msg.promoCode && (
                    <div className="mt-2 p-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-emerald-600" />
                        <span className="font-mono font-bold text-emerald-800 dark:text-emerald-300">
                          Code: {msg.promoCode} (-20%)
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(msg.promoCode!);
                          setBannerNotice("Code promo SORYOS20 copié !");
                          setTimeout(() => setBannerNotice(null), 3000);
                        }}
                        className="text-[10px] font-bold text-emerald-600 underline cursor-pointer"
                      >
                        Copier
                      </button>
                    </div>
                  )}

                  {/* Time & Read Status */}
                  <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-zinc-500 dark:text-zinc-400">
                    <span className="font-mono">{msg.timestamp}</span>
                    {msg.isMe && (
                      <CheckCheck className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                    )}
                  </div>
                </div>

                {/* Reactions list & quick reaction buttons */}
                <div className="relative flex items-center gap-1 mt-0.5 px-1">
                  {msg.reactions && Object.entries(msg.reactions).map(([emoji, count]) => (
                    <button
                      key={emoji}
                      onClick={() => handleAddReaction(msg.id, emoji)}
                      className="px-1.5 py-0.5 bg-white dark:bg-[#202c33] rounded-full text-[11px] shadow-xs border border-zinc-200/80 dark:border-zinc-700 flex items-center gap-1 cursor-pointer hover:scale-110 transition-transform"
                    >
                      <span>{emoji}</span>
                      <span className="text-[9px] font-bold text-zinc-600 dark:text-zinc-300">{count}</span>
                    </button>
                  ))}

                  {/* Reaction trigger toggle */}
                  <div className="relative">
                    <button
                      onClick={() => setActiveReactionMessageId(activeReactionMessageId === msg.id ? null : msg.id)}
                      className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-emerald-500 p-1 text-xs transition-opacity cursor-pointer rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      title="Ajouter une réaction"
                    >
                      <Smile className="w-3.5 h-3.5" />
                    </button>

                    {/* Floating Reaction Dock */}
                    {activeReactionMessageId === msg.id && (
                      <div className="absolute bottom-6 left-0 z-30 bg-white dark:bg-[#233138] border border-zinc-200 dark:border-zinc-700 rounded-full px-2 py-1 shadow-xl flex items-center gap-1.5 animate-in zoom-in-95 duration-150">
                        {['👍', '❤️', '😂', '😮', '😢', '🙏', '🔥'].map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => handleAddReaction(msg.id, emoji)}
                            className="text-base p-1 hover:scale-130 transition-transform cursor-pointer"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setReplyingToMessage(msg)}
                    className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-blue-500 p-1 text-xs transition-opacity cursor-pointer rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    title="Répondre"
                  >
                    <Reply className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleCopyMessage(msg.text)}
                    className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-1 text-xs transition-opacity cursor-pointer rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    title="Copier le texte"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  {msg.isMe && (
                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 p-1 text-xs transition-opacity cursor-pointer rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      title="Supprimer le message"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTypingSimulated && (
              <div className="flex items-center gap-2 p-2 bg-white dark:bg-[#202c33] rounded-2xl w-24 shadow-xs border border-zinc-200/60 dark:border-transparent">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ================= WhatsApp Bottom Bar ================= */}
          <WhatsAppQuickRepliesBar
            onSelectQuickReply={(msg) => {
              setInputText(msg);
            }}
            onOpenCatalog={() => setIsCatalogOpen(true)}
            language={language}
          />

          <div className="p-2 sm:p-3 bg-zinc-100 dark:bg-[#202c33] border-t border-zinc-200 dark:border-zinc-800 shrink-0">
            
            {/* Replying banner preview if active */}
            {replyingToMessage && (
              <div className="mb-2 p-2 bg-zinc-200 dark:bg-zinc-800 border-l-4 border-emerald-500 rounded-lg flex items-center justify-between text-xs animate-in slide-in-from-bottom-2">
                <div className="truncate">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 block">Répondre à {replyingToMessage.senderName}</span>
                  <p className="truncate text-zinc-600 dark:text-zinc-300">{replyingToMessage.text}</p>
                </div>
                <button onClick={() => setReplyingToMessage(null)} className="p-1 text-zinc-400 hover:text-zinc-700">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Selected Image attachment preview */}
            {selectedImageToShare && (
              <div className="mb-2 p-2.5 bg-purple-50 dark:bg-purple-950/40 border border-purple-300 dark:border-purple-800 rounded-xl flex items-center justify-between text-xs animate-in slide-in-from-bottom-2">
                <div className="flex items-center gap-3">
                  <img src={selectedImageToShare} alt="Photo sélectionnée" className="w-12 h-12 rounded-lg object-cover border border-purple-300 dark:border-purple-700" />
                  <div>
                    <span className="font-bold text-purple-900 dark:text-purple-200 block">Photo prête à être partagée</span>
                    <span className="text-[10px] text-purple-700 dark:text-purple-400">Sera envoyée dans la discussion WhatsApp</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedImageToShare(null)}
                  className="p-1.5 text-zinc-400 hover:text-red-500 rounded-lg hover:bg-white dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Hidden file input for photos */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleImageFileChange}
            />

            {/* Product selection preview */}
            {selectedProductToShare && (
              <div className="mb-2 p-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl flex items-center justify-between text-xs animate-in slide-in-from-bottom-2">
                <div className="flex items-center gap-2">
                  <img src={selectedProductToShare.image} alt="" className="w-8 h-8 rounded-lg object-cover" />
                  <div>
                    <span className="font-bold text-emerald-900 dark:text-emerald-200 block truncate max-w-xs">
                      {selectedProductToShare.name}
                    </span>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono">
                      {formatPrice(selectedProductToShare.priceEUR, currency)}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedProductToShare(null)}
                  className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Emoji Quick Picker Row */}
            {showEmojiPicker && (
              <div className="mb-2 p-2 bg-white dark:bg-[#111b21] rounded-xl border border-zinc-200 dark:border-zinc-700 flex items-center gap-2 overflow-x-auto">
                {popularEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      setInputText((prev) => prev + emoji);
                    }}
                    className="text-lg p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg hover:scale-125 transition-transform cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}

            {/* WhatsApp 6-Option Attachment Grid */}
            {showAttachmentMenu && (
              <div className="mb-2 p-3 bg-white dark:bg-[#111b21] rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-xl grid grid-cols-3 gap-2 animate-in slide-in-from-bottom-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowProductPicker(true);
                    setShowAttachmentMenu(false);
                  }}
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 hover:scale-105 transition-transform cursor-pointer"
                >
                  <ShoppingBag className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-bold">Catalogue Produit</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    fileInputRef.current?.click();
                    setShowAttachmentMenu(false);
                  }}
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 hover:scale-105 transition-transform cursor-pointer"
                >
                  <Camera className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-bold">Photo / Fichier</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setInputText((prev) => prev + " 🎁 Code promo SORYOS20 (-20%) ");
                    setShowAttachmentMenu(false);
                  }}
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:scale-105 transition-transform cursor-pointer"
                >
                  <Tag className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-bold">Code Promo</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setInputText((prev) => prev + " 📍 Adresse livraison confirmée ");
                    setShowAttachmentMenu(false);
                  }}
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:scale-105 transition-transform"
                >
                  <MapPin className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-bold">Localisation</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setInputText((prev) => prev + " 📄 Facture & Garantie SoryOS 90 jours ");
                    setShowAttachmentMenu(false);
                  }}
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:scale-105 transition-transform"
                >
                  <FileText className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-bold">Document</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setInputText((prev) => prev + " 👤 Contact SoryOS : +224 621 09 03 88 ");
                    setShowAttachmentMenu(false);
                  }}
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 hover:scale-105 transition-transform"
                >
                  <Phone className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-bold">Contact</span>
                </button>
              </div>
            )}

            {/* Input Row */}
            <form onSubmit={handleSendMessage} className="flex items-center gap-1.5 sm:gap-2">
              
              {/* Emoji Button */}
              <button
                type="button"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                className="p-2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-white rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                title="Émojis"
              >
                <Smile className="w-5 h-5 text-amber-500" />
              </button>

              {/* Attachment Clip */}
              <button
                type="button"
                onClick={() => setShowAttachmentMenu((prev) => !prev)}
                className="p-2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-white rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                title="Pièces jointes"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              {/* Input Field / Voice Recording View / Voice Preview View */}
              {isRecordingVoice ? (
                <div className="flex-1 flex items-center justify-between px-3 sm:px-4 py-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs shadow-inner">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <span className="w-3 h-3 rounded-full bg-red-600 animate-ping shrink-0"></span>
                    <span className="font-mono font-bold text-red-600 dark:text-red-400 shrink-0 text-xs sm:text-sm">
                      0:{String(recordingSeconds).padStart(2, '0')}
                    </span>
                    
                    {/* Live Animated Audio Waveform */}
                    <div className="hidden xs:flex items-center gap-0.5 sm:gap-1 h-5 px-1 sm:px-2 bg-emerald-100/70 dark:bg-emerald-900/40 rounded-md">
                      {frequencyBars.slice(0, 12).map((bar, idx) => {
                        const dynamicHeight = Math.max(15, Math.min(100, bar * (recordingVolume > 5 ? 1.4 : 0.4)));
                        return (
                          <div
                            key={idx}
                            style={{ height: `${dynamicHeight}%` }}
                            className={`w-1 rounded-full transition-all duration-75 ${
                              recordingVolume > 8
                                ? 'bg-emerald-600 dark:bg-emerald-400'
                                : 'bg-emerald-300 dark:bg-emerald-700'
                            }`}
                          ></div>
                        );
                      })}
                    </div>

                    <span className="text-[11px] truncate font-medium text-emerald-700 dark:text-emerald-300">
                      {recordingVolume > 8 
                        ? `🎙️ Voix captée (${recordingVolume}%)` 
                        : (language === 'fr' ? 'Parlez...' : 'Speak now...')}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    {/* Stop and Preview Button */}
                    <button
                      type="button"
                      onClick={() => stopVoiceRecording(false)}
                      className="px-2 py-1 rounded-lg bg-emerald-200/80 dark:bg-emerald-800/80 text-emerald-900 dark:text-white font-semibold text-[11px] hover:bg-emerald-300 transition-colors cursor-pointer flex items-center gap-1"
                      title="Écouter avant d'envoyer"
                    >
                      <Pause className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Écouter</span>
                    </button>

                    {/* Cancel Recording */}
                    <button
                      type="button"
                      onClick={cancelVoiceRecording}
                      className="p-1.5 text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                      title="Annuler l'enregistrement"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ) : voiceRecordedPreview ? (
                /* Voice Recorded Preview Player (WhatsApp style) */
                <div className="flex-1 flex items-center justify-between px-3 sm:px-4 py-2 bg-zinc-100 dark:bg-[#202c33] rounded-xl border border-emerald-500 text-xs shadow-xs">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={handleToggleVoicePreview}
                      className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center hover:scale-105 transition-transform cursor-pointer shrink-0"
                      title={previewPlaying ? "Pause" : "Écouter l'enregistrement"}
                    >
                      {previewPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                    </button>

                    <div className="flex flex-col">
                      <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                        {previewPlaying ? "Lecture de votre voix..." : "Note vocale prête"}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500">
                        Durée : {voiceRecordedPreview.durationStr}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={cancelVoiceRecording}
                      className="p-1.5 text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>

                    <button
                      type="button"
                      onClick={() => sendVoiceMessage(voiceRecordedPreview.audioUrl, voiceRecordedPreview.durationStr, voiceRecordedPreview.durationSec)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <span>Envoyer</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => {
                      setInputText(e.target.value);
                      if (e.target.value.trim().length > 0) {
                        setTyping(true, activeChatId);
                      } else {
                        setTyping(false, activeChatId);
                      }
                    }}
                    onBlur={() => setTyping(false, activeChatId)}
                    placeholder={
                      language === 'fr'
                        ? "Écrivez un message (ex: avis, prix, commande)..."
                        : "Type a message..."
                    }
                    className="w-full pl-4 pr-10 py-2.5 bg-white dark:bg-[#2a3942] rounded-xl text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 border border-zinc-200 dark:border-transparent"
                  />

                  {/* Dictation Speech-to-Text Button inside input */}
                  <button
                    type="button"
                    onClick={toggleSpeechDictation}
                    className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors cursor-pointer ${
                      isDictatingText
                        ? 'text-red-600 bg-red-100 dark:bg-red-950 animate-pulse'
                        : 'text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400'
                    }`}
                    title="Dictée vocale (parler pour écrire)"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Action Button: Send or Voice Note */}
              {isRecordingVoice ? (
                <button
                  type="button"
                  onClick={() => stopVoiceRecording(true)}
                  className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-md transition-all hover:scale-105 cursor-pointer shrink-0"
                  title="Envoyer immédiatement la note vocale"
                >
                  <Send className="w-4.5 h-4.5" />
                </button>
              ) : voiceRecordedPreview ? null : inputText.trim() || selectedProductToShare ? (
                <button
                  type="submit"
                  className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-md transition-all hover:scale-105 cursor-pointer shrink-0"
                  title="Envoyer"
                >
                  <Send className="w-4.5 h-4.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startRealVoiceRecording}
                  className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-md transition-all hover:scale-105 cursor-pointer shrink-0"
                  title="Enregistrer votre voix (Microphone réel avec ondes sonores)"
                >
                  <Mic className="w-4.5 h-4.5" />
                </button>
              )}

            </form>
          </div>

        </div>

      {/* Voice Recording / Microphone Permission Assistance Modal */}
      {voicePermissionModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1f2c34] rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-zinc-200 dark:border-zinc-700 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-700/80 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-white">
                    {language === 'fr' ? "Enregistrement Vocal & Microphone" : "Voice Recording & Microphone"}
                  </h4>
                  <p className="text-[11px] text-zinc-500">
                    {language === 'fr' ? "Capture audio haute fidélité" : "High-fidelity audio capture"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setVoicePermissionModal(false)}
                className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 mb-5 text-xs text-zinc-600 dark:text-zinc-300">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/40 flex items-start gap-2.5 text-amber-800 dark:text-amber-200 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>
                  {language === 'fr'
                    ? "L'accès au microphone physique nécessite l'autorisation du navigateur. Si le micro est bloqué ou non accessible dans cette fenêtre, vous pouvez générer une note vocale avec son audio réel immédiatement."
                    : "Access to physical microphone requires browser permission. If permissions are restricted, you can generate a high-fidelity studio voice note right away."}
                </p>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={startRealVoiceRecording}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <Mic className="w-4 h-4" />
                  <span>{language === 'fr' ? "Réessayer avec mon Microphone réel" : "Retry with real Microphone"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleUseStudioDemoVoice}
                  className="w-full py-2.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{language === 'fr' ? "Générer une Note Vocale HD (Son audible garanti)" : "Generate Studio HD Voice Note (Guaranteed sound)"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setVoicePermissionModal(false);
                    toggleSpeechDictation();
                  }}
                  className="w-full py-2.5 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 font-semibold flex items-center justify-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>{language === 'fr' ? "Activer la Dictée Vocale (Parler pour écrire)" : "Activate Voice Dictation (Speak to type)"}</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setVoicePermissionModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
              >
                {language === 'fr' ? "Fermer" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Selection Modal from Store Catalog */}
      {showProductPicker && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1f2c34] rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-zinc-200 dark:border-zinc-700 animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-base text-zinc-900 dark:text-white">
                  {language === 'fr' ? "Sélectionner un produit du magasin" : "Select a product to share"}
                </h4>
                <p className="text-xs text-zinc-500">
                  {language === 'fr' ? "Partagez la fiche produit en direct usine dans le chat" : "Share direct factory deal directly into chat"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowProductPicker(false)}
                className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-2.5 flex-1 max-h-[60vh] scrollbar-subtle">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-emerald-500 dark:hover:border-emerald-500 bg-zinc-50 dark:bg-zinc-800/50 transition-colors"
                >
                  <img src={p.image} alt={p.name} className="w-14 h-14 object-cover rounded-lg bg-white shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase font-bold text-orange-600 block">{p.seller.name}</span>
                    <h5 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 truncate">{p.name}</h5>
                    <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {formatPrice(p.priceEUR, currency)}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProductToShare(p);
                      setShowProductPicker(false);
                      setBannerNotice(language === 'fr' ? `Produit "${p.name}" attaché !` : `Product "${p.name}" attached!`);
                      setTimeout(() => setBannerNotice(null), 3000);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer shrink-0"
                  >
                    {language === 'fr' ? "Sélectionner" : "Select"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* New Chat / Create Group Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1f2c34] rounded-2xl max-w-md w-full p-5 shadow-2xl border border-zinc-200 dark:border-zinc-700 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-700 mb-4">
              <h4 className="font-bold text-base text-zinc-900 dark:text-white">
                {language === 'fr' ? "Nouvelle Discussion ou Groupe" : "New Chat or Group"}
              </h4>
              <button 
                type="button"
                onClick={() => setShowNewChatModal(false)} 
                className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Contacts */}
            <div className="mb-4">
              <h5 className="text-[11px] font-bold uppercase text-zinc-400 tracking-wider mb-2">
                {language === 'fr' ? "Contacts & Salons" : "Contacts & Rooms"}
              </h5>
              <div className="space-y-1.5">
                {[
                  { id: 'seller-support', name: 'Boutique SoryOS (Direct Usine) ✅', avatarBg: 'bg-orange-600', avatarText: 'SO' },
                  { id: 'group-club', name: 'Club SoryOS Officiel', avatarBg: 'bg-emerald-600', avatarText: 'CS', isGroup: true },
                  { id: 'user-mamadou', name: 'Mamadou Sylla (VIP)', avatarBg: 'bg-teal-600', avatarText: 'MS' },
                  { id: 'user-fatou', name: 'Fatoumata Diallo (Cliente)', avatarBg: 'bg-rose-500', avatarText: 'FD' },
                  { id: 'agent-support', name: 'Support Technique & Livraison 24/7', avatarBg: 'bg-blue-600', avatarText: 'ST' },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleStartDirectChat(c)}
                    className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left cursor-pointer"
                  >
                    <div className={`w-9 h-9 rounded-full ${c.avatarBg} text-white font-bold flex items-center justify-center text-xs shrink-0`}>
                      {c.avatarText}
                    </div>
                    <div className="flex-1 truncate">
                      <div className="font-bold text-xs text-zinc-900 dark:text-zinc-100 truncate">{c.name}</div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400">En ligne</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* Create Custom Group */}
            <form onSubmit={handleCreateNewGroup} className="pt-3 border-t border-zinc-200 dark:border-zinc-700">
              <h5 className="text-[11px] font-bold uppercase text-zinc-400 tracking-wider mb-2">
                {language === 'fr' ? "Créer un nouveau groupe WhatsApp" : "Create a new WhatsApp Group"}
              </h5>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={language === 'fr' ? "Nom du groupe..." : "Group name..."}
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  disabled={!newGroupName.trim()}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shrink-0"
                >
                  {language === 'fr' ? "Créer" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Immersive Fullscreen WhatsApp Calling Screen */}
      {activeCallContact && (
        <div className="fixed inset-0 z-[70] bg-zinc-950/95 flex flex-col items-center justify-between p-6 sm:p-10 animate-in fade-in">
          <div className="text-center space-y-1">
            <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              {activeCallContact.isVideo ? "Appel Vidéo WhatsApp Sécurisé" : "Appel Vocal WhatsApp Chiffré"}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              {activeCallContact.name}
            </h3>
            <p className="text-xs text-zinc-400 font-mono">
              {language === 'fr' ? "En cours..." : "Connected..."} • {Math.floor(callDuration / 60).toString().padStart(2, '0')}:{(callDuration % 60).toString().padStart(2, '0')}
            </p>
          </div>

          <div className="relative flex items-center justify-center my-auto">
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-emerald-500/20 animate-ping absolute"></div>
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-emerald-500/30 animate-pulse absolute"></div>
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-emerald-600 text-white font-extrabold text-3xl sm:text-4xl flex items-center justify-center shadow-2xl relative z-10 border-4 border-white/20">
              {activeCallContact.name.slice(0, 2).toUpperCase()}
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 bg-zinc-900/90 border border-zinc-800 px-6 py-4 rounded-3xl shadow-2xl">
            <button
              type="button"
              onClick={() => setIsCallMuted(!isCallMuted)}
              className={`p-3.5 rounded-full transition-colors cursor-pointer ${
                isCallMuted ? 'bg-red-500 text-white' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
              }`}
              title={isCallMuted ? "Réactiver le micro" : "Couper le micro"}
            >
              {isCallMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <button
              type="button"
              onClick={() => setIsCallSpeaker(!isCallSpeaker)}
              className={`p-3.5 rounded-full transition-colors cursor-pointer ${
                isCallSpeaker ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200' : 'bg-zinc-700 text-zinc-400'
              }`}
              title="Haut-parleur"
            >
              {isCallSpeaker ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            {activeCallContact.isVideo && (
              <button
                type="button"
                onClick={() => setIsVideoCamOn(!isVideoCamOn)}
                className={`p-3.5 rounded-full transition-colors cursor-pointer ${
                  isVideoCamOn ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200' : 'bg-red-500 text-white'
                }`}
                title="Caméra"
              >
                <Video className="w-5 h-5" />
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setActiveCallContact(null);
                setBannerNotice(language === 'fr' ? "Appel terminé" : "Call ended");
                setTimeout(() => setBannerNotice(null), 2500);
              }}
              className="p-3.5 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              title="Raccrocher"
            >
              <PhoneCall className="w-5 h-5 rotate-135" />
            </button>
          </div>
        </div>
      )}

      {/* Image Lightbox for photos */}
      {lightboxImage && (
        <ImageLightbox
          isOpen={true}
          images={[lightboxImage]}
          productName="WhatsApp Media"
          onClose={() => setLightboxImage(null)}
        />
      )}

      </div>

      <ChatSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        language={language}
        onLanguageChange={onLanguageChange}
        bubbleColor={bubbleColor}
        onBubbleColorChange={setBubbleColor}
        visibilityStatus={visibilityStatus}
        onVisibilityStatusChange={setVisibilityStatus}
      />

      {/* WhatsApp Business Catalog Modal */}
      <WhatsAppCatalogModal
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        products={products}
        currency={currency}
        onShareProductToChat={(prod) => {
          setSelectedProductToShare(prod);
          setIsCatalogOpen(false);
          setInputText((prev) => prev ? `${prev} [Produit: ${prod.name}]` : (language === 'fr' ? `Bonjour, je souhaite commander ce produit : ${prod.name}` : `Hello, I would like to order this product: ${prod.name}`));
        }}
        onAddToCart={(prod) => {
          onAddToCart(prod);
        }}
        language={language}
      />

      {/* WhatsApp Business Profile Modal */}
      <WhatsAppBusinessProfileModal
        isOpen={isBusinessProfileOpen}
        onClose={() => setIsBusinessProfileOpen(false)}
        products={products}
        currency={currency}
        onOpenCatalog={() => {
          setIsBusinessProfileOpen(false);
          setIsCatalogOpen(true);
        }}
        onCallPhone={() => {
          setIsBusinessProfileOpen(false);
          setActiveCallContact({ name: "SoryOS Import", isVideo: false });
        }}
        language={language}
      />
    </motion.div>
  );
};
