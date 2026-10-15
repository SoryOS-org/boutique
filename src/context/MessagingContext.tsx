import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { db, auth, loginWithGoogle, logoutUser, testConnection, handleFirestoreError, OperationType } from '../utils/firebase';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  getDocs,
  limit
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { ChatMessage } from '../types';

export interface UserPresence {
  id: string;
  displayName: string;
  status: 'online' | 'offline';
  lastSeen?: string;
}

interface MessagingContextType {
  messages: ChatMessage[];
  users: Record<string, UserPresence>;
  typingUsers: string[];
  firebaseUser: User | null;
  isAuthReady: boolean;
  isFirestoreConnected: boolean;
  activeChatId: string;
  setActiveChatId: (chatId: string) => void;
  sendMessage: (text: string, chatId?: string, extra?: Partial<ChatMessage>) => Promise<void>;
  addReaction: (msgId: string, emoji: string, chatId?: string) => Promise<void>;
  deleteMessage: (msgId: string, chatId?: string) => Promise<void>;
  setTyping: (isTyping: boolean, chatId?: string) => void;
  updateUserPresence: (status: 'online' | 'offline') => Promise<void>;
  login: () => Promise<User | null>;
  logout: () => Promise<void>;
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

export const MessagingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
  const [isFirestoreConnected, setIsFirestoreConnected] = useState<boolean>(false);
  const [activeChatId, setActiveChatId] = useState<string>('group-club');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [users, setUsers] = useState<Record<string, UserPresence>>({});
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const unsubscribeMessagesRef = useRef<(() => void) | null>(null);
  const unsubscribeUsersRef = useRef<(() => void) | null>(null);

  // 1. Initial Firestore connection test
  useEffect(() => {
    testConnection().then((connected) => {
      setIsFirestoreConnected(connected);
    });
  }, []);

  // 2. Listen to Firebase Auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      setIsAuthReady(true);

      if (user) {
        // Register or update user presence in Firestore
        try {
          const userDocRef = doc(db, 'users', user.uid);
          await setDoc(userDocRef, {
            id: user.uid,
            displayName: user.displayName || user.email?.split('@')[0] || 'Client SoryOS',
            status: 'online',
            lastSeen: new Date().toISOString(),
          }, { merge: true });
        } catch (err) {
          console.warn('Presence registration note:', err);
        }
      }
    });

    return () => unsub();
  }, []);

  // 3. Listen to users presence in real-time if signed in
  useEffect(() => {
    if (!firebaseUser) {
      if (unsubscribeUsersRef.current) {
        unsubscribeUsersRef.current();
        unsubscribeUsersRef.current = null;
      }
      return;
    }

    try {
      const usersCol = collection(db, 'users');
      const unsub = onSnapshot(usersCol, (snapshot) => {
        const presenceMap: Record<string, UserPresence> = {};
        snapshot.docs.forEach((d) => {
          const data = d.data();
          if (data && data.id) {
            presenceMap[data.id] = {
              id: data.id,
              displayName: data.displayName || 'Utilisateur',
              status: data.status || 'offline',
              lastSeen: data.lastSeen,
            };
          }
        });
        setUsers(presenceMap);
      }, (err) => {
        console.warn('Users presence listener notice:', err);
      });

      unsubscribeUsersRef.current = unsub;
    } catch (err) {
      console.warn('Error setting up presence listener:', err);
    }

    return () => {
      if (unsubscribeUsersRef.current) {
        unsubscribeUsersRef.current();
        unsubscribeUsersRef.current = null;
      }
    };
  }, [firebaseUser]);

  // 4. Subscribe to messages in activeChatId
  useEffect(() => {
    if (unsubscribeMessagesRef.current) {
      unsubscribeMessagesRef.current();
      unsubscribeMessagesRef.current = null;
    }

    const currentChat = activeChatId || 'group-club';

    if (firebaseUser) {
      try {
        const msgsCol = collection(db, 'chats', currentChat, 'messages');
        const q = query(msgsCol, orderBy('timestamp', 'asc'), limit(100));

        const unsub = onSnapshot(q, (snapshot) => {
          const loaded: ChatMessage[] = snapshot.docs.map((d) => {
            const data = d.data();
            let parsedTime: Date;
            if (data.timestamp && typeof data.timestamp.toDate === 'function') {
              parsedTime = data.timestamp.toDate();
            } else if (data.timestamp) {
              parsedTime = new Date(data.timestamp);
            } else {
              parsedTime = new Date();
            }

            return {
              id: d.id,
              senderId: data.senderId || 'unknown',
              senderName: data.senderName || 'Membre SoryOS',
              senderAvatar: data.senderAvatar || 'SO',
              avatarBg: data.avatarBg || 'bg-emerald-600',
              text: data.text || '',
              timestamp: parsedTime,
              isMe: data.senderId === firebaseUser.uid,
              status: data.status || 'read',
              product: data.product,
              voiceNote: data.voiceNote,
              image: data.image,
              quotedMessage: data.quotedMessage,
              reactions: data.reactions,
            } as ChatMessage;
          });

          setMessages(loaded);
        }, (err) => {
          console.warn('Firestore messages listener warning:', err);
        });

        unsubscribeMessagesRef.current = unsub;
      } catch (err) {
        console.warn('Error creating messages query:', err);
      }
    }

    return () => {
      if (unsubscribeMessagesRef.current) {
        unsubscribeMessagesRef.current();
        unsubscribeMessagesRef.current = null;
      }
    };
  }, [activeChatId, firebaseUser]);

  // Send message implementation
  const sendMessage = useCallback(async (
    text: string,
    chatId: string = activeChatId || 'group-club',
    extra?: Partial<ChatMessage>
  ) => {
    const targetChat = chatId || 'group-club';
    const nowIso = new Date().toISOString();
    const msgId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const currentUid = firebaseUser ? firebaseUser.uid : 'current-user';
    const currentName = firebaseUser?.displayName || 'Moi';
    const currentAvatar = (currentName.slice(0, 2)).toUpperCase();

    const localMsg: ChatMessage = {
      id: msgId,
      senderId: currentUid,
      senderName: currentName,
      senderAvatar: currentAvatar,
      avatarBg: 'bg-emerald-600',
      text,
      timestamp: new Date(),
      isMe: true,
      status: 'sent',
      product: extra?.product,
      voiceNote: extra?.voiceNote,
      image: extra?.image,
      quotedMessage: extra?.quotedMessage,
      reactions: extra?.reactions,
      ...extra,
    };

    // Optimistic local update
    setMessages((prev) => [...prev, localMsg]);

    // If authenticated, persist to real Firestore
    if (firebaseUser) {
      try {
        // Ensure chat document exists
        const chatDocRef = doc(db, 'chats', targetChat);
        await setDoc(chatDocRef, {
          id: targetChat,
          name: targetChat === 'group-club' ? 'Club SoryOS Officiel' : targetChat,
          participants: [firebaseUser.uid],
          lastMessage: text.slice(0, 100),
          lastMessageTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }, { merge: true });

        // Add message document
        const msgDocRef = doc(db, 'chats', targetChat, 'messages', msgId);
        const payload: Record<string, any> = {
          id: msgId,
          chatId: targetChat,
          senderId: firebaseUser.uid,
          senderName: currentName,
          senderAvatar: currentAvatar,
          avatarBg: 'bg-emerald-600',
          text,
          timestamp: nowIso,
          status: 'sent',
        };

        if (extra?.product) {
          payload.product = {
            id: extra.product.id,
            name: extra.product.name,
            priceEUR: extra.product.priceEUR,
            image: extra.product.image,
          };
        }

        if (extra?.voiceNote) {
          payload.voiceNote = {
            duration: extra.voiceNote.duration,
            seconds: extra.voiceNote.seconds,
          };
        }

        if (extra?.image) {
          payload.image = extra.image;
        }

        if (extra?.quotedMessage) {
          payload.quotedMessage = extra.quotedMessage;
        }

        if (extra?.reactions) {
          payload.reactions = extra.reactions;
        }

        await setDoc(msgDocRef, payload);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `chats/${targetChat}/messages/${msgId}`);
      }
    }
  }, [activeChatId, firebaseUser]);

  const addReaction = useCallback(async (msgId: string, emoji: string, chatId?: string) => {
    const targetChat = chatId || activeChatId || 'group-club';
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== msgId) return m;
        const currentReactions = { ...(m.reactions || {}) };
        currentReactions[emoji] = (currentReactions[emoji] || 0) + 1;
        return { ...m, reactions: currentReactions };
      })
    );

    if (firebaseUser) {
      try {
        const msgDocRef = doc(db, 'chats', targetChat, 'messages', msgId);
        const snapshot = await getDoc(msgDocRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          const currentReactions = { ...(data.reactions || {}) };
          currentReactions[emoji] = (currentReactions[emoji] || 0) + 1;
          await setDoc(msgDocRef, { reactions: currentReactions }, { merge: true });
        }
      } catch (err) {
        console.warn('Reaction persist notice:', err);
      }
    }
  }, [activeChatId, firebaseUser]);

  const deleteMessage = useCallback(async (msgId: string, chatId?: string) => {
    const targetChat = chatId || activeChatId || 'group-club';
    setMessages((prev) => prev.filter((m) => m.id !== msgId));

    if (firebaseUser) {
      try {
        const msgDocRef = doc(db, 'chats', targetChat, 'messages', msgId);
        await deleteDoc(msgDocRef);
      } catch (err) {
        console.warn('Delete message error:', err);
      }
    }
  }, [activeChatId, firebaseUser]);

  const setTyping = useCallback((isTyping: boolean, chatId?: string) => {
    if (isTyping) {
      const name = firebaseUser?.displayName || 'Moi';
      setTypingUsers((prev) => (prev.includes(name) ? prev : [...prev, name]));
    } else {
      const name = firebaseUser?.displayName || 'Moi';
      setTypingUsers((prev) => prev.filter((u) => u !== name));
    }
  }, [firebaseUser]);

  const updateUserPresence = useCallback(async (status: 'online' | 'offline') => {
    if (!firebaseUser) return;
    try {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      await setDoc(userDocRef, {
        id: firebaseUser.uid,
        status,
        lastSeen: new Date().toISOString(),
      }, { merge: true });
    } catch (err) {
      console.warn('Update presence error:', err);
    }
  }, [firebaseUser]);

  const login = useCallback(async () => {
    return await loginWithGoogle();
  }, []);

  const logout = useCallback(async () => {
    if (firebaseUser) {
      await updateUserPresence('offline');
    }
    await logoutUser();
  }, [firebaseUser, updateUserPresence]);

  return (
    <MessagingContext.Provider
      value={{
        messages,
        users,
        typingUsers,
        firebaseUser,
        isAuthReady,
        isFirestoreConnected,
        activeChatId,
        setActiveChatId,
        sendMessage,
        addReaction,
        deleteMessage,
        setTyping,
        updateUserPresence,
        login,
        logout,
      }}
    >
      {children}
    </MessagingContext.Provider>
  );
};

export const useMessaging = () => {
  const context = useContext(MessagingContext);
  if (!context) throw new Error('useMessaging must be used within a MessagingProvider');
  return context;
};
