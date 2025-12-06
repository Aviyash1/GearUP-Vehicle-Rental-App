// src/utils/uploadVehicles.js
// This script uploads ALL vehicles into Firestore automatically.

import { db } from "../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

//   VEHICLE DATA (20 CARS)

const vehicles = [
  {
    name: "Porsche 911 Turbo S",
    seats: 4,
    bags: 2,
    transmission: "Automatic",
    price: 420,
    location: "Auckland",
    availableFrom: "2025-11-01T08:00",
    availableTo: "2025-11-20T23:00",
    imageUrl: "UPLOAD-YOUR-IMAGE-URL"
  },

  {
    name: "Mercedes AMG GT Black Series",
    seats: 2,
    bags: 1,
    transmission: "Automatic",
    price: 480,
    location: "Auckland",
    availableFrom: "2025-11-05T09:00",
    availableTo: "2025-12-01T22:00",
    imageUrl: "UPLOAD-YOUR-IMAGE-URL"
  },

  {
    name: "BMW M4 Competition 2025",
    seats: 4,
    bags: 2,
    transmission: "Automatic",
    price: 310,
    location: "Wellington",
    availableFrom: "2025-11-02T07:00",
    availableTo: "2025-11-25T23:00",
    imageUrl: "UPLOAD-YOUR-IMAGE-URL"
  },

  {
    name: "Audi RS7 Sportback",
    seats: 5,
    bags: 3,
    transmission: "Automatic",
    price: 350,
    location: "Christchurch",
    availableFrom: "2025-11-10T08:00",
    availableTo: "2025-12-10T23:00",
    imageUrl: "UPLOAD-YOUR-IMAGE-URL"
  },

  {
    name: "Lexus LC500",
    seats: 4,
    bags: 2,
    transmission: "Automatic",
    price: 330,
    location: "Auckland",
    availableFrom: "2025-11-01T06:00",
    availableTo: "2025-11-30T23:00",
    imageUrl: "UPLOAD-YOUR-IMAGE-URL"
  },

  {
    name: "Nissan GT-R R35 Premium",
    seats: 4,
    bags: 2,
    transmission: "Automatic",
    price: 380,
    location: "Hamilton",
    availableFrom: "2025-11-15T08:00",
    availableTo: "2025-12-05T22:00",
    imageUrl: "UPLOAD-YOUR-IMAGE-URL"
  },

  {
    name: "Toyota Supra GR",
    seats: 2,
    bags: 1,
    transmission: "Automatic",
    price: 220,
    location: "Auckland",
    availableFrom: "2025-11-01T07:00",
    availableTo: "2025-12-01T23:00",
    imageUrl: "UPLOAD-YOUR-IMAGE-URL"
  },

  {
    name: "Honda Civic Type R 2025",
    seats: 5,
    bags: 3,
    transmission: "Manual",
    price: 190,
    location: "Wellington",
    availableFrom: "2025-11-03T08:00",
    availableTo: "2025-12-03T23:00",
    imageUrl: "UPLOAD-YOUR-IMAGE-URL"
  },

  {
    name: "BMW i8 Roadster",
    seats: 2,
    bags: 1,
    transmission: "Automatic",
    price: 260,
    location: "Queenstown",
    availableFrom: "2025-11-05T09:00",
    availableTo: "2025-12-01T21:00",
    imageUrl: "UPLOAD-YOUR-IMAGE-URL"
  },

  {
    name: "Porsche Taycan Turbo S",
    seats: 4,
    bags: 2,
    transmission: "Automatic",
    price: 430,
    location: "Auckland",
    availableFrom: "2025-11-01T08:00",
    availableTo: "2025-11-28T23:00",
    imageUrl: "UPLOAD-YOUR-IMAGE-URL"
  },

  {
    name: "Tesla Model S Plaid",
    seats: 5,
    bags: 3,
    transmission: "Automatic",
    price: 250,
    location: "Wellington",
    availableFrom: "2025-11-10T10:00",
    availableTo: "2025-12-20T23:00",
    imageUrl: "UPLOAD-YOUR-IMAGE-URL"
  },

  {
    name: "Range Rover Sport 2025",
    seats: 5,
    bags: 4,
    transmission: "Automatic",
    price: 300,
    location: "Queenstown",
    availableFrom: "2025-11-01T07:00",
    availableTo: "2025-12-15T22:00",
    imageUrl: "UPLOAD-YOUR-IMAGE-URL"
  },

  {
    name: "Toyota Corolla 2025",
    seats: 5,
    bags: 3,
    transmission: "Automatic",
    price: 120,
    location: "Auckland",
    availableFrom: "2025-11-04T09:00",
    availableAvailableTo: "2025-12-04T22:00",
    imageUrl: "UPLOAD-YOUR-IMAGE-URL"
  },

  {
    name: "Mazda CX-5 2024",
    seats: 5,
    bags: 3,
    transmission: "Automatic",
    price: 150,
    location: "Wellington",
    availableFrom: "2025-11-01T07:00",
    availableTo: "2025-11-30T23:00",
    imageUrl: "UPLOAD-YOUR-IMAGE-URL"
  },

  {
    name: "Hyundai Tucson 2025",
    seats: 5,
    bags: 4,
    transmission: "Automatic",
    price: 140,
    location: "Christchurch",
    availableFrom: "2025-11-06T07:00",
    availableTo: "2025-12-06T23:00",
    imageUrl: "UPLOAD-YOUR-IMAGE-URL"
  },

  {
    name: "Ford Mustang GT 5.0",
    seats: 4,
    bags: 2,
    transmission: "Automatic",
    price: 260,
    location: "Auckland",
    availableFrom: "2025-11-02T09:00",
    availableTo: "2025-12-02T23:00",
    imageUrl: "UPLOAD-YOUR-IMAGE-URL"
  },

  {
    name: "Dodge Challenger SRT Hellcat",
    seats: 4,
    bags: 2,
    transmission: "Automatic",
    price: 300,
    location: "Hamilton",
    availableFrom: "2025-11-08T09:00",
    availableTo: "2025-12-08T22:00",
    imageUrl: "UPLOAD-YOUR-IMAGE-URL"
  },

  {
    name: "Kia Sportage 2024",
    seats: 5,
    bags: 4,
    transmission: "Automatic",
    price: 130,
    location: "Tauranga",
    availableFrom: "2025-11-01T08:00",
    availableTo: "2025-11-30T23:00",
    imageUrl: "UPLOAD-YOUR-IMAGE-URL"
  },

  {
    name: "Subaru WRX STI 2025",
    seats: 5,
    bags: 3,
    transmission: "Manual",
    price: 200,
    location: "Wellington",
    availableFrom: "2025-11-03T10:00",
    availableTo: "2025-12-01T23:00",
    imageUrl: "UPLOAD-YOUR-IMAGE-URL"
  },

  {
    name: "Volkswagen Golf R 2025",
    seats: 5,
    bags: 3,
    transmission: "Automatic",
    price: 180,
    location: "Auckland",
    availableFrom: "2025-11-05T09:00",
    availableTo: "2025-12-05T23:00",
    imageUrl: "UPLOAD-YOUR-IMAGE-URL"
  },
];


// ============================
//     UPLOAD FUNCTION
// ============================

export async function uploadVehicles() {
  try {
    const vehiclesRef = collection(db, "vehicles");

    for (const car of vehicles) {
      await addDoc(vehiclesRef, car);
      console.log("Uploaded:", car.name);
    }

    console.log("========== ALL VEHICLES UPLOADED ==========");
  } catch (error) {
    console.error("UPLOAD FAILED:", error);
  }
}
