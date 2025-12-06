// Firestore database instance
import { db } from "./firebaseConfig";

// Firestore functions for real-time updates
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

// Listen to notifications in real time
export function listenToNotifications(callback) {
  const ref = collection(db, "notifications"); // Collection reference
  const q = query(ref, orderBy("createdAt", "desc")); // Sort newest first

  // Listen for live updates on this query
  return onSnapshot(q, (snapshot) => {
    // Convert Firestore docs to array of objects
    const notifications = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id, // Notification document ID
        message: data.message || "",
        title: data.title || "",
        type: data.type || "",
        bookingId: data.bookingId || "",
        userId: data.userId || "",
        // Convert timestamp to readable date
        createdAt: data.createdAt
          ? new Date(data.createdAt).toLocaleString()
          : "",
        read: data.read || false,
      };
    });

    // Send updated data back to the component
    callback(notifications);
  });
}
