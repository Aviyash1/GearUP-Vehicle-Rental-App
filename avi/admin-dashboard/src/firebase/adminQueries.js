// src/firebase/adminQueries.js
// Admin → Firestore actions (verification, vehicles, payments, notifications)

import { 
  getDocs,
  collection,
  deleteDoc,
  updateDoc,
  addDoc,
  doc 
} from "firebase/firestore";

import { db } from "./firebaseConfig";

/* ------------------------------
   FETCH VERIFICATION REQUESTS
-------------------------------- */
export async function fetchVerificationRequests() {
  const snap = await getDocs(collection(db, "verificationRequests"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/* ------------------------------
   FETCH VEHICLES WAITING APPROVAL
-------------------------------- */
export async function fetchCarRequests() {
  const ref = collection(db, "vehicles");
  const snap = await getDocs(ref);

  return snap.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter((v) => v.status === "Pending Admin Approval");
}

/* ------------------------------
   FETCH PAYMENTS
-------------------------------- */
export async function fetchPaymentRequests() {
  const snap = await getDocs(collection(db, "paymentRequests"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/* ------------------------------
   SEND NOTIFICATION TO SPECIFIC USER
-------------------------------- */
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

/* ------------------------------
   APPROVE VEHICLE
-------------------------------- */
export async function approveVehicle(vehicleId, ownerId) {
  const ref = doc(db, "vehicles", vehicleId);

  await updateDoc(ref, {
    status: "Approved"
  });

  await pushAdminNotification({
    ownerId,
    message: "Your vehicle has been approved!",
    title: "Car Approved",
    type: "CAR_APPROVED"
  });
}

/* ------------------------------
   DENY VEHICLE
-------------------------------- */
export async function denyVehicle(vehicleId, ownerId) {
  const ref = doc(db, "vehicles", vehicleId);

  await updateDoc(ref, {
    status: "Denied"
  });

  await pushAdminNotification({
    ownerId,
    message: "Your vehicle has been denied.",
    title: "Car Denied",
    type: "CAR_DENIED"
  });
}

/* ------------------------------
   DELETE ANY ITEM
-------------------------------- */
export async function removeItem(collectionName, id) {
  await deleteDoc(doc(db, collectionName, id));
}
