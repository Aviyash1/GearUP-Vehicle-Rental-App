// notificationService.js
import { db } from "./firebaseConfig";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

export function listenToNotifications(callback) {
  const ref = collection(db, "notifications");
  const q = query(ref, orderBy("createdAt", "desc"));

  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        message: data.message || "",
        title: data.title || "",
        type: data.type || "",
        bookingId: data.bookingId || "",
        userId: data.userId || "",
        createdAt: data.createdAt
          ? new Date(data.createdAt).toLocaleString()
          : "",
        read: data.read || false,
      };
    });

    callback(notifications);
  });
}
