// src/firebase/bookingService.js
import { db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";

/* ---------------------------------------
   CREATE BOOKING
---------------------------------------- */
export async function createBooking(data) {
  try {
    const docRef = await addDoc(collection(db, "bookings"), data);
    return { success: true, id: docRef.id };
  } catch (err) {
    console.error("Error creating booking:", err);
    return { success: false, error: err };
  }
}

/* ---------------------------------------
   FETCH BOOKINGS FOR USER
---------------------------------------- */
export async function fetchBookingsByUser(userId) {
  try {
    const q = query(
      collection(db, "bookings"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const snap = await getDocs(q);

    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
  } catch (err) {
    console.error("Error fetching user bookings:", err);
    return [];
  }
}

/* ---------------------------------------
   FETCH BOOKINGS FOR OWNER
---------------------------------------- */
export async function fetchBookingsForOwner(ownerId) {
  try {
    const q = query(
      collection(db, "bookings"),
      where("ownerId", "==", ownerId),
      orderBy("createdAt", "desc")
    );

    const snap = await getDocs(q);

    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
  } catch (err) {
    console.error("Error fetching owner bookings:", err);
    return [];
  }
}

/* ---------------------------------------
             CANCEL BOOKING  
---------------------------------------- */
export async function cancelBooking(bookingId) {
  try {
    await updateDoc(doc(db, "bookings", bookingId), {
      status: "Cancelled",
      cancelledAt: Date.now(),
    });

    return { success: true };
  } catch (err) {
    console.error("Error cancelling booking:", err);
    return { success: false, error: err };
  }
}
