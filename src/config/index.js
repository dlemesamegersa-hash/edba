// Central configuration. Change these values to point the app at your own content repository.
export const CONTENT_CONFIG = {
  owner: 'YOUR_GITHUB_USERNAME',
  repo: 'grade9-ethiopian-curriculum',
  branch: 'main',
  manifestPath: 'manifest.json',
};

// Offline session policy: a previously signed-in student may use the app offline
// for this many days since the last successful online verification.
export const SESSION_POLICY = { maxOfflineDays: 14 };

// Whitelist of file types the app will download and the extensions allowed for each.
export const ALLOWED_FILE_TYPES = {
  pdf: ['pdf'],
  html: ['html', 'htm'],
  image: ['png', 'jpg', 'jpeg', 'webp'],
};
