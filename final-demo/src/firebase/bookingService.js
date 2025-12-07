// Firestore instance
import { db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy
} from "firebase/firestore";

// CREATE BOOKING
export async function createBooking(data) {
  try {
    await addDoc(collection(db, "bookings"), {
      ...data,
      createdAt: Date.now()
    });
    return { success: true };
  } catch (err) {
    console.error("Booking error:", err);
    return { success: false };
  }
}

// FETCH BOOKINGS FOR USER
export async function fetchBookingsByUser(userId) {
  if (!userId) return [];

  const q = query(
    collection(db, "bookings"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// FETCH BOOKINGS FOR CAR OWNER
export async function fetchBookingsForOwner(ownerId) {
  if (!ownerId) return [];

  const q = query(
    collection(db, "bookings"),
    where("ownerId", "==", ownerId),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ⭐ FETCH ALL BOOKINGS (ADMIN FINANCIAL OVERVIEW)
export async function fetchAllBookings() {
  const q = query(
    collection(db, "bookings"),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
