import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'alyexpress-db';
const DB_VERSION = 1;
const STORE_FAVORITES = 'favorites';
const STORE_CATALOG = 'catalog';

let dbPromise: Promise<IDBPDatabase> | null = null;

export const initDB = async (): Promise<IDBPDatabase> => {
  if (dbPromise) return dbPromise;
  
  dbPromise = openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_FAVORITES)) {
        db.createObjectStore(STORE_FAVORITES, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_CATALOG)) {
        db.createObjectStore(STORE_CATALOG, { keyPath: 'id' });
      }
    },
  });

  return dbPromise;
};

export const saveFavorites = async (favorites: any[]): Promise<boolean> => {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_FAVORITES, 'readwrite');
    await tx.store.clear();
    for (const fav of favorites) {
      await tx.store.put(fav);
    }
    await tx.done;
    return true;
  } catch (err) {
    console.error('Erreur IndexedDB saveFavorites:', err);
    return false;
  }
};

export const getFavorites = async (): Promise<any[]> => {
  try {
    const db = await initDB();
    return await db.getAll(STORE_FAVORITES);
  } catch (err) {
    console.error('Erreur IndexedDB getFavorites:', err);
    return [];
  }
};

export const saveCatalog = async (catalog: any[]): Promise<boolean> => {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_CATALOG, 'readwrite');
    await tx.store.clear();
    for (const item of catalog) {
      await tx.store.put(item);
    }
    await tx.done;
    return true;
  } catch (err) {
    console.error('Erreur IndexedDB saveCatalog:', err);
    return false;
  }
};

export const getCatalog = async (): Promise<any[]> => {
  try {
    const db = await initDB();
    return await db.getAll(STORE_CATALOG);
  } catch (err) {
    console.error('Erreur IndexedDB getCatalog:', err);
    return [];
  }
};

export const getIndexedDBStats = async (): Promise<{ favoritesCount: number; catalogCount: number; isSupported: boolean }> => {
  try {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return { favoritesCount: 0, catalogCount: 0, isSupported: false };
    }
    const db = await initDB();
    const favCount = await db.count(STORE_FAVORITES);
    const catCount = await db.count(STORE_CATALOG);
    return { favoritesCount: favCount, catalogCount: catCount, isSupported: true };
  } catch {
    return { favoritesCount: 0, catalogCount: 0, isSupported: false };
  }
};
