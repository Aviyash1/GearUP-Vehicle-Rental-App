// src/pages/MyBookings.js
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import "../styles/MyBookings.css";
import { useNavigate } from "react-router-dom";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadBookings() {
      if (!auth.currentUser) return;

      const q = query(
        collection(db, "bookings"),
        where("userId", "==", auth.currentUser.uid)
      );

      const snap = await getDocs(q);
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

      setBookings(data);
    }

    loadBookings();
  }, []);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "bookings", id));
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="bookings-page">
      <h1>My Bookings</h1>
      <p className="welcome">Welcome, {auth.currentUser?.email}</p>

      {bookings.length === 0 ? (
        <p className="no-bookings">You have no bookings yet.</p>
      ) : (
        <div className="bookings-list">
          {bookings.map((b) => (
            <div className="booking-card" key={b.id}>
              {/* IMAGE */}
              <img src={b.carImage} alt={b.carModel} className="booking-img" />

              {/* DETAILS */}
              <div className="booking-details">
                <h2>{b.carModel}</h2>

                <p><strong>From:</strong> {b.pickupDate} — {b.pickupTime}</p>
                <p><strong>To:</strong> {b.returnDate} — {b.returnTime}</p>

                <p><strong>Total:</strong> ${b.totalPrice}</p>

                <span className={`status ${b.status.toLowerCase()}`}>
                  {b.status}
                </span>
              </div>

              {/* BUTTONS */}
              <div className="booking-actions">
                <button
                  className="details-btn"
                  onClick={() => navigate(`/booking-details/${b.id}`)}
                >
                  View Details
                </button>

                <button
                  className="cancel-btn"
                  onClick={() => handleDelete(b.id)}
                >
                  Cancel / Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button className="back-btn" onClick={() => navigate("/dashboard")}>
        ← Back to Dashboard
      </button>
    </div>
  );
}
