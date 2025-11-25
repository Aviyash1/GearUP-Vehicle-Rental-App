// src/pages/MyBookings.js
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import "../styles/MyBookings.css";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Real-time bookings + user name
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchUserName = async () => {
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          setUserName(snap.data().name || "User");
        } else {
          setUserName("User");
        }
      } catch (err) {
        console.error("Error loading user:", err);
        setUserName("User");
      }
    };

    fetchUserName();

    const bookingsRef = collection(db, "bookings");
    const q = query(bookingsRef, where("userId", "==", user.uid));

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setBookings(data);
        setLoading(false);
      },
      (err) => {
        console.error("Error listening to bookings:", err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  // Cancel booking + notification
  const handleCancelBooking = async (booking) => {
    if (booking.status === "Cancelled" || booking.status === "Completed") {
      return;
    }

    const ok = window.confirm(
      "Are you sure you want to cancel this booking?"
    );
    if (!ok) return;

    try {
      const bookingRef = doc(db, "bookings", booking.id);

      await updateDoc(bookingRef, { status: "Cancelled" });

      await addDoc(collection(db, "notifications"), {
        userId: booking.userId,
        bookingId: booking.id,
        type: "BOOKING_CANCELLED",
        title: "Booking Cancelled",
        message: `Your booking for ${booking.vehicleName} on ${booking.startDate} has been cancelled.`,
        read: false,
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Error cancelling booking:", err);
      alert("Could not cancel booking. Please try again.");
    }
  };

  // Permanently delete booking document
  const handleDeleteBooking = async (booking) => {
    const ok = window.confirm(
      "This will permanently delete this booking record. Continue?"
    );
    if (!ok) return;

    try {
      await deleteDoc(doc(db, "bookings", booking.id));
    } catch (err) {
      console.error("Error deleting booking:", err);
      alert("Could not delete booking.");
    }
  };

  const openDetails = (booking) => setSelectedBooking(booking);
  const closeDetails = () => setSelectedBooking(null);

  if (loading) {
    return (
      <div className="bookings-page">
        <div className="bookings-container">
          <h1 className="bookings-title">My Bookings</h1>
          <p className="loading">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bookings-page">
      <div className="bookings-container">
        <h1 className="bookings-title">My Bookings</h1>
        <p className="user-greeting">Welcome, {userName || "User"}</p>

        {bookings.length === 0 ? (
          <p className="no-bookings">No bookings found.</p>
        ) : (
          <div className="bookings-list">
            {bookings.map((b) => {
              const status = b.status || "Confirmed";
              const statusClass = `status-tag status-${status.toLowerCase()}`;

              return (
                <div className="booking-card" key={b.id}>
                  {b.vehicleImg && (
                    <img
                      src={b.vehicleImg}
                      alt={b.vehicleName}
                      className="booking-thumb"
                    />
                  )}

                  <div className="booking-main">
                    <h2>{b.vehicleName}</h2>

                    <p>
                      <strong>From:</strong> {b.startDate}
                    </p>
                    <p>
                      <strong>To:</strong> {b.endDate}
                    </p>
                    <p>
                      <strong>Pickup:</strong> {b.pickupTime}
                    </p>
                    <p>
                      <strong>Drop-off:</strong> {b.dropoffTime}
                    </p>

                    <p>
                      <strong>Total:</strong> NZ${b.totalCost ?? "0"}
                    </p>

                    <p>
                      <strong>Status:</strong>{" "}
                      <span className={statusClass}>{status}</span>
                    </p>
                  </div>

                  <div className="booking-actions">
                    <button
                      className="details-btn"
                      onClick={() => openDetails(b)}
                    >
                      View Details
                    </button>

                    {status !== "Cancelled" && status !== "Completed" && (
                      <button
                        className="cancel-btn"
                        onClick={() => handleCancelBooking(b)}
                      >
                        Cancel Booking
                      </button>
                    )}

                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteBooking(b)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <button
          className="back-btn"
          onClick={() => (window.location.href = "/dashboard")}
        >
          ← Back to Dashboard
        </button>
      </div>

      {selectedBooking && (
        <div className="modal-overlay" onClick={closeDetails}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedBooking.vehicleName}</h2>

            {selectedBooking.vehicleImg && (
              <img
                src={selectedBooking.vehicleImg}
                alt={selectedBooking.vehicleName}
                className="booking-image"
              />
            )}

            <p>
              <strong>From:</strong> {selectedBooking.startDate}
            </p>
            <p>
              <strong>To:</strong> {selectedBooking.endDate}
            </p>
            <p>
              <strong>Pickup Time:</strong> {selectedBooking.pickupTime}
            </p>
            <p>
              <strong>Drop-off Time:</strong> {selectedBooking.dropoffTime}
            </p>
            <p>
              <strong>Total:</strong> NZ$
              {selectedBooking.totalCost ?? "0"}
            </p>
            <p>
              <strong>Status:</strong> {selectedBooking.status}
            </p>

            <button className="close-modal-btn" onClick={closeDetails}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
