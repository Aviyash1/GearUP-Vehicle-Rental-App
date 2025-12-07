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
  where
} from "firebase/firestore";

/* ============================
      ADD VEHICLE
=============================== */
export async function addCarToDatabase(vehicleData) {
  console.log("ADDING VEHICLE TO FIRESTORE:", vehicleData);

  if (!vehicleData.ownerId) {
    throw new Error("ownerId is missing, cannot upload vehicle");
  }

  const ref = collection(db, "vehicles");
  return await addDoc(ref, vehicleData);
}

/* ============================
      FETCH ALL VEHICLES
=============================== */
export async function fetchCars() {
  const ref = collection(db, "vehicles");
  const q = query(ref, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

/* ============================
   FETCH VEHICLES BY OWNER
=============================== */
export async function fetchCarsByOwner(ownerId) {
  if (!ownerId) return [];

  const ref = collection(db, "vehicles");
  const q = query(ref, where("ownerId", "==", ownerId));

  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

/* ============================
        UPDATE VEHICLE
=============================== */
export async function updateCar(carId, updatedData) {
  const ref = doc(db, "vehicles", carId);
  await updateDoc(ref, updatedData);
}

/* ============================
        DELETE VEHICLE
=============================== */
export async function deleteCar(carId) {
  const ref = doc(db, "vehicles", carId);
  await deleteDoc(ref);
}
