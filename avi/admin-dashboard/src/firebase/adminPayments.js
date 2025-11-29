// adminPayments.js
// Pulls bookings for admin financial overview

import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";

// Fetch all bookings for financial review
export async function fetchAllBookings() {
  try {
    const ref = collection(db, "bookings");
    const snap = await getDocs(ref);

    return snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
}
