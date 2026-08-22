import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const requiredKeys = ['apiKey', 'authDomain', 'projectId'];
const missingKeys = requiredKeys.filter((key) => !(firebaseConfig as any)[key]);

if (missingKeys.length > 0) {
  console.warn(`Firebase config is missing required keys: ${missingKeys.join(', ')}. Please set NEXT_PUBLIC_FIREBASE_* environment variables. Authentication will be disabled.`);
}

// Prevent re-initialization on hot reload
const app = missingKeys.length === 0 
  ? (getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0])
  : null;

export const auth = app ? getAuth(app) : (null as any);
export default app;
