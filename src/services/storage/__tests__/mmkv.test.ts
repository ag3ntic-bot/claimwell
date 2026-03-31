jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn(), replace: jest.fn() }),
  useLocalSearchParams: () => ({}),
  Link: 'Link',
  Redirect: 'Redirect',
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

import { storage, getItem, setItem, removeItem } from '../mmkv';

describe('MMKV storage service', () => {
  beforeEach(() => {
    storage.clearAll();
  });

  // ---------- raw storage ----------
  describe('raw storage (set / getString / delete)', () => {
    it('stores and retrieves a string value', () => {
      storage.set('testKey', 'hello');
      expect(storage.getString('testKey')).toBe('hello');
    });

    it('returns undefined for a missing key', () => {
      expect(storage.getString('nonexistent')).toBeUndefined();
    });

    it('deletes a stored key', () => {
      storage.set('toDelete', 'value');
      expect(storage.contains('toDelete')).toBe(true);

      storage.delete('toDelete');
      expect(storage.getString('toDelete')).toBeUndefined();
      expect(storage.contains('toDelete')).toBe(false);
    });

    it('clearAll removes all keys', () => {
      storage.set('k1', 'v1');
      storage.set('k2', 'v2');
      expect(storage.getAllKeys().length).toBe(2);

      storage.clearAll();
      expect(storage.getAllKeys().length).toBe(0);
    });
  });

  // ---------- typed getItem / setItem ----------
  describe('getItem / setItem (typed JSON wrapper)', () => {
    it('stores and retrieves an object via JSON serialization', () => {
      const draft = { title: 'My Claim', step: 2 };
      setItem('claimDrafts', draft);

      const retrieved = getItem('claimDrafts');
      expect(retrieved).toEqual(draft);
    });

    it('stores and retrieves a boolean value', () => {
      setItem('onboardingComplete', true);
      expect(getItem('onboardingComplete')).toBe(true);
    });

    it('stores and retrieves a string value', () => {
      setItem('lastViewedClaimId', 'clm_01');
      expect(getItem('lastViewedClaimId')).toBe('clm_01');
    });

    it('returns undefined for missing key', () => {
      expect(getItem('claimDrafts')).toBeUndefined();
    });

    it('removeItem deletes the typed key', () => {
      setItem('onboardingComplete', true);
      expect(getItem('onboardingComplete')).toBe(true);

      removeItem('onboardingComplete');
      expect(getItem('onboardingComplete')).toBeUndefined();
    });
  });

  // ---------- edge case: invalid JSON ----------
  describe('edge case: invalid JSON stored', () => {
    it('handles non-JSON string gracefully by returning raw value', () => {
      storage.set('lastViewedClaimId', 'not-valid-json');
      const result = getItem('lastViewedClaimId');
      expect(result).toBe('not-valid-json');
    });

    it('handles corrupted JSON gracefully', () => {
      storage.set('claimDrafts', '{broken json!!!');
      const result = getItem('claimDrafts');
      expect(result).toBe('{broken json!!!');
    });
  });
});
