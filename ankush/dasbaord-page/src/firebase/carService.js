// src/firebase/carService.js
import { db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

export async function addCarToDatabase(vehicleData) {
  const ref = collection(db, "vehicles");
  const docRef = await addDoc(ref, vehicleData);
  return { id: docRef.id };
}

export async function fetchCars() {
  const ref = collection(db, "vehicles");
  const q = query(ref, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);

  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
