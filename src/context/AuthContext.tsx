import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, loginWithGoogle as fbLoginWithGoogle, logoutUser as fbLogoutUser } from '../utils/firebase';
import { UserAccount } from '../types';
import { INITIAL_USER } from '../data/products';

interface AuthContextType {
  user: UserAccount;
  firebaseUser: User | null;
  isAuthReady: boolean;
  isLoggingIn: boolean;
  loginWithGoogle: () => Promise<User | null>;
  logout: () => Promise<void>;
  updateUserAccount: (updated: Partial<UserAccount>) => Promise<void>;
  addCoins: (amount: number) => Promise<void>;
  redeemCoinsCoupon: (coinsCost: number, couponCode: string, discountEur: number) => boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GUEST_DEFAULT_USER: UserAccount = {
  ...INITIAL_USER,
  name: 'Invité SoryOS',
  email: '',
  isGoogleUser: false,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAccount>(() => {
    // Try to load cached user session if exists
    try {
      const cached = localStorage.getItem('soryos_user_account');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.name !== 'Alexandre Laurent' && parsed.email !== 'alexandre.laurent@example.com') {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return GUEST_DEFAULT_USER;
  });

  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Synchronize user profile in Firestore when Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      setIsAuthReady(true);

      if (fbUser) {
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const snap = await getDoc(userDocRef);

          if (snap.exists()) {
            // Existing user profile found in Firestore
            const data = snap.data();
            const updatedAccount: UserAccount = {
              uid: fbUser.uid,
              name: data.displayName || fbUser.displayName || 'Client SoryOS',
              email: data.email || fbUser.email || '',
              photoURL: data.photoURL || fbUser.photoURL || undefined,
              memberTier: (data.memberTier as any) || 'Membre VIP Gold',
              coinsBalance: typeof data.coinsBalance === 'number' ? data.coinsBalance : 1250,
              streakDays: typeof data.streakDays === 'number' ? data.streakDays : 4,
              savedAddresses: data.savedAddresses || INITIAL_USER.savedAddresses,
              availableCoupons: INITIAL_USER.availableCoupons,
              notificationPreferences: 'push',
            };

            setUser(updatedAccount);
            localStorage.setItem('soryos_user_account', JSON.stringify(updatedAccount));

            // Update presence and last seen
            await setDoc(
              userDocRef,
              {
                status: 'online',
                lastSeen: new Date().toISOString(),
              },
              { merge: true }
            );
          } else {
            // New account creation with Google Auth API
            const newDisplayName = fbUser.displayName || fbUser.email?.split('@')[0] || 'Client SoryOS';
            const newUserData: Record<string, any> = {
              id: fbUser.uid,
              displayName: newDisplayName,
              email: fbUser.email || '',
              memberTier: 'Membre VIP Gold',
              coinsBalance: 500, // 500 Welcome bonus coins for Google account creation
              status: 'online',
              lastSeen: new Date().toISOString(),
              notificationPreferences: 'push',
            };

            if (fbUser.photoURL) {
              newUserData.photoURL = fbUser.photoURL;
            }

            await setDoc(userDocRef, newUserData, { merge: true });

            const newAccount: UserAccount = {
              uid: fbUser.uid,
              name: newDisplayName,
              email: fbUser.email || '',
              photoURL: fbUser.photoURL || undefined,
              memberTier: 'Membre VIP Gold',
              coinsBalance: 500,
              streakDays: 1,
              savedAddresses: INITIAL_USER.savedAddresses,
              availableCoupons: INITIAL_USER.availableCoupons,
              isGoogleUser: true,
              notificationPreferences: 'push',
            };

            setUser(newAccount);
            localStorage.setItem('soryos_user_account', JSON.stringify(newAccount));
          }
        } catch (error) {
          console.warn('Erreur synchronisation profil Firestore:', error);
          // Fallback to basic Google user info
          const fallbackAccount: UserAccount = {
            uid: fbUser.uid,
            name: fbUser.displayName || 'Utilisateur Google',
            email: fbUser.email || '',
            photoURL: fbUser.photoURL || undefined,
            memberTier: 'Membre VIP Gold',
            coinsBalance: 500,
            streakDays: 1,
            savedAddresses: INITIAL_USER.savedAddresses,
            availableCoupons: INITIAL_USER.availableCoupons,
            isGoogleUser: true,
            notificationPreferences: 'push',
          };
          setUser(fallbackAccount);
        }
      } else {
        // Logged out / guest
        setUser(GUEST_DEFAULT_USER);
        localStorage.removeItem('soryos_user_account');
      }
    });

    return () => unsubscribe();
  }, []);

  // 1-Click Login or Sign Up with real Google Account API
  const loginWithGoogle = useCallback(async (): Promise<User | null> => {
    setIsLoggingIn(true);
    try {
      const loggedUser = await fbLoginWithGoogle();
      if (loggedUser) {
        setIsAuthModalOpen(false);
      }
      return loggedUser;
    } catch (err) {
      console.error('Erreur authentification Google:', err);
      throw err;
    } finally {
      setIsLoggingIn(false);
    }
  }, []);

  // Sign out
  const logout = useCallback(async (): Promise<void> => {
    try {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          await setDoc(
            userDocRef,
            {
              status: 'offline',
              lastSeen: new Date().toISOString(),
            },
            { merge: true }
          );
        } catch {
          // ignore
        }
      }
      await fbLogoutUser();
      setUser(GUEST_DEFAULT_USER);
      localStorage.removeItem('soryos_user_account');
    } catch (err) {
      console.error('Erreur déconnexion:', err);
    }
  }, [firebaseUser]);

  // Update user account details (addresses, display name, etc.)
  const updateUserAccount = useCallback(
    async (updated: Partial<UserAccount>) => {
      setUser((prev) => {
        const next = { ...prev, ...updated };
        localStorage.setItem('soryos_user_account', JSON.stringify(next));
        return next;
      });

      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const fieldsToSync: Record<string, any> = {};
          if (updated.name) fieldsToSync.displayName = updated.name;
          if (updated.memberTier) fieldsToSync.memberTier = updated.memberTier;
          if (typeof updated.coinsBalance === 'number') fieldsToSync.coinsBalance = updated.coinsBalance;
          if (Object.keys(fieldsToSync).length > 0) {
            await setDoc(userDocRef, fieldsToSync, { merge: true });
          }
        } catch (err) {
          console.warn('Mise à jour Firestore du profil ignorée:', err);
        }
      }
    },
    [firebaseUser]
  );

  // Add coins
  const addCoins = useCallback(
    async (amount: number) => {
      setUser((prev) => {
        const newBalance = prev.coinsBalance + amount;
        const next = { ...prev, coinsBalance: newBalance, streakDays: Math.min(7, prev.streakDays + 1) };
        localStorage.setItem('soryos_user_account', JSON.stringify(next));

        if (firebaseUser) {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          setDoc(userDocRef, { coinsBalance: newBalance }, { merge: true }).catch(() => {});
        }
        return next;
      });
    },
    [firebaseUser]
  );

  // Redeem coins coupon
  const redeemCoinsCoupon = useCallback(
    (coinsCost: number, couponCode: string, discountEur: number): boolean => {
      let success = false;
      setUser((prev) => {
        if (prev.coinsBalance >= coinsCost) {
          success = true;
          const newBalance = prev.coinsBalance - coinsCost;
          const next = {
            ...prev,
            coinsBalance: newBalance,
            availableCoupons: [
              ...prev.availableCoupons,
              {
                code: couponCode,
                label: `Coupon Récompense -${discountEur}€`,
                minSpendEUR: discountEur * 3,
                discountValue: `-${discountEur},00 €`,
              },
            ],
          };
          localStorage.setItem('soryos_user_account', JSON.stringify(next));

          if (firebaseUser) {
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            setDoc(userDocRef, { coinsBalance: newBalance }, { merge: true }).catch(() => {});
          }
          return next;
        }
        return prev;
      });
      return success;
    },
    [firebaseUser]
  );

  const openAuthModal = useCallback(() => setIsAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isAuthReady,
        isLoggingIn,
        loginWithGoogle,
        logout,
        updateUserAccount,
        addCoins,
        redeemCoinsCoupon,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
