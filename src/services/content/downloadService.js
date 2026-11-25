import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { fileUrl } from './manifestService';
import { filePathFor, ensureDir } from '../storage/paths';
import { sha256OfFile } from '../../utils/hash';
import { upsertFile, removeFileEntry } from '../storage/metadataStore';
import { isOnline } from '../../utils/network';

// A file is downloadable only when the manifest carries a real SHA-256 (no placeholder checksums).
export const isPublished = (f) => /^[a-f0-9]{64}$/i.test(f?.sha256 || '');

const active = new Map(); // fileId -> state (duplicate-download prevention)
const err = (message, code) => Object.assign(new Error(message), { code });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const del = (p) => FileSystem.deleteAsync(p, { idempotent: true });

async function attempt(file, state, onProgress) {
  const ext = (file.path || file.url).split('?')[0].split('.').pop().toLowerCase();
  const { final, staging } = filePathFor({ subjectId: file.subjectId, chapterId: file.chapterId, fileId: file.id, ext });
  await ensureDir(final.slice(0, final.lastIndexOf('/') + 1));
  await del(staging);
  let last = 0;
  const dl = FileSystem.createDownloadResumable(fileUrl(file), staging, {}, (p) => {
    if (!p.totalBytesExpectedToWrite) return;
    const v = p.totalBytesWritten / p.totalBytesExpectedToWrite;
    if (v - last >= 0.02 || v === 1) { last = v; onProgress && onProgress(v); }
  });
  state.resumable = dl;
  let res;
  try { res = await dl.downloadAsync(); } catch (e) { if (state.cancelled) throw err('Cancelled', 'CANCELLED'); throw e; }
  if (state.cancelled) { await del(staging); throw err('Cancelled', 'CANCELLED'); }
  if (!res || res.status !== 200) { await del(staging); throw err(`Server returned ${res ? res.status : 'no response'}`, 'HTTP'); }

  // Verify BEFORE touching the existing valid file.
  const hash = await sha256OfFile(staging);
  if (hash.toLowerCase() !== file.sha256.toLowerCase()) { await del(staging); throw err('Checksum mismatch: file rejected', 'CHECKSUM'); }

  const bak = `${final}.bak`;
  const hadOld = (await FileSystem.getInfoAsync(final)).exists;
  if (hadOld) { await del(bak); await FileSystem.moveAsync({ from: final, to: bak }); }
  try {
    await FileSystem.moveAsync({ from: staging, to: final });
  } catch (e) {
    if (hadOld) await FileSystem.moveAsync({ from: bak, to: final }); // restore previous valid content
    throw e;
  }
  if (hadOld) await del(bak);

  const info = await FileSystem.getInfoAsync(final);
  const entry = {
    id: file.id, subjectId: file.subjectId, chapterId: file.chapterId, name: file.name, type: file.type,
    version: file.version, sha256: file.sha256, size: info.size || file.size || 0,
    localPath: final, downloadedAt: new Date().toISOString(),
  };
  await upsertFile(entry); // registry updated only after verification + swap succeeded
  return entry;
}

export function downloadFile(file, onProgress, attempts = 3) {
  if (Platform.OS === 'web') return Promise.reject(err('Downloads need the Android app (not the web preview).', 'WEB'));
  if (!isPublished(file)) return Promise.reject(err('This material has not been published yet.', 'UNPUBLISHED'));
  if (active.has(file.id)) return active.get(file.id).promise;
  const state = { cancelled: false, resumable: null };
  state.promise = (async () => {
    try {
      let lastError;
      for (let i = 0; i < attempts; i++) {
        if (state.cancelled) throw err('Cancelled', 'CANCELLED');
        if (!(await isOnline())) throw err('No internet connection.', 'OFFLINE');
        try { return await attempt(file, state, onProgress); }
        catch (e) { lastError = e; if (e.code === 'CANCELLED') throw e; if (i < attempts - 1) await wait(1000 * 2 ** i); }
      }
      throw lastError;
    } finally { active.delete(file.id); }
  })();
  active.set(file.id, state);
  return state.promise;
}

export async function cancelDownload(id) {
  const s = active.get(id);
  if (!s) return;
  s.cancelled = true;
  try { await s.resumable?.pauseAsync(); } catch { /* ignore */ }
}

export async function removeDownloaded(entry) {
  if (!entry) return;
  await del(entry.localPath); // deletes only this file, from private storage
  await removeFileEntry(entry.id);
}
