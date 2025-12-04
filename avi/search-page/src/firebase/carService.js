import { db } from "./firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

export async function fetchCars() {
  const ref = collection(db, "vehicles");
  const q = query(ref, where("status", "==", "Approved"));
  const snap = await getDocs(q);

  return snap.docs.map((doc) => {
    const d = doc.data();
    return {
      id: doc.id,
      model: d.model,
      imageUrl: d.imageUrl,
      seats: Number(d.seats),
      bags: 2,
      transmission: d.transmission,
      rent: Number(d.rent),
      location: "Auckland"
    };
  });
}
