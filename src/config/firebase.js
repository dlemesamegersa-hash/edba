import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAqOL03GcSsKMr4Kh68w6ZyqsCF7TN0BNE",
  authDomain: "grade9-63b25.firebaseapp.com",
  projectId: "grade9-63b25",
  storageBucket: "grade9-63b25.firebasestorage.app",
  messagingSenderId: "515127189724",
  appId: "1:515127189724:web:2daea77e5a5d8e4be95419",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Auth ONLY. No Firestore / Realtime Database is imported anywhere in this project.
let auth;
try {
  auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
} catch (e) {
  auth = getAuth(app); // already initialised (e.g. fast refresh)
}
export { auth };
