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
  getDocs
} from "firebase/firestore";
import "../styles/MyBookings.css";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState([]);

  // Load favorites
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const favRef = collection(db, "favoriteBookings");
    const q = query(favRef, where("userId", "==", user.uid));

    const unsub = onSnapshot(q, (sn) => {
      const ids = sn.docs.map((d) => d.data().bookingId);
      setFavoriteIds(ids);
    });

    return () => unsub();
  }, []);

  // Load bookings + user info
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    // Load user name 
    const loadUser = async () => {
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          setUserName(snap.data().name || "User");
        } else {
          setUserName("User");
        }
      } catch (err) {
        console.error(err);
        setUserName("User");
      }
    };
    loadUser();

    // Real-time bookings
    const ref = collection(db, "bookings");
    const q = query(ref, where("userId", "==", user.uid));

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setBookings(data);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // Cancel Booking
  const handleCancelBooking = async (booking) => {
    if (booking.status === "Cancelled" || booking.status === "Completed") return;

    if (!window.confirm("Cancel this booking?")) return;

    try {
      await updateDoc(doc(db, "bookings", booking.id), {
        status: "Cancelled",
      });

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
      console.error(err);
      alert("Error cancelling booking.");
    }
  };

  // Delete Booking
  const handleDeleteBooking = async (booking) => {
    if (!window.confirm("Delete this booking permanently?")) return;

    try {
      await deleteDoc(doc(db, "bookings", booking.id));
    } catch (err) {
      console.error(err);
      alert("Error deleting booking.");
    }
  };

  // ⭐ Add Favorite
  const handleAddFavorite = async (booking) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await addDoc(collection(db, "favoriteBookings"), {
        userId: user.uid,
        bookingId: booking.id,
        vehicleName: booking.vehicleName,
        vehicleImg: booking.vehicleImg,
        startDate: booking.startDate,
        endDate: booking.endDate,
        totalCost: booking.totalCost,
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Error adding favorite:", err);
    }
  };

  // ⭐ Remove Favorite
  const handleRemoveFavorite = async (bookingId) => {
    const favRef = collection(db, "favoriteBookings");
    const q = query(
      favRef,
      where("userId", "==", auth.currentUser.uid),
      where("bookingId", "==", bookingId)
    );

    const snap = await getDocs(q);
    snap.forEach(async (d) => {
      await deleteDoc(doc(db, "favoriteBookings", d.id));
    });
  };

  const openDetails = (booking) => setSelectedBooking(booking);
  const closeDetails = () => setSelectedBooking(null);

  if (loading) {
    return (
      <div className="bookings-page">
        <div className="bookings-container">
          <h1 className="bookings-title">My Bookings</h1>
          <p className="loading">Loading...</p>
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
              const statusClass = `status-tag status-${b.status?.toLowerCase()}`;

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

                    <p><strong>From:</strong> {b.startDate}</p>
                    <p><strong>To:</strong> {b.endDate}</p>
                    <p><strong>Pickup:</strong> {b.pickupTime}</p>
                    <p><strong>Drop-off:</strong> {b.dropoffTime}</p>

                    <p><strong>Total:</strong> NZ${b.totalCost ?? "0"}</p>

                    <p>
                      <strong>Status:</strong>{" "}
                      <span className={statusClass}>{b.status}</span>
                    </p>
                  </div>

                  <div className="booking-actions">
                    {/* ⭐ Favorite Button */}
                    {favoriteIds.includes(b.id) ? (
                      <button
                        className="fav-btn fav-on"
                        onClick={() => handleRemoveFavorite(b.id)}
                      >
                        ★ Favorited
                      </button>
                    ) : (
                      <button
                        className="fav-btn"
                        onClick={() => handleAddFavorite(b)}
                      >
                        ☆ Favorite
                      </button>
                    )}

                    <button className="details-btn" onClick={() => openDetails(b)}>
                      View Details
                    </button>

                    {b.status !== "Cancelled" && b.status !== "Completed" && (
                      <button className="cancel-btn" onClick={() => handleCancelBooking(b)}>
                        Cancel Booking
                      </button>
                    )}

                    <button className="delete-btn" onClick={() => handleDeleteBooking(b)}>
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
