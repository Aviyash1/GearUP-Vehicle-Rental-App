import React, { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import "../styles/MyBookings.css"; // reuse the same UI styles

export default function FavoriteBookings() {
  const [favorites, setFavorites] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const favRef = collection(db, "favoriteBookings");
    const q = query(favRef, where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setFavorites(list);
    });

    return () => unsubscribe();
  }, [user]);

  const removeFavorite = async (fav) => {
    await deleteDoc(doc(db, "favoriteBookings", fav.id));
  };

  return (
    <div className="bookings-page">
      <div className="bookings-container">
        <h1 className="bookings-title">Favorite Bookings ⭐</h1>

        {favorites.length === 0 ? (
          <p className="no-bookings">No favorite bookings yet.</p>
        ) : (
          <div className="bookings-list">
            {favorites.map((f) => (
              <div className="booking-card" key={f.id}>

                {f.vehicleImg && (
                  <img src={f.vehicleImg} alt={f.vehicleName} className="booking-thumb" />
                )}

                <div className="booking-main">
                  <h2>{f.vehicleName}</h2>

                  <p><strong>From:</strong> {f.startDate}</p>
                  <p><strong>To:</strong> {f.endDate}</p>
                  <p><strong>Total:</strong> NZ${f.totalCost}</p>
                </div>

                <div className="booking-actions">
                  <button className="delete-btn" onClick={() => removeFavorite(f)}>
                    Remove
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

        <button className="back-btn" onClick={() => (window.location.href = "/dashboard")}>
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
