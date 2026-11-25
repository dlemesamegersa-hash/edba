# Grade 9 Learning - offline-first Android app (Expo / React Native)

All modules are implemented in code. Items marked "TO VERIFY" have NOT been tested on a device; follow TESTING.md.
The web preview (localhost:8081) can only test sign-in and screens: downloads, PDF and HTML viewing need the Android app.

## 1. Install
```
npx create-expo-app@latest grade9-learning --template blank
# copy this project's App.js, app.json, eas.json, src/, tools/, .env.example into it
npx expo install firebase @react-native-async-storage/async-storage @react-native-community/netinfo expo-file-system expo-crypto expo-secure-store expo-status-bar expo-dev-client @expo/vector-icons react-native-webview @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context
npm install react-native-pdf react-native-blob-util
```
react-native-pdf is native code, so Expo Go cannot show PDFs: use a development build (section 4).

## 2. Firebase (Authentication only)
Firebase Console > create project > Build > Authentication > Sign-in method > enable Email/Password.
Project settings > Your apps > add a Web app > copy the config into `.env` (copy `.env.example`).
Do not enable Firestore or Realtime Database. These config values identify your project; they are not private keys.

## 3. GitHub content repository
1. Create a PUBLIC repo (e.g. `grade9-ethiopian-curriculum`). Copy `github-repo-template/` into it.
2. Edit `src/config/index.js`: `owner`, `repo`, `branch`.
3. Upload your PDFs/HTML under `subjects/<subject>/<chapter>/`. Optional names: `subject.json`, `chapter.json`.
4. Run `node tools/generate-manifest.js` in the repo. It computes real size + SHA-256 and bumps versions. Commit and push.
5. PDF LINK PLACEHOLDER: in `manifest.json` each file has `path` (repo-relative) and an optional `url` (absolute https link, e.g. a GitHub raw link). `YOUR_GITHUB_USERNAME`/`YOUR_REPO` are placeholders. Files whose `sha256` is still `REPLACE_WITH_REAL_SHA256` show as "Not published" and cannot be downloaded.
6. Replacing a PDF later: overwrite the file, run the script, commit. The app downloads only files whose checksum changed. No new APK needed.
Private repos: never put a token in the app. Use a small server or signed-URL proxy you control instead (not included).

## 4. Android build
```
npx expo run:android                       # dev build on emulator/device (needs Android Studio SDK)
npx expo run:android --variant release     # local release APK
npm i -g eas-cli && eas build -p android --profile preview   # cloud APK
```

## 5. Private storage
Files live in `FileSystem.documentDirectory/content/...` (app-private internal storage). They are not in Downloads or the gallery, other apps cannot read them, and the app has no share button. `allowBackup` is false. Android deletes them if the app is uninstalled or its data cleared; students must download again.

## 6. How updates work
Sync fetches `manifest.json`, validates it, caches it, and diffs it against the local registry. New files are listed as notifications; downloaded files whose checksum or version changed are re-downloaded automatically. Each download goes to a `.part` file, is SHA-256 verified, then swapped in; the old file is deleted only afterwards. Failures keep the old file. Sync runs on launch and whenever internet returns (can be turned off in Settings), or manually.

## Known limits
- SHA-256 reads the file into memory: test with your largest PDF on a low-end phone (TO VERIFY).
- raw.githubusercontent.com may serve a stale manifest for a few minutes after a push.
- HTML sanitising is regex-based plus JS disabled and a CSP; only publish HTML you author. Lessons can show downloaded images with `<img src="asset:FILE_ID">`.
- Cancel uses pauseAsync on the download (TO VERIFY across devices). Downloads run while the app is open; true background downloading is not implemented.
- Offline sign-in is limited to previously signed-in users for 14 days (`SESSION_POLICY`).
