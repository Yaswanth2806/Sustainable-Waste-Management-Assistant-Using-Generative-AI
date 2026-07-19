/**
 * firebase.js — initializes the Firebase client SDK (Auth) for the
 * WasteGuide AI frontend. If the required env vars are not set, Firebase
 * is left uninitialized and the app automatically runs in Demo Mode.
 */
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY?.trim(),
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN?.trim(),
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID?.trim(),
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET?.trim(),
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID?.trim(),
  appId: import.meta.env.VITE_FIREBASE_APP_ID?.trim(),
};

export const isFirebaseConfigured = Boolean(config.apiKey && config.projectId);

let app = null;
let auth = null;

if (isFirebaseConfigured) {
  app = initializeApp(config);
  auth = getAuth(app);
}

export { app, auth };
