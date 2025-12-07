import { db } from "./firebaseConfig";
import { collection, addDoc, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";

// ADD TO FAVOURITES
export async function addFavourite(userId, car) {
  try {
    await addDoc(collection(db, "favourites"), {
      userId,
      carId: car.id,
      carModel: car.model,
      carImage: car.imageUrl,
      rent: car.rent,
      createdAt: Date.now()
    });

    return { success: true };
  } catch (err) {
    console.error("Add favourite error:", err);
    return { success: false };
  }
}

// REMOVE FAVOURITE
export async function removeFavourite(docId) {
  try {
    await deleteDoc(doc(db, "favourites", docId));
    return { success: true };
  } catch (err) {
    console.error("Remove favourite error:", err);
    return { success: false };
  }
}

// FETCH USER FAVOURITES
export async function fetchFavourites(userId) {
  try {
    const q = query(collection(db, "favourites"), where("userId", "==", userId));
    const snap = await getDocs(q);

    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error("Fetch favourites error:", err);
    return [];
  }
}
