// src/firebase/adminQueries.js

import {
  getDocs,
  collection,
  deleteDoc,
  updateDoc,
  addDoc,
  doc
} from "firebase/firestore";

import { db } from "./firebaseConfig";

/* Load identity verification submissions */
export async function fetchVerificationRequests() {
  const snap = await getDocs(collection(db, "verificationRequests"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/* Fetch all bookings for admin use */
export async function fetchAllBookings() {
  const snap = await getDocs(collection(db, "bookings"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/* Load cars awaiting admin approval */
export async function fetchCarRequests() {
  const snap = await getDocs(collection(db, "vehicles"));
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter(v => v.status === "Pending Admin Approval");
}

/* Load payment confirmations */
export async function fetchPaymentRequests() {
  const snap = await getDocs(collection(db, "payments"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/* --------------------------------------------------
   FIXED: Approve verification
   Correct argument order:
   approveVerification(requestId, userId)
-------------------------------------------------- */
export async function approveVerification(requestId, userId) {
  // Update the user document (Firestore UID)
  await updateDoc(doc(db, "users", userId), {
    verified: true        // NEW STANDARD FIELD
  });

  // Delete the verification request
  await deleteDoc(doc(db, "verificationRequests", requestId));
}

/* Deny user verification */
export async function denyVerification(requestId) {
  await deleteDoc(doc(db, "verificationRequests", requestId));
}

/* Approve a vehicle */
export async function approveVehicle(vehicleId, ownerId) {
  await updateDoc(doc(db, "vehicles", vehicleId), { status: "Approved" });

  await pushAdminNotification({
    ownerId,
    message: "Your vehicle has been approved.",
    title: "Car Approved",
    type: "CAR_APPROVED"
  });
}

/* Deny a vehicle */
export async function denyVehicle(vehicleId, ownerId) {
  await updateDoc(doc(db, "vehicles", vehicleId), { status: "Denied" });

  await pushAdminNotification({
    ownerId,
    message: "Your vehicle has been denied.",
    title: "Car Denied",
    type: "CAR_DENIED"
  });
}

/* Send notification to owner */
export async function pushAdminNotification({
  ownerId,
  message,
  title = "Notification",
  type = "GENERAL"
}) {
  if (!ownerId) return;

  await addDoc(collection(db, "notifications"), {
    ownerId,
    message,
    title,
    type,
    read: false,
    createdAt: Date.now()
  });
}
