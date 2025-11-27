// src/pages/FavoriteVehicles.js
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../styles/Favorites.css";

const FavoriteVehicles = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load favorites for current user
  useEffect(() => {
    const fetchFavorites = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const favRef = collection(db, "favorites");
        const q = query(favRef, where("userId", "==", user.uid));
        const snap = await getDocs(q);

        const data = snap.docs.map((d) => ({
          id: d.id,      // document id in favorites
          ...d.data(),   // { vehicleId, name, price, img, type, createdAt }
        }));

        setFavorites(data);
      } catch (err) {
        console.error("Error loading favorites:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemove = async (fav) => {
    if (!window.confirm("Remove this vehicle from your favorites?")) return;

    try {
      await deleteDoc(doc(db, "favorites", fav.id));
      setFavorites((prev) => prev.filter((f) => f.id !== fav.id));
    } catch (err) {
      console.error("Error removing favorite:", err);
      alert("Could not remove favorite. Please try again.");
    }
  };

  const handleView = (fav) => {
    // Optional: send the vehicle to BookVehicle page (or Vehicles detail)
    navigate("/book/" + encodeURIComponent(fav.name || "vehicle"), {
      state: {
        vehicle: {
          name: fav.name,
          price: fav.price,
          img: fav.img,
          type: fav.type || "Car",
        },
      },
    });
  };

  if (loading) {
    return (
      <div className="favorites-page">
        <div className="favorites-container">
          <h1 className="favorites-title">My Favorite Vehicles</h1>
          <p className="favorites-loading">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="favorites-container">
        <h1 className="favorites-title">My Favorite Vehicles</h1>

        {favorites.length === 0 ? (
          <p className="no-favorites">
            You haven’t added any favorites yet. Browse vehicles and tap the heart
            icon to save them here.
          </p>
        ) : (
          <div className="favorites-list">
            {favorites.map((fav) => (
              <div className="favorite-card" key={fav.id}>
                {/* Vehicle image on the left */}
                {fav.img && (
                  <img
                    src={fav.img}
                    alt={fav.name}
                    className="favorite-image"
                  />
                )}

                {/* Info in the middle */}
                <div className="favorite-info">
                  <h2>{fav.name}</h2>
                  <p>
                    <strong>Type:</strong> {fav.type || "Vehicle"}
                  </p>
                  <p>
                    <strong>Price:</strong> NZ${fav.price}/day
                  </p>
                </div>

                {/* Actions on the right */}
                <div className="favorite-actions">
                  <button
                    className="view-btn"
                    onClick={() => handleView(fav)}
                  >
                    View / Book
                  </button>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemove(fav)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          className="back-btn"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default FavoriteVehicles;
