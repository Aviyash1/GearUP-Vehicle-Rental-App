// src/firebase/carService.js
import { db } from "./firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

export async function fetchCars() {
  const carsRef = collection(db, "vehicles");

  // Only show Approved cars
  const q = query(carsRef, where("status", "==", "Approved"));

  const snap = await getDocs(q);

  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}
