import * as FileSystem from 'expo-file-system/legacy';

// documentDirectory is the app's PRIVATE internal storage on Android: it is not shown in
// Downloads or the gallery, and other apps cannot read it. Android removes it on uninstall.
export const CONTENT_ROOT = `${FileSystem.documentDirectory}content/`;

const safe = (s) => String(s).replace(/[^a-zA-Z0-9_-]/g, '_');

export function filePathFor({ subjectId, chapterId, fileId, ext }) {
  const base = `${CONTENT_ROOT}${safe(subjectId)}/${safe(chapterId)}/${safe(fileId)}`;
  return { final: `${base}.${safe(ext)}`, staging: `${base}.${safe(ext)}.part` };
}

export const ensureDir = async (dir) => FileSystem.makeDirectoryAsync(dir, { intermediates: true }).catch(() => {});
