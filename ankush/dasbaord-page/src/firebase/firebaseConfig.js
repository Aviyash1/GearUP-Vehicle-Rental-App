// Import Firebase initialization functions
import { initializeApp } from "firebase/app";

// Firestore database
import { getFirestore } from "firebase/firestore";

// Firebase storage
import { getStorage } from "firebase/storage";

// Firebase authentication
import { getAuth } from "firebase/auth";

// Firebase project configuration details
const firebaseConfig = {
  apiKey: "AIzaSyA605kF0jgwYuzPiAlQmcy44E2Rkkb4d_c",
  authDomain: "gearup-1aae6.firebaseapp.com",
  projectId: "gearup-1aae6",
  storageBucket: "gearup-1aae6.firebasestorage.app",
  messagingSenderId: "592275706488",
  appId: "1:592275706488:web:eba0b4fddeb9afdd27938d"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Export Firestore, Storage, and Auth services
export const db = getFirestore(app);      
export const storage = getStorage(app);    
export const auth = getAuth(app);          
