// Firestore database instance
import { db } from "./firebaseConfig";

// Firestore functions
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  doc,
  deleteDoc
} from "firebase/firestore";

// Add a new vehicle to Firestore
export async function addCarToDatabase(vehicleData) {
  const ref = collection(db, "vehicles"); // Collection path
  const docRef = await addDoc(ref, vehicleData); // Create new document
  return { id: docRef.id }; // Return ID of new car
}

// Fetch all vehicles from Firestore
export async function fetchCars() {
  const ref = collection(db, "vehicles"); // Collection reference
  const q = query(ref, orderBy("createdAt", "desc")); // Sort newest first
  const snap = await getDocs(q); // Get all documents
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })); // Convert to array
}

// Delete a vehicle by ID
export async function deleteCarFromDatabase(carId) {
  const ref = doc(db, "vehicles", carId); // Path to specific document
  await deleteDoc(ref); // Delete document
}
