import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA605kF0jgwYuzPiAlQmcy44E2Rkkb4d_c",
  authDomain: "gearup-1aae6.firebaseapp.com",
  projectId: "gearup-1aae6",
  storageBucket: "gearup-1aae6.firebasestorage.app",
  messagingSenderId: "592275706488",
  appId: "1:592275706488:web:eba0b4fddeb9afdd27938d"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
