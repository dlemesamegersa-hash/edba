import { flattenFiles } from './manifestService';

// Compares remote manifest to the local registry. A file is "modified" if its checksum or version changed.
export function diffManifest(remoteManifest, registry) {
  const remote = flattenFiles(remoteManifest);
  const remoteIds = new Set(remote.map((f) => f.id));
  const added = [], modified = [], unchanged = [];
  for (const f of remote) {
    const local = registry[f.id];
    if (!local) added.push(f);
    else if (local.sha256 !== f.sha256 || local.version !== f.version) modified.push(f);
    else unchanged.push(f);
  }
  const deleted = Object.values(registry).filter((e) => !remoteIds.has(e.id));
  return { added, modified, deleted, unchanged };
}
