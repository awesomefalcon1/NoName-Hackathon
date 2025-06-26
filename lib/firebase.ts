// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Your web app's Firebase configuration
// IMPORTANT: It's generally recommended to store API keys and other sensitive
// configuration in environment variables, especially for server-side code.
// For client-side Firebase, the config is typically public, but ensure your
// Firebase security rules are properly set up.
const firebaseConfig = {
  apiKey: "AIzaSyC01XSCBk5ug_ebflV8qgXBO5ql7Kx01nY", // User provided
  authDomain: "aibridge-73844.firebaseapp.com",
  projectId: "aibridge-73844",
  storageBucket: "aibridge-73844.appspot.com", // Corrected from firebasestorage.app
  messagingSenderId: "663533012416",
  appId: "1:663533012416:web:332341a048865d512cf425",
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { app, auth, db, storage }
