// src/firebase/carService.js
import { db, storage } from "./firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Upload car image to Firebase Storage
export async function uploadCarImage(file) {
  const fileRef = ref(storage, `car-images/${Date.now()}-${file.name}`);
  await uploadBytes(fileRef, file);
  return await getDownloadURL(fileRef);
}

// Save car details to Firestore
export async function addCarToDatabase(carData) {
  const carsRef = collection(db, "cars");
  await addDoc(carsRef, carData);
}

// Fetch all cars
export async function fetchCars() {
  const snapshot = await getDocs(collection(db, "cars"));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}
