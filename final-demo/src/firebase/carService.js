// src/firebase/carService.js

import { db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
  deleteDoc,
  doc,
  updateDoc,
  where,
} from "firebase/firestore";

/* ------------------------------------------------
   ADD VEHICLE (OwnerId MUST be provided)
-------------------------------------------------- */
export async function addCarToDatabase(vehicleData) {
  console.log("ADDING VEHICLE TO FIRESTORE:", vehicleData);

  if (!vehicleData.ownerId) {
    throw new Error("ownerId is missing — cannot upload vehicle.");
  }

  return await addDoc(collection(db, "vehicles"), vehicleData);
}

/* ------------------------------------------------
   FETCH ALL VEHICLES (FOR USERS / SEARCH PAGE)
-------------------------------------------------- */
export async function fetchCars() {
  const q = query(
    collection(db, "vehicles"),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

/* ------------------------------------------------
   FETCH VEHICLES BELONGING TO ONE OWNER ONLY
-------------------------------------------------- */
export async function fetchCarsByOwner(ownerId) {
  if (!ownerId) return [];

  const q = query(
    collection(db, "vehicles"),
    where("ownerId", "==", ownerId),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

/* ------------------------------------------------
   UPDATE VEHICLE (Edit car)
-------------------------------------------------- */
export async function updateCar(carId, updatedData) {
  await updateDoc(doc(db, "vehicles", carId), updatedData);
}

/* ------------------------------------------------
   DELETE VEHICLE
-------------------------------------------------- */
export async function deleteCar(carId) {
  await deleteDoc(doc(db, "vehicles", carId));
}
