import { db, auth } from "./firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export async function createBooking(data) {
  try {
    const docRef = await addDoc(collection(db, "bookings"), {
      ...data,
      createdAt: serverTimestamp(),
    });

    return { success: true, id: docRef.id };
  } catch (err) {
    console.error("Error saving booking:", err);
    return { success: false, error: err };
  }
}
