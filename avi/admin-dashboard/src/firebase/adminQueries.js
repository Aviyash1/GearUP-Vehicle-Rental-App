// adminQueries.js
// Centralized Firestore queries for all admin dashboard sections

import {
  collection,
  getDocs,
  updateDoc,
  doc
} from "firebase/firestore";

import { db } from "./firebaseConfig";

/* ----------------------------------------------------------
   FETCH VEHICLES THAT REQUIRE ADMIN APPROVAL
----------------------------------------------------------- */
export async function fetchPendingVehicles() {
  try {
    const ref = collection(db, "vehicles");
    const snap = await getDocs(ref);

    return snap.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(v => v.status === "Pending Admin Approval");
  } catch (err) {
    console.error("Error loading vehicles:", err);
    return [];
  }
}

/* ----------------------------------------------------------
   ADMIN APPROVES VEHICLE
----------------------------------------------------------- */
export async function approveVehicle(id) {
  try {
    await updateDoc(doc(db, "vehicles", id), {
      status: "Approved"
    });
  } catch (err) {
    console.error("Error approving vehicle:", err);
  }
}

/* ----------------------------------------------------------
   ADMIN DENIES VEHICLE
----------------------------------------------------------- */
export async function denyVehicle(id) {
  try {
    await updateDoc(doc(db, "vehicles", id), {
      status: "Denied"
    });
  } catch (err) {
    console.error("Error denying vehicle:", err);
  }
}

/*FETCH ALL BOOKINGS (PAYMENTS)*/
export async function fetchAllBookings() {
  try {
    const ref = collection(db, "bookings");
    const snap = await getDocs(ref);

    return snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (err) {
    console.error("Error fetching bookings:", err);
    return [];
  }
}
