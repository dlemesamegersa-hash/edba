import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  sendPasswordResetEmail, signOut,
} from 'firebase/auth';
import { auth } from '../../config/firebase';

const MESSAGES = {
  'auth/invalid-email': 'That email address is not valid.',
  'auth/missing-password': 'Please enter your password.',
  'auth/weak-password': 'Password must be at least 6 characters.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/invalid-credential': 'Incorrect email or password.',
  'auth/user-not-found': 'Incorrect email or password.',
  'auth/wrong-password': 'Incorrect email or password.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
  'auth/network-request-failed': 'No internet connection. Signing in and registering require internet.',
};
export const friendlyAuthError = (e) => MESSAGES[e?.code] || 'Something went wrong. Please try again.';

export const register = (email, password) => createUserWithEmailAndPassword(auth, email.trim(), password);
export const login = (email, password) => signInWithEmailAndPassword(auth, email.trim(), password);
export const resetPassword = (email) => sendPasswordResetEmail(auth, email.trim());
export const logout = () => signOut(auth);
