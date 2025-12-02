// src/firebase/adminQueries.js
// Backbone functions for Admin Dashboard

import { 
  getDocs, 
  collection, 
  deleteDoc, 
  updateDoc, 
  addDoc, 
  doc 
} from "firebase/firestore";

import { db } from "./firebaseConfig";

// READ verification requests
export async function fetchVerificationRequests() {
  const snap = await getDocs(collection(db, "verificationRequests"));
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// READ car approval requests
export async function fetchCarRequests() {
  const snap = await getDocs(collection(db, "vehicles"));
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// READ pending payments
export async function fetchPaymentRequests() {
  const snap = await getDocs(collection(db, "paymentRequests"));
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Add notification to Firestore (future connection)
export async function pushAdminNotification(message, type) {
  await addDoc(collection(db, "adminNotifications"), {
    message,
    type,
    timestamp: Date.now()
  });
}

// Delete from any collection
export async function removeItem(collectionName, id) {
  await deleteDoc(doc(db, collectionName, id));
}
