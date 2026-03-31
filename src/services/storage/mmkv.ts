import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_PREFIX = 'claimwell:';

// In-memory cache for synchronous access
const cache = new Map<string, string>();
let hydrated = false;

/**
 * Hydrate the in-memory cache from AsyncStorage.
 * Call this once at app startup before reading stored values.
 */
export async function hydrateStorage(): Promise<void> {
  if (hydrated) return;
  const keys = await AsyncStorage.getAllKeys();
  const ownKeys = keys.filter((k) => k.startsWith(STORAGE_PREFIX));
  if (ownKeys.length > 0) {
    const pairs = await AsyncStorage.multiGet(ownKeys);
    for (const [key, value] of pairs) {
      if (value !== null) {
        cache.set(key.slice(STORAGE_PREFIX.length), value);
      }
    }
  }
  hydrated = true;
}

// -- Typed storage keys --

type StorageSchema = {
  claimDrafts: Record<string, unknown>;
  onboardingComplete: boolean;
  lastViewedClaimId: string;
};

export function getItem<K extends keyof StorageSchema>(key: K): StorageSchema[K] | undefined {
  const raw = cache.get(key);
  if (raw === undefined) return undefined;
  try {
    return JSON.parse(raw) as StorageSchema[K];
  } catch {
    return raw as unknown as StorageSchema[K];
  }
}

export function setItem<K extends keyof StorageSchema>(key: K, value: StorageSchema[K]): void {
  const serialized = JSON.stringify(value);
  cache.set(key, serialized);
  // Fire-and-forget persist to AsyncStorage
  AsyncStorage.setItem(`${STORAGE_PREFIX}${key}`, serialized).catch(() => {});
}

export function removeItem<K extends keyof StorageSchema>(key: K): void {
  cache.delete(key);
  AsyncStorage.removeItem(`${STORAGE_PREFIX}${key}`).catch(() => {});
}

// Legacy export for anything that referenced `storage` directly
export const storage = {
  set(key: string, value: string | number | boolean) {
    cache.set(key, String(value));
    AsyncStorage.setItem(`${STORAGE_PREFIX}${key}`, String(value)).catch(() => {});
  },
  getString(key: string) {
    return cache.get(key);
  },
  getNumber(key: string) {
    const val = cache.get(key);
    return val !== undefined ? Number(val) : undefined;
  },
  getBoolean(key: string) {
    const val = cache.get(key);
    return val !== undefined ? val === 'true' : undefined;
  },
  delete(key: string) {
    cache.delete(key);
    AsyncStorage.removeItem(`${STORAGE_PREFIX}${key}`).catch(() => {});
  },
  contains(key: string) {
    return cache.has(key);
  },
  clearAll() {
    const keys = Array.from(cache.keys());
    cache.clear();
    AsyncStorage.multiRemove(keys.map((k) => `${STORAGE_PREFIX}${k}`)).catch(() => {});
  },
  getAllKeys() {
    return Array.from(cache.keys());
  },
};
