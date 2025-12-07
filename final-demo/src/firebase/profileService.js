// firebase/profileService.js
import { db } from "./firebaseConfig"; 
import { doc, getDoc, setDoc } from "firebase/firestore";

/**
 * Fetch a profile for a specific user
 */
export const fetchProfile = async (userId) => {
  const ref = doc(db, "profiles", userId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;
  return snap.data();
};

/**
 * Save/update profile data for a user
 */
export const saveProfile = async (userId, profileData) => {
  const ref = doc(db, "profiles", userId);
  await setDoc(ref, profileData, { merge: true });
};
