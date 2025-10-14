import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace with your Firebase config
// Get this from Firebase Console > Project Settings > General > Your apps
const firebaseConfig = {
  apiKey: "AIzaSyCAGZ03maXJ8h5x0_IXA9vwLMzYRXoEnJM",
  authDomain: "lnl-photography.firebaseapp.com",
  projectId: "lnl-photography",
  storageBucket: "lnl-photography.firebasestorage.app",
  messagingSenderId: "695825471257",
  appId: "1:695825471257:web:1222a2332fdd0f5a4d1788",
  measurementId: "G-21GR9RTPCX"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
