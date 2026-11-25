import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';
import { loadManifest, flattenFiles } from '../services/content/manifestService';
import { diffManifest } from '../services/content/manifestDiff';
import { downloadFile, cancelDownload, removeDownloaded, isPublished } from '../services/content/downloadService';
import * as store from '../services/storage/metadataStore';
import { subscribeToNetwork, isOnline } from '../utils/network';
import { CONTENT_ROOT } from '../services/storage/paths';
import placeholderManifest from '../config/placeholderManifest';

const Ctx = createContext(null);
export const useContent = () => useContext(Ctx);
const without = (o, k) => { const n = { ...o }; delete n[k]; return n; };

export function ContentProvider({ children }) {
  const [manifest, setManifest] = useState(placeholderManifest);
  const [isPlaceholder, setIsPlaceholder] = useState(true);
  const [registry, setRegistry] = useState({});
  const [progress, setProgress] = useState({});
  const [errors, setErrors] = useState({});
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState(null);
  const [lastSync, setLastSync] = useState(null);
  const [online, setOnline] = useState(true);
  const [settings, setSettings] = useState({ autoSync: true });
  const [recents, setRecents] = useState([]);
  const [completed, setCompleted] = useState({});
  const [newIds, setNewIds] = useState([]);

  const manifestRef = useRef(placeholderManifest);
  const placeholderRef = useRef(true);
  const settingsRef = useRef({ autoSync: true });
  const syncingRef = useRef(false);
  const readyRef = useRef(false);

  const files = useMemo(() => flattenFiles(manifest), [manifest]);
  const updates = useMemo(() => diffManifest(manifest, registry), [manifest, registry]);

  const runDownload = useCallback(async (file) => {
    setErrors((e) => without(e, file.id));
    setProgress((p) => ({ ...p, [file.id]: 0 }));
    try {
      await downloadFile(file, (v) => setProgress((p) => ({ ...p, [file.id]: v })));
      setRegistry(await store.getRegistry());
      setNewIds((ids) => { const n = ids.filter((i) => i !== file.id); store.setKV('newIds_v1', n); return n; });
    } catch (e) {
      if (e.code !== 'CANCELLED') setErrors((x) => ({ ...x, [file.id]: e.message }));
    } finally {
      setProgress((p) => without(p, file.id));
    }
  }, []);

  const sync = useCallback(async ({ manual = false } = {}) => {
    if (syncingRef.current) return; // prevents overlapping syncs
    if (!(await isOnline())) { if (manual) setSyncError('No internet connection.'); return; }
    syncingRef.current = true; setSyncing(true); setSyncError(null);
    try {
      const prevIds = placeholderRef.current ? null : new Set(flattenFiles(manifestRef.current).map((f) => f.id));
      const res = await loadManifest();
      manifestRef.current = res.manifest; placeholderRef.current = res.placeholder;
      setManifest(res.manifest); setIsPlaceholder(res.placeholder);
      if (res.fromCache) { setSyncError('Could not reach GitHub content. Showing saved content.'); return; }
      setLastSync(await store.getLastSync());
      const reg = await store.getRegistry();
      if (prevIds) {
        const fresh = flattenFiles(res.manifest).filter((f) => !prevIds.has(f.id) && !reg[f.id] && isPublished(f)).map((f) => f.id);
        if (fresh.length) setNewIds((ids) => { const n = [...new Set([...ids, ...fresh])]; store.setKV('newIds_v1', n); return n; });
      }
      // Incremental update: re-download only downloaded files whose checksum/version changed.
      for (const f of diffManifest(res.manifest, reg).modified) if (isPublished(f)) await runDownload(f);
    } catch (e) {
      setSyncError(e.message);
    } finally { syncingRef.current = false; setSyncing(false); }
  }, [runDownload]);

  useEffect(() => {
    (async () => {
      const [reg, cached, ls, st, rec, comp, nids] = await Promise.all([
        store.getRegistry(), store.getCachedManifest(), store.getLastSync(),
        store.getKV('settings_v1', { autoSync: true }), store.getKV('recents_v1', []),
        store.getKV('completed_v1', {}), store.getKV('newIds_v1', []),
      ]);
      setRegistry(reg); setLastSync(ls); setSettings(st); settingsRef.current = st;
      setRecents(rec); setCompleted(comp); setNewIds(nids);
      if (cached) { manifestRef.current = cached; placeholderRef.current = false; setManifest(cached); setIsPlaceholder(false); }
      const on = await isOnline(); setOnline(on); readyRef.current = true;
      if (on && st.autoSync) sync();
    })();
    return subscribeToNetwork((on) => { setOnline(on); if (on && readyRef.current && settingsRef.current.autoSync) sync(); });
  }, [sync]);

  const statusOf = useCallback((f) => {
    const local = registry[f.id];
    if (progress[f.id] !== undefined) return { state: 'downloading', progress: progress[f.id], local };
    if (errors[f.id]) return { state: 'failed', error: errors[f.id], local };
    if (local) {
      const outdated = isPublished(f) && (local.sha256 !== f.sha256 || local.version !== f.version);
      return { state: outdated ? 'update' : 'downloaded', local };
    }
    return { state: isPublished(f) ? 'available' : 'unpublished' };
  }, [registry, progress, errors]);

  const subjectName = useCallback((id) => manifest.subjects.find((s) => s.id === id)?.name || id, [manifest]);
  const download = runDownload;
  const cancel = useCallback((id) => cancelDownload(id), []);
  const downloadAll = useCallback(async (list) => { for (const f of list) if (isPublished(f) && !registry[f.id]) await runDownload(f); }, [registry, runDownload]);
  const updateAll = useCallback(async () => { for (const f of updates.modified) if (isPublished(f)) await runDownload(f); }, [updates, runDownload]);
  const remove = useCallback(async (id) => { await removeDownloaded(registry[id]); setRegistry(await store.getRegistry()); }, [registry]);
  const clearAll = useCallback(async () => {
    if (Platform.OS !== 'web') await FileSystem.deleteAsync(CONTENT_ROOT, { idempotent: true });
    await store.clearRegistry(); setRegistry({});
  }, []);
  const dismissNew = useCallback(() => { setNewIds([]); store.setKV('newIds_v1', []); }, []);
  const setAutoSync = useCallback((v) => { const s = { ...settingsRef.current, autoSync: v }; settingsRef.current = s; setSettings(s); store.setKV('settings_v1', s); }, []);
  const markOpened = useCallback((entry) => {
    setRecents((r) => { const n = [entry, ...r.filter((x) => x.id !== entry.id)].slice(0, 8); store.setKV('recents_v1', n); return n; });
    setCompleted((c) => { if (c[entry.id]) return c; const n = { ...c, [entry.id]: true }; store.setKV('completed_v1', n); return n; });
  }, []);

  const value = {
    manifest, isPlaceholder, files, registry, updates, newIds, progress, errors, syncing, syncError, lastSync, online,
    settings, recents, completed, statusOf, subjectName, sync, download, cancel, downloadAll, updateAll, remove, clearAll,
    dismissNew, setAutoSync, markOpened,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
