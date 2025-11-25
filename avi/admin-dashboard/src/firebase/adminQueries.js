import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

/* FETCH — VERIFICATION REQUESTS */
export async function fetchVerificationRequests() {
  const snapshot = await getDocs(collection(db, "verificationRequests"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/* FETCH — CAR APPROVAL REQUESTS */
export async function fetchCarRequests() {
  const snapshot = await getDocs(collection(db, "carApprovalRequests"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/* FETCH — PAYMENT REQUESTS */
export async function fetchPaymentRequests() {
  const snapshot = await getDocs(collection(db, "payments"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/* PUSH — ADMIN NOTIFICATION */
export async function pushAdminNotification(message, type) {
  await addDoc(collection(db, "adminNotifications"), {
    message,
    type,
    createdAt: new Date(),
    read: false,
  });
}

/* ACTION — REMOVE ITEM ON APPROVAL/DENIAL */
export async function removeItem(collectionName, id) {
  await deleteDoc(doc(db, collectionName, id));
}
