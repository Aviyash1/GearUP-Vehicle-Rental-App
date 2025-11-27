// Import necessary Firebase SDK functions
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration object containing project credentials
const firebaseConfig = {
  apiKey: "AIzaSyA605kF0jgwYuzPiAlQmcy44E2Rkkb4d_c", // API key used to authenticate requests
  authDomain: "gearup-1aae6.firebaseapp.com", // Authentication domain for Firebase Auth
  projectId: "gearup-1aae6", // Unique project identifier
  storageBucket: "gearup-1aae6.firebasestorage.app", // Firebase Storage bucket URL
  messagingSenderId: "592275706488", // Sender ID for Firebase Cloud Messaging
  appId: "1:592275706488:web:eba0b4fddeb9afdd27938d" // Unique app identifier
};

// Initialize Firebase using the configuration
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase services for use throughout the app
export const auth = getAuth(app);       // Firebase Authentication
export const db = getFirestore(app);    // Firestore database
export const storage = getStorage(app); // Firebase Storage

export default app; // Export the initialized Firebase app
