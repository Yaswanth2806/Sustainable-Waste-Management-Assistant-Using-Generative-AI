import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "../services/firebase.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(!isFirebaseConfigured);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }
    // Firebase Auth state listener guards protected routes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signUp = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const logIn = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const logOut = async () => {
    if (isFirebaseConfigured) await signOut(auth);
    setUser(null);
    setIsDemoMode(false);
  };

  const launchDemoMode = () => {
    setIsDemoMode(true);
  };

  const userId = user?.uid || (isDemoMode ? "demo-user" : null);

  const value = {
    user,
    userId,
    isDemoMode,
    isAuthenticated: Boolean(user) || isDemoMode,
    loading,
    isFirebaseConfigured,
    signUp,
    logIn,
    signInWithGoogle,
    logOut,
    launchDemoMode,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
