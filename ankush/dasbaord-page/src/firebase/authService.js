// src/firebase/authService.js
import { auth } from "./firebaseConfig";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

export const loginUser = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const logoutUser = () => signOut(auth);
