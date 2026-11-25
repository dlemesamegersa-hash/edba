# Test checklist (run on an Android emulator/device, not web)
Mark each as you verify it.

1. First install: sign in online, open Downloads, Sync now, download a real published file. Confirm it shows "Offline ready".
2. Offline: airplane mode, force-close and reopen. Open subjects, a PDF, an HTML lesson, an image.
3. GitHub update: replace a PDF, run `node tools/generate-manifest.js`, push, then Sync now. Confirm the new version opens and the old file is gone.
4. Failed download: toggle airplane mode mid-download. Old file must still open. Reconnect and Retry.
5. Storage privacy: file is not in Downloads or Gallery; Android Files app shows nothing; there is no share action.
6. Auth: register, sign out, sign in, reset password email, close/reopen (stays signed in), airplane-mode reopen (stays signed in), new account offline must fail.
7. Checksum: edit manifest sha256 to a wrong value; download must be rejected ("Checksum mismatch") and nothing saved.
8. Placeholder: fresh install with no manifest on GitHub shows placeholder subjects marked "Not published".
