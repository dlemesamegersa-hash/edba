#!/usr/bin/env node
// Run inside your GitHub content repo (or pass its path) AFTER adding/replacing files:
//   node tools/generate-manifest.js [repoRoot]
// It scans subjects/<subject>/<chapter>/<files>, computes REAL sizes and SHA-256 checksums,
// bumps the version of any file whose bytes changed, and rewrites manifest.json.
// Optional metadata: subjects/<s>/subject.json {name, description}, subjects/<s>/<c>/chapter.json {title}.
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const root = path.resolve(process.argv[2] || '.');
const TYPES = { pdf: 'pdf', html: 'html', htm: 'html', png: 'image', jpg: 'image', jpeg: 'image', webp: 'image' };
const readJson = (p, d) => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { return d; } };
const dirs = (p) => (fs.existsSync(p) ? fs.readdirSync(p, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort() : []);
const title = (s) => s.replace(/[-_]/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
const sha = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');

const prev = readJson(path.join(root, 'manifest.json'), { subjects: [] });
const old = {};
for (const s of prev.subjects || []) for (const c of s.chapters || []) for (const f of c.files || []) old[f.id] = f;

const subjects = [];
for (const sid of dirs(path.join(root, 'subjects'))) {
  const sdir = path.join(root, 'subjects', sid);
  const meta = readJson(path.join(sdir, 'subject.json'), {});
  const chapters = [];
  for (const cid of dirs(sdir)) {
    const cdir = path.join(sdir, cid);
    const cmeta = readJson(path.join(cdir, 'chapter.json'), {});
    const files = [];
    for (const fn of fs.readdirSync(cdir).sort()) {
      const ext = path.extname(fn).slice(1).toLowerCase();
      if (!TYPES[ext]) continue;
      const base = path.basename(fn, '.' + ext);
      const id = `${sid}-${cid}-${base}`;
      const full = path.join(cdir, fn);
      const digest = sha(full);
      const o = old[id];
      let version = o ? o.version : '1.0';
      if (o && o.sha256 !== digest) { const [a, b] = String(o.version).split('.').map(Number); version = `${a || 1}.${(b || 0) + 1}`; }
      files.push({ id, name: (o && o.name) || title(base), type: TYPES[ext], path: `subjects/${sid}/${cid}/${fn}`, version, size: fs.statSync(full).size, sha256: digest, description: (o && o.description) || '' });
    }
    chapters.push({ id: cid, title: cmeta.title || title(cid), files });
  }
  subjects.push({ id: sid, name: meta.name || title(sid), description: meta.description || '', chapters });
}
let cv = prev.contentVersion || '1.0.0';
if (prev.contentVersion && JSON.stringify(prev.subjects) !== JSON.stringify(subjects)) { const p = cv.split('.').map(Number); p[2] = (p[2] || 0) + 1; cv = p.join('.'); }
fs.writeFileSync(path.join(root, 'manifest.json'), JSON.stringify({ contentVersion: cv, lastUpdated: new Date().toISOString(), subjects }, null, 2) + '\n');
console.log(`manifest.json written: contentVersion ${cv}, ${subjects.length} subjects`);
