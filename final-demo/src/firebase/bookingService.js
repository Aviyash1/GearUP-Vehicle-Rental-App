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

/* ------------------------------------------------
   CREATE BOOKING
-------------------------------------------------- */
export async function createBooking(data) {
  try {
    const docRef = await addDoc(collection(db, "bookings"), data);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error creating booking:", error);
    return { success: false, error };
  }
}

/* ------------------------------------------------
   FETCH BOOKINGS FOR A USER ("My Bookings")
-------------------------------------------------- */
export async function fetchBookingsByUser(userId) {
  if (!userId) return [];

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
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return [];
  }
}

/* ------------------------------------------------
   FETCH BOOKINGS FOR AN OWNER (Owner Dashboard)
-------------------------------------------------- */
export async function fetchBookingsForOwner(ownerId) {
  if (!ownerId) return [];

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
  } catch (error) {
    console.error("Error fetching owner bookings:", error);
    return [];
  }
}

/* ------------------------------------------------
   CANCEL BOOKING
-------------------------------------------------- */
export async function cancelBooking(bookingId) {
  try {
    await updateDoc(doc(db, "bookings", bookingId), {
      status: "Cancelled",
      cancelledAt: Date.now(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return { success: false, error };
  }
}
