import React, { useEffect, useState } from "react";
import "../styles/MyBookings.css";
import { auth, db } from "../firebase/firebaseConfig";
import { fetchBookingsByUser, cancelBooking } from "../firebase/bookingService";
import { addFavourite, removeFavourite, fetchFavourites } from "../firebase/favouriteService";
import { doc, getDoc } from "firebase/firestore";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const user = auth.currentUser;

  useEffect(() => {
    async function load() {
      if (!user) return;

      const b = await fetchBookingsByUser(user.uid);
      const fav = await fetchFavourites(user.uid);

      setBookings(b);
      setFavourites(fav.map(f => f.id));
    }
    load();
  }, [user]);


  /* --------------------------
     TOGGLE FAVOURITE
  --------------------------- */
  const toggleFavourite = async (booking) => {
    if (!user) return;

    const car = {
      id: booking.carId,
      model: booking.carModel,
      imageUrl: booking.carImage,
      rent: booking.dailyRent,
      ownerId: booking.ownerId
    };

    const isFaved = favourites.includes(booking.carId);

    if (isFaved) {
      await removeFavourite(user.uid, booking.carId);
      setFavourites(prev => prev.filter(id => id !== booking.carId));
    } else {
      await addFavourite(user.uid, car);
      setFavourites(prev => [...prev, booking.carId]);
    }
  };


  /* --------------------------
     CANCEL BOOKING
  --------------------------- */
  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    await cancelBooking(bookingId);

    setBookings(prev =>
      prev.map(b =>
        b.id === bookingId ? { ...b, status: "Cancelled" } : b
      )
    );
  };


  return (
    <div className="bookings-page">
      <h1>My Bookings</h1>

      {bookings.length === 0 ? (
        <p className="no-bookings">You have no bookings yet.</p>
      ) : (
        <div className="bookings-list">
          {bookings.map((b) => {
            const isFav = favourites.includes(b.carId);

            return (
              <div key={b.id} className="booking-card">

                {/* IMAGE */}
                <img src={b.carImage} alt="" className="booking-img" />

                {/* INFO */}
                <div className="booking-info">
                  <h3>{b.carModel}</h3>

                  <p><b>From:</b> {b.pickupDate} {b.pickupTime}</p>
                  <p><b>To:</b> {b.returnDate} {b.returnTime}</p>
                  <p><b>Days:</b> {b.rentalDays}</p>
                  <p><b>Total:</b> ${b.totalPrice}</p>

                  {/* STATUS BADGE */}
                  <span className={`status ${b.status === "Cancelled" ? "cancelled" : "active"}`}>
                    {b.status}
                  </span>
                </div>

                {/* ACTION BUTTONS */}
                <div className="booking-actions">
                  <button className="details-btn" onClick={() => setSelectedBooking(b)}>View</button>
                  <button
                    className="cancel-btn"
                    onClick={() => handleCancel(b.id)}
                    disabled={b.status === "Cancelled"}
                  >
                    Cancel
                  </button>
                </div>

                {/* ❤️ Favourite Toggle */}
                <button
                  className={`fav-btn ${isFav ? "active" : ""}`}
                  onClick={() => toggleFavourite(b)}
                >
                  {isFav ? "❤️" : "🤍"}
                </button>

              </div>
            );
          })}
        </div>
      )}

      {/* VIEW BOOKING MODAL */}
      {selectedBooking && (
        <div className="modal-overlay">
          <div className="modal-box">
            <button className="close-modal" onClick={() => setSelectedBooking(null)}>✕</button>

            <img src={selectedBooking.carImage} className="modal-image" />

            <h2>{selectedBooking.carModel}</h2>

            <p><b>From:</b> {selectedBooking.pickupDate} {selectedBooking.pickupTime}</p>
            <p><b>To:</b> {selectedBooking.returnDate} {selectedBooking.returnTime}</p>
            <p><b>Days:</b> {selectedBooking.rentalDays}</p>
            <p><b>Total Paid:</b> ${selectedBooking.totalPrice}</p>

            <span className={`status ${selectedBooking.status === "Cancelled" ? "cancelled" : "active"}`}>
              {selectedBooking.status}
            </span>
          </div>
        </div>
      )}

      {/* BACK TO DASHBOARD BUTTON */}
      <button className="back-btn" onClick={() => (window.location.href = "/dashboard")}>
        ← Back to Dashboard
      </button>
    </div>
  );
}
