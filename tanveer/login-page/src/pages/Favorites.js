import React, { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import "../styles/Favorites.css";

export default function Favorites() {
  const [favs, setFavs] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const favRef = collection(db, "users", user.uid, "favorites");

    const unsub = onSnapshot(favRef, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setFavs(data);
    });

    return () => unsub();
  }, []);

  const removeFavorite = async (id) => {
    const user = auth.currentUser;
    await deleteDoc(doc(db, "users", user.uid, "favorites", id));
  };

  return (
    <div className="favorites-page">
      <h1 className="favorites-title">My Favorite Vehicles</h1>

      {favs.length === 0 ? (
        <p className="no-fav">You have no favorites yet ❤️</p>
      ) : (
        <div className="favorites-grid">
          {favs.map((v) => (
            <div className="favorite-card" key={v.id}>
              <img src={v.img} alt={v.name} className="favorite-img" />

              <h2>{v.name}</h2>
              <p>{v.type}</p>
              <p>NZ${v.price}/day</p>

              <div className="fav-actions">
                <button
                  className="remove-btn"
                  onClick={() => removeFavorite(v.id)}
                >
                  Remove
                </button>

                <button
                  className="book-btn"
                  onClick={() => (window.location.href = `/book/${v.name}`)}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
