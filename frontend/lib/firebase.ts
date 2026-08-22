import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD4w8CgDpeBj51HJhLq3SD6ASxxQT_Jqck",
  authDomain: "oosc-ps3.firebaseapp.com",
  projectId: "oosc-ps3",
  storageBucket: "oosc-ps3.firebasestorage.app",
  messagingSenderId: "57155386126",
  appId: "1:57155386126:web:adf98ac1606868688ef55f",
  measurementId: "G-PDM2N1KHME",
};

// Prevent re-initialization on hot reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export default app;
