// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCl4Pt_gq0snnoCVnkIlDjvhbI8zLgA6ck",
  authDomain: "pingup-6e155.firebaseapp.com",
  projectId: "pingup-6e155",
  storageBucket: "pingup-6e155.firebasestorage.app",
  messagingSenderId: "191373671087",
  appId: "1:191373671087:web:20b977546d74ee0192725a",
  measurementId: "G-GQDTLW3VXR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth exports
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, provider);
export const logout = () => signOut(auth);