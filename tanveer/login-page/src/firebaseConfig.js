import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB9JFUnEW-rcO1eZOAooSOBqrj_5uDrkHs",
  authDomain: "gearup-vehicle-rental-app.firebaseapp.com",
  projectId: "gearup-vehicle-rental-app",
  storageBucket: "gearup-vehicle-rental-app.appspot.com",
  messagingSenderId: "703653860985",
  appId: "1:703653860985:web:a3def9a62af93ec811e6a8",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
