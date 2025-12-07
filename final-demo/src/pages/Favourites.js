import React, { useEffect, useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import { fetchFavourites, removeFavourite } from "../firebase/favouriteService";
import { useNavigate } from "react-router-dom";
import "../styles/Favourites.css";

export default function Favourites() {
  const [favs, setFavs] = useState([]);
  const user = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    async function load() {
      const result = await fetchFavourites(user.uid);

      // 🔥 Normalize data: ensure correct image field
      const cleaned = result.map((car) => ({
        id: car.id,
        model: car.model,
        rent: car.rent,
        imageUrl: car.imageUrl || car.carImage || car.image || "",
        ownerId: car.ownerId,
      }));

      setFavs(cleaned);
    }

    load();
  }, [user]);

  const handleRemove = async (carId) => {
    if (!user) return;

    await removeFavourite(user.uid, carId);
    setFavs((prev) => prev.filter((item) => item.id !== carId));
  };

  return (
    <div className="fav-page">
      <h1>
        Favourite Vehicles <span>💖</span>
      </h1>

      {favs.length === 0 ? (
        <p>No favourites yet.</p>
      ) : (
        <div className="fav-grid">
          {favs.map((car) => (
            <div className="fav-card" key={car.id}>
              {/* IMAGE */}
              <img
                src={car.imageUrl}
                className="fav-img"
                alt={car.model}
              />

              {/* MODEL */}
              <h3 className="fav-title">{car.model}</h3>

              {/* RENT PRICE */}
              <p className="fav-rent">${car.rent}/day</p>

              {/* ACTION BUTTONS */}
              <div className="fav-actions">
                <button
                  className="remove-btn"
                  onClick={() => handleRemove(car.id)}
                >
                  Remove 💗
                </button>

                <button
                  className="view-btn"
                  onClick={() =>
                    navigate(`/searchpage`, {
                      state: { car },
                    })
                  }
                >
                  View Car
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/*  BACK TO DASHBOARD */}
      <button
        className="back-dashboard-btn"
        onClick={() => navigate("/dashboard")}
      >
        ← Back to Dashboard
      </button>
    </div>
  );
}
