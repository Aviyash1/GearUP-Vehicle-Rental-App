// src/firebase/adminQueries.js
// Centralised backend helpers for all admin actions.

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

/* Load vehicles sitting in review, waiting for admin decision */
export async function fetchCarRequests() {
  const snap = await getDocs(collection(db, "vehicles"));
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter(v => v.status === "Pending Admin Approval");
}

/* Load pending payment confirmations */
export async function fetchPaymentRequests() {
  const snap = await getDocs(collection(db, "paymentRequests"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/* Send a targeted push notification to a specific owner */
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

/* Removes a record from any collection when admin resolves it */
export async function removeItem(collectionName, id) {
  await deleteDoc(doc(db, collectionName, id));
}
