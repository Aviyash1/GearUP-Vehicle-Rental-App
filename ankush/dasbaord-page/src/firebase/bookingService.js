// Firestore database instance
import { db } from "./firebaseConfig";

// Firestore functions used to read data
import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

// Fetch all bookings from Firestore
export async function fetchBookings() {
  const ref = collection(db, "bookings"); // Reference to bookings collection
  const q = query(ref, orderBy("createdAt", "desc")); // Sort newest first
  const snap = await getDocs(q); // Get all documents
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })); // Convert to array
}
