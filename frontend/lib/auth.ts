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

// Subscriptions listener array for local demo session state sync
const authListeners: Set<(user: User | null) => void> = new Set();

function createDemoUser(email?: string, name?: string): any {
  const userEmail = email || "citizen@civicsaathi.in";
  return {
    uid: `demo_user_${userEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
    email: userEmail,
    displayName: name || userEmail.split('@')[0],
    getIdToken: async () => "demo_firebase_token_12345",
  };
}

function getStoredDemoUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('civicsaathi_demo_user');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      ...parsed,
      getIdToken: async () => "demo_firebase_token_12345",
    } as User;
  } catch {
    return null;
  }
}

function setStoredDemoUser(user: any | null) {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem('civicsaathi_demo_user', JSON.stringify({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
    }));
  } else {
    localStorage.removeItem('civicsaathi_demo_user');
  }
  // Notify subscribers
  authListeners.forEach(fn => fn(getStoredDemoUser()));
}

// ─── Email / Password ─────────────────────────────────────────────────────────

export async function loginWithEmail(email: string, password: string): Promise<User> {
  try {
    if (auth) {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      setStoredDemoUser(null);
      return credential.user;
    }
  } catch (err: any) {
    // If API key is invalid or unconfigured, fallback to seamless demo sign-in
    if (err?.code === 'auth/api-key-not-valid' || err?.code === 'auth/invalid-api-key' || !auth) {
      console.warn('Firebase API key unconfigured or invalid. Falling back to local demo sign-in.');
      const demo = createDemoUser(email);
      setStoredDemoUser(demo);
      return demo as User;
    }
    throw err;
  }
  const demo = createDemoUser(email);
  setStoredDemoUser(demo);
  return demo as User;
}

export async function registerWithEmail(email: string, password: string): Promise<User> {
  try {
    if (auth) {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      setStoredDemoUser(null);
      return credential.user;
    }
  } catch (err: any) {
    if (err?.code === 'auth/api-key-not-valid' || err?.code === 'auth/invalid-api-key' || !auth) {
      console.warn('Firebase API key unconfigured or invalid. Falling back to local demo registration.');
      const demo = createDemoUser(email);
      setStoredDemoUser(demo);
      return demo as User;
    }
    throw err;
  }
  const demo = createDemoUser(email);
  setStoredDemoUser(demo);
  return demo as User;
}

// ─── Google OAuth ─────────────────────────────────────────────────────────────

export async function loginWithGoogle(): Promise<User> {
  try {
    if (auth) {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const credential = await signInWithPopup(auth, provider);
      setStoredDemoUser(null);
      return credential.user;
    }
  } catch (err: any) {
    if (err?.code === 'auth/api-key-not-valid' || err?.code === 'auth/invalid-api-key' || err?.code === 'auth/popup-closed-by-user' || !auth) {
      console.warn('Firebase Google sign-in unconfigured or failed. Falling back to local Google sign-in.');
      const demo = createDemoUser('google.citizen@civicsaathi.in', 'Google User');
      setStoredDemoUser(demo);
      return demo as User;
    }
    throw err;
  }
  const demo = createDemoUser('google.citizen@civicsaathi.in', 'Google User');
  setStoredDemoUser(demo);
  return demo as User;
}

// ─── Session ──────────────────────────────────────────────────────────────────

export async function logout(): Promise<void> {
  setStoredDemoUser(null);
  if (auth) {
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
  }
  window.location.href = '/login';
}

export async function getIdToken(): Promise<string | null> {
  const demoUser = getStoredDemoUser();
  if (demoUser) return "demo_firebase_token_12345";

  if (!auth) return null;
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
}

export function getCurrentUser(): User | null {
  const demoUser = getStoredDemoUser();
  if (demoUser) return demoUser;

  if (!auth) return null;
  return auth.currentUser;
}

export function onAuthChange(callback: (user: User | null) => void): () => void {
  authListeners.add(callback);

  const demoUser = getStoredDemoUser();
  if (demoUser) {
    setTimeout(() => callback(demoUser), 0);
  }

  let unsubscribeFirebase = () => {};
  if (auth) {
    unsubscribeFirebase = onAuthStateChanged(auth, (firebaseUser) => {
      const activeDemo = getStoredDemoUser();
      if (activeDemo) {
        callback(activeDemo);
      } else {
        callback(firebaseUser);
      }
    });
  } else if (!demoUser) {
    setTimeout(() => callback(null), 0);
  }

  return () => {
    authListeners.delete(callback);
    unsubscribeFirebase();
  };
}

export function getUserEmail(): string | null {
  const demoUser = getStoredDemoUser();
  if (demoUser) return demoUser.email;

  if (!auth) return null;
  return auth.currentUser?.email ?? null;
}
