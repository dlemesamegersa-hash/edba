import { CONTENT_CONFIG, ALLOWED_FILE_TYPES } from '../../config';
import placeholderManifest from '../../config/placeholderManifest';
import { cacheManifest, getCachedManifest, setLastSync } from '../storage/metadataStore';

const RAW = 'https://raw.githubusercontent.com';

export const rawUrl = (path) => {
  if (path.includes('..') || path.startsWith('/')) throw new Error(`Unsafe path in manifest: ${path}`);
  const { owner, repo, branch } = CONTENT_CONFIG;
  return `${RAW}/${owner}/${repo}/${branch}/${encodeURI(path)}`; // always HTTPS
};

// A file may give an explicit absolute https "url" (e.g. a GitHub raw PDF link); otherwise "path" is used.
export function fileUrl(f) {
  if (f.url) {
    if (!/^https:\/\//i.test(f.url)) throw new Error(`Only https URLs are allowed: ${f.url}`);
    return f.url;
  }
  return rawUrl(f.path);
}

export function flattenFiles(manifest) {
  const out = [];
  for (const s of manifest.subjects || [])
    for (const c of s.chapters || [])
      for (const f of c.files || []) out.push({ ...f, subjectId: s.id, chapterId: c.id });
  return out;
}

export function validateManifest(m) {
  if (!m || typeof m.contentVersion !== 'string' || !Array.isArray(m.subjects)) throw new Error('Invalid manifest structure');
  for (const f of flattenFiles(m)) {
    if (!f.id || !(f.path || f.url) || !f.type) throw new Error(`Manifest file missing id/path/type: ${JSON.stringify(f)}`);
    const ext = (f.path || f.url).split('?')[0].split('.').pop().toLowerCase();
    if (!(ALLOWED_FILE_TYPES[f.type] || []).includes(ext)) throw new Error(`File type not allowed: ${f.path || f.url}`);
    fileUrl(f);
  }
  return m;
}

// Latest manifest from GitHub; on failure the cached one; if nothing cached, the empty placeholder.
export async function loadManifest() {
  try {
    const res = await fetch(`${rawUrl(CONTENT_CONFIG.manifestPath)}?t=${Date.now()}`);
    if (!res.ok) throw new Error(`GitHub returned HTTP ${res.status}`);
    const m = validateManifest(await res.json());
    await cacheManifest(m);
    await setLastSync(new Date().toISOString());
    return { manifest: m, fromCache: false, placeholder: false };
  } catch (error) {
    const cached = await getCachedManifest();
    if (cached) return { manifest: cached, fromCache: true, placeholder: false, error };
    return { manifest: placeholderManifest, fromCache: true, placeholder: true, error };
  }
}
