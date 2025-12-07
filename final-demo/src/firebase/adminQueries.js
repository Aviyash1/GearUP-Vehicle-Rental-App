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

// Fetch all bookings for admin use
export async function fetchAllBookings() {
  const snap = await getDocs(collection(db, "bookings"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}


/* Load vehicles awaiting admin approval */
export async function fetchCarRequests() {
  const snap = await getDocs(collection(db, "vehicles"));
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter(v => v.status === "Pending Admin Approval");
}

/* Load payment confirmations */
export async function fetchPaymentRequests() {
  const snap = await getDocs(collection(db, "paymentRequests"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/* Approve user verification */
export async function approveVerification(userId, requestId) {
  // Update user document
  await updateDoc(doc(db, "users", userId), {
    verificationStatus: "Approved"
  });

  // Remove the verification request
  await deleteDoc(doc(db, "verificationRequests", requestId));
}

/* Deny user verification */
export async function denyVerification(requestId) {
  await deleteDoc(doc(db, "verificationRequests", requestId));
}

/* Approve a car listing */
export async function approveVehicle(vehicleId, ownerId) {
  await updateDoc(doc(db, "vehicles", vehicleId), { status: "Approved" });

  await pushAdminNotification({
    ownerId,
    message: "Your vehicle has been approved.",
    title: "Car Approved",
    type: "CAR_APPROVED"
  });
}

/* Deny a car listing */
export async function denyVehicle(vehicleId, ownerId) {
  await updateDoc(doc(db, "vehicles", vehicleId), { status: "Denied" });

  await pushAdminNotification({
    ownerId,
    message: "Your vehicle has been denied.",
    title: "Car Denied",
    type: "CAR_DENIED"
  });
}

/* Send notifications to owners */
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
