import AsyncStorage from '@react-native-async-storage/async-storage';

// Local registry of downloaded files, keyed by manifest file id.
// Entry: { id, subjectId, chapterId, name, type, version, sha256, size, localPath, downloadedAt }
const REG = 'registry_v1';
const MANIFEST = 'manifest_cache_v1';
const SYNC = 'last_sync_v1';

const read = async (k, fallback) => {
  try { const v = await AsyncStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
};

export const getRegistry = () => read(REG, {});
export async function upsertFile(entry) {
  const r = await getRegistry(); r[entry.id] = entry;
  await AsyncStorage.setItem(REG, JSON.stringify(r));
}
export async function removeFileEntry(id) {
  const r = await getRegistry(); delete r[id];
  await AsyncStorage.setItem(REG, JSON.stringify(r));
}
export const getCachedManifest = () => read(MANIFEST, null);
export const cacheManifest = (m) => AsyncStorage.setItem(MANIFEST, JSON.stringify(m));
export const getLastSync = () => read(SYNC, null);
export const setLastSync = (iso) => AsyncStorage.setItem(SYNC, JSON.stringify(iso));

export const getKV = read;
export const setKV = (k, v) => AsyncStorage.setItem(k, JSON.stringify(v));
export const clearRegistry = () => AsyncStorage.removeItem(REG);
