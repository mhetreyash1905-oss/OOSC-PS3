'use client';

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth } from './firebase';

// ─── Email / Password ─────────────────────────────────────────────────────────

/**
 * Sign in an existing user with email + password.
 */
export async function loginWithEmail(email: string, password: string): Promise<User> {
  if (!auth) throw new Error("Firebase is not configured. Please set NEXT_PUBLIC_FIREBASE_* in your .env.local file.");
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

/**
 * Create a new Firebase account with email + password.
 */
export async function registerWithEmail(email: string, password: string): Promise<User> {
  if (!auth) throw new Error("Firebase is not configured. Please set NEXT_PUBLIC_FIREBASE_* in your .env.local file.");
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  return credential.user;
}

// ─── Google OAuth ─────────────────────────────────────────────────────────────

/**
 * Sign in (or register) with Google via a popup.
 * Works for both new and existing users — Firebase handles the distinction.
 */
export async function loginWithGoogle(): Promise<User> {
  if (!auth) throw new Error("Firebase is not configured. Please set NEXT_PUBLIC_FIREBASE_* in your .env.local file.");
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const credential = await signInWithPopup(auth, provider);
  return credential.user;
}

// ─── Session ──────────────────────────────────────────────────────────────────

/**
 * Sign out the current user. Firebase clears the IndexedDB session.
 */
export async function logout(): Promise<void> {
  if (auth) {
    await signOut(auth);
  }
  window.location.href = '/login';
}

/**
 * Get a fresh Firebase ID token for the currently signed-in user.
 * Firebase automatically refreshes the token if it is close to expiry.
 * Returns null if no user is signed in.
 */
export async function getIdToken(): Promise<string | null> {
  if (!auth) return null;
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
}

/**
 * Returns the currently signed-in Firebase User, or null.
 * NOTE: This is a point-in-time snapshot. Use onAuthChange for reactive state.
 */
export function getCurrentUser(): User | null {
  if (!auth) return null;
  return auth.currentUser;
}

/**
 * Subscribe to auth state changes.
 * The callback fires immediately with the resolved state (from IndexedDB if
 * the user was previously signed in), and again on every sign-in/out.
 * Returns the unsubscribe function.
 */
export function onAuthChange(callback: (user: User | null) => void): () => void {
  if (!auth) {
    // If Firebase isn't initialized, immediately resolve to unauthenticated.
    setTimeout(() => callback(null), 0);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

/**
 * Get the current user's email (point-in-time, may be null before Firebase resolves).
 */
export function getUserEmail(): string | null {
  if (!auth) return null;
  return auth.currentUser?.email ?? null;
}
