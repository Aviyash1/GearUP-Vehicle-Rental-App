// src/firebase/firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA605kF0jgwYuzPiAlQmcy44E2Rkkb4d_c",
  authDomain: "gearup-1aae6.firebaseapp.com",
  projectId: "gearup-1aae6",
  storageBucket: "gearup-1aae6.firebasestorage.app",
  messagingSenderId: "592275706488",
  appId: "1:592275706488:web:eba0b4fddeb9afdd27938d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Export 
export { db, auth, storage };
