// Get Firebase auth instance
import { auth } from "./firebaseConfig";

// Firebase auth methods
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

// Log in user with email and password
export const loginUser = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

// Log out current user
export const logoutUser = () => signOut(auth);
