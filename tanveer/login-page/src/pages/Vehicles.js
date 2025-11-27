import React, { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import "../styles/Vehicles.css";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Fetch vehicles collection
  useEffect(() => {
    const fetchVehicles = async () => {
      const snap = await getDocs(collection(db, "vehicles"));
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setVehicles(data);
    };
    fetchVehicles();
  }, []);

  // Real-time favorite listener
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const favRef = collection(db, "users", user.uid, "favorites");

    const unsub = onSnapshot(favRef, (snap) => {
      setFavorites(snap.docs.map((d) => d.id));
    });

    return () => unsub();
  }, []);

  // Toggle favorite
  const toggleFavorite = async (vehicle) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please login first");
      return;
    }

    const favRef = doc(db, "users", user.uid, "favorites", vehicle.id);

    if (favorites.includes(vehicle.id)) {
      await deleteDoc(favRef);
    } else {
      await setDoc(favRef, {
        name: vehicle.name,
        type: vehicle.type,
        img: vehicle.img,
        price: vehicle.price,
      });
    }
  };

  return (
    <div className="vehicles-page">
      <h1 className="vehicles-title">Browse Vehicles</h1>

      <div className="vehicles-grid">
        {vehicles.map((v) => (
          <div className="vehicle-card" key={v.id}>
            <div className="vehicle-img-wrapper">
              <img src={v.img} alt={v.name} className="vehicle-img" />

              {/* Heart Button ❤️ */}
              <button
                className={`fav-btn ${favorites.includes(v.id) ? "active" : ""}`}
                onClick={() => toggleFavorite(v)}
              >
                {favorites.includes(v.id) ? "❤️" : "🤍"}
              </button>
            </div>

            <h2>{v.name}</h2>
            <p className="v-type">{v.type}</p>
            <p className="v-price">NZ${v.price}/day</p>

            <button
              className="book-btn"
              onClick={() =>
                window.location.href = `/book/${v.name}`
              }
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
