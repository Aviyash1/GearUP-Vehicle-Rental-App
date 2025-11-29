// adminQueries.js
// Minimal version for Option B.
// Only includes Firestore logic for Car Approval Requests.

import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

// Fetch vehicles waiting for admin approval
export async function fetchPendingVehicles() {
  try {
    const ref = collection(db, "vehicles");
    const snap = await getDocs(ref);

    const pending = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((v) => v.status === "Pending Admin Approval");

    return pending;
  } catch (err) {
    console.error("Error fetching vehicles:", err);
    return [];
  }
}

// Approve a vehicle
export async function approveVehicle(id) {
  try {
    const vehicleRef = doc(db, "vehicles", id);
    await updateDoc(vehicleRef, { status: "Approved" });
  } catch (err) {
    console.error("Approve error:", err);
  }
}

// Deny a vehicle
export async function denyVehicle(id) {
  try {
    const vehicleRef = doc(db, "vehicles", id);
    await updateDoc(vehicleRef, { status: "Denied" });
  } catch (err) {
    console.error("Deny error:", err);
  }
}
