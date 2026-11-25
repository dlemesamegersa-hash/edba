import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { isOnline } from '../utils/network';
import { markVerified, clearSession, isOfflineSessionValid } from '../services/auth/offlineSession';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        await clearSession();
        setUser(null);
        setLoading(false);
        return;
      }
      if (await isOnline()) {
        try {
          await fbUser.reload(); // detects disabled/deleted accounts
          await markVerified(fbUser.uid);
          setSessionExpired(false);
          setUser(fbUser);
        } catch (e) {
          if (e?.code === 'auth/network-request-failed') {
            const ok = await isOfflineSessionValid(fbUser.uid);
            setSessionExpired(!ok);
            setUser(ok ? fbUser : null);
          } else {
            await signOut(auth); // account disabled, deleted or token revoked
            setUser(null);
          }
        }
      } else {
        const ok = await isOfflineSessionValid(fbUser.uid);
        setSessionExpired(!ok);
        setUser(ok ? fbUser : null); // never grants access without a prior online sign-in
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  return <AuthContext.Provider value={{ user, loading, sessionExpired }}>{children}</AuthContext.Provider>;
}
