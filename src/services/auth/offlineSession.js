import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SESSION_POLICY } from '../../config';

const KEY = 'offline_session_v1';
const DAY = 24 * 60 * 60 * 1000;
// SecureStore (Android Keystore) on devices; AsyncStorage only on web, where SecureStore is unavailable.
const kv = Platform.OS === 'web'
  ? { set: (k, v) => AsyncStorage.setItem(k, v), get: (k) => AsyncStorage.getItem(k), del: (k) => AsyncStorage.removeItem(k) }
  : { set: SecureStore.setItemAsync, get: SecureStore.getItemAsync, del: SecureStore.deleteItemAsync };

// Stores only the uid and the time of the last ONLINE verification. No password or token.
export const markVerified = (uid) => kv.set(KEY, JSON.stringify({ uid, verifiedAt: Date.now() }));
export const clearSession = () => kv.del(KEY);

export async function isOfflineSessionValid(uid) {
  const raw = await kv.get(KEY);
  if (!raw) return false;
  try {
    const { uid: savedUid, verifiedAt } = JSON.parse(raw);
    const age = Date.now() - verifiedAt;
    return savedUid === uid && age >= 0 && age <= SESSION_POLICY.maxOfflineDays * DAY;
  } catch { return false; }
}
