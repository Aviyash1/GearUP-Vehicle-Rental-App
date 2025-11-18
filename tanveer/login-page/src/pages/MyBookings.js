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
  getDoc,
  deleteDoc
} from "firebase/firestore";
import "../styles/MyBookings.css";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Fetch user name + listen to bookings
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    // Fetch user profile
    const fetchUserName = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserName(userDoc.data().name || "User");
        } else {
          setUserName("User");
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setUserName("User");
      }
    };

    fetchUserName();

    // Real-time bookings listener
    const q = query(
      collection(db, "bookings"),
      where("userId", "==", user.uid)
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => ({
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

  // Cancel booking
  const cancelBooking = async (booking) => {
    if (booking.status !== "Confirmed") return;

    const ok = window.confirm("Are you sure you want to cancel this booking?");
    if (!ok) return;

    try {
      await updateDoc(doc(db, "bookings", booking.id), {
        status: "Cancelled",
      });
    } catch (err) {
      console.error("Cancel failed:", err);
      alert("Could not cancel booking.");
    }
  };

  // Delete booking
  const deleteBooking = async (booking) => {
    const ok = window.confirm(
      "Are you sure you want to permanently DELETE this booking?"
    );
    if (!ok) return;

    try {
      await deleteDoc(doc(db, "bookings", booking.id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Could not delete booking.");
    }
  };

  const openDetails = (b) => setSelectedBooking(b);
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
        <p className="user-greeting">Welcome, {userName}</p>

        {bookings.length === 0 ? (
          <p className="no-bookings">No bookings found.</p>
        ) : (
          <div className="bookings-list">
            {bookings.map((b) => {
              const status = b.status || "Confirmed";
              const statusClass = `status-tag status-${status.toLowerCase()}`;

              return (
                <div className="booking-card" key={b.id}>
                  
                  {/* Image (Option B layout: left-side thumbnail) */}
                  {b.vehicleImg && (
                    <img
                      src={b.vehicleImg}
                      alt={b.vehicleName}
                      className="booking-thumb"
                    />
                  )}

                  <div className="booking-info">
                    <h2>{b.vehicleName}</h2>

                    <p><strong>From:</strong> {b.startDate}</p>
                    <p><strong>To:</strong> {b.endDate}</p>
                    <p><strong>Pickup:</strong> {b.pickupTime}</p>
                    <p><strong>Drop-off:</strong> {b.dropoffTime}</p>
                    <p><strong>Total:</strong> NZ${b.totalCost ?? "0"}</p>

                    <p>
                      <strong>Status:</strong>{" "}
                      <span className={statusClass}>{status}</span>
                    </p>
                  </div>

                  <div className="booking-actions">
                    <button className="details-btn" onClick={() => openDetails(b)}>
                      View Details
                    </button>

                    {/* Cancel only if still confirmed */}
                    {status === "Confirmed" && (
                      <button
                        className="cancel-btn"
                        onClick={() => cancelBooking(b)}
                      >
                        Cancel Booking
                      </button>
                    )}

                    {/* Delete only if NO longer active */}
                    {(status === "Completed" || status === "Cancelled") && (
                      <button
                        className="delete-btn"
                        onClick={() => deleteBooking(b)}
                      >
                        Delete
                      </button>
                    )}
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

      {/* ------------------------------------ */}
      {/* Booking Details Modal */}
      {/* ------------------------------------ */}
      {selectedBooking && (
        <div className="modal-overlay" onClick={closeDetails}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedBooking.vehicleName}</h2>

            {selectedBooking.vehicleImg && (
              <img
                src={selectedBooking.vehicleImg}
                alt={selectedBooking.vehicleName}
                className="booking-image"
                style={{ marginBottom: "16px" }}
              />
            )}

            <p><strong>From:</strong> {selectedBooking.startDate}</p>
            <p><strong>To:</strong> {selectedBooking.endDate}</p>
            <p><strong>Pickup:</strong> {selectedBooking.pickupTime}</p>
            <p><strong>Drop-off:</strong> {selectedBooking.dropoffTime}</p>
            <p><strong>Total:</strong> NZ${selectedBooking.totalCost}</p>
            <p><strong>Status:</strong> {selectedBooking.status}</p>

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
