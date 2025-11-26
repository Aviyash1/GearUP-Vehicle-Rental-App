// Bookings.js
import React, { useEffect, useState } from "react";
import { auth, db } from "./firebaseConfig";

import { ref, onValue } from "firebase/database";
import "./Bookings.css";

function Bookings() {
  const uid = auth.currentUser?.uid;

  const [bookings, setBookings] = useState([]);
  const [cars, setCars] = useState([]);

  // --------------------------------------------------------
  // LOAD BOOKINGS FOR LOGGED-IN USER
  // --------------------------------------------------------
  useEffect(() => {
    if (!uid) return;

    onValue(ref(db, `users/${uid}/bookings`), (snap) => {
      if (!snap.exists()) return setBookings([]);

      const data = snap.val();
      const list = Object.keys(data).map((id) => ({
        id,
        ...data[id],
      }));
      setBookings(list);
    });
  }, [uid]);

  // --------------------------------------------------------
  // LOAD ALL GLOBAL CARS (to map carId → model)
  // --------------------------------------------------------
  useEffect(() => {
    onValue(ref(db, "cars"), (snap) => {
      if (!snap.exists()) return setCars([]);

      const data = snap.val();
      const list = Object.keys(data).map((id) => ({
        id,
        ...data[id],
      }));
      setCars(list);
    });
  }, []);

  // Find car model by carId
  const getCarModel = (carId) => {
    const car = cars.find((c) => c.id === carId);
    return car?.model || "Unknown Car";
  };

  return (
    <div className="content-box fade-in">
      <h2>My Bookings</h2>

      <div className="booking-grid">
        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          bookings.map((booking) => (
            <div className="booking-card" key={booking.id}>
              <h4>{getCarModel(booking.carId)}</h4>

              <p>
                <strong>Customer:</strong> {booking.customer}
              </p>

              <p>
                <strong>Date:</strong> {booking.startDate} →{" "}
                {booking.endDate}
              </p>

              <span className={`badge ${booking.status.toLowerCase()}`}>
                {booking.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Bookings;
