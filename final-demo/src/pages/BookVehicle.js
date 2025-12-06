// src/pages/BookVehicle.js
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, collection, addDoc } from "firebase/firestore";
import "../styles/BookVehicle.css";

export default function BookVehicle() {
  const location = useLocation();
  const navigate = useNavigate();
  const vehicle = location.state?.vehicle;

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [dropoffTime, setDropoffTime] = useState("");
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(false); // 🔥 PREVENT DOUBLE SUBMIT

  if (!vehicle) {
    return (
      <div className="book-vehicle-page">
        <div className="book-card">
          <h2>No vehicle selected</h2>
          <button className="back-btn" onClick={() => navigate("/vehicles")}>
            ← Back to Vehicles
          </button>
        </div>
      </div>
    );
  }

  const calculateTotal = () => {
    if (!startDate || !endDate) {
      alert("Please select both dates!");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      alert("End date must be after start date!");
      return;
    }

    setTotal(diffDays * vehicle.price);
  };

  const handleCheckout = async () => {
    if (loading) return;              // 🔥 BLOCK MULTIPLE CLICKS
    setLoading(true);

    if (!pickupTime || !dropoffTime) {
      alert("Please select pickup and drop-off times!");
      setLoading(false);
      return;
    }

    if (!total) {
      alert("Please calculate total before proceeding.");
      setLoading(false);
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      alert("Please log in first.");
      navigate("/");
      setLoading(false);
      return;
    }

    try {
      const bookingData = {
        userId: user.uid,
        vehicleName: vehicle.name,
        vehicleImg: vehicle.img || "",
        startDate,
        endDate,
        pickupTime,
        dropoffTime,
        totalCost: total,
        status: "Confirmed",
        createdAt: new Date().toISOString(),
      };

      // 🔥 FIRESTORE AUTO-ID (Fixes duplicate bookings)
      const bookingRef = await addDoc(collection(db, "bookings"), bookingData);
      const bookingId = bookingRef.id;

      // Create notification
      await addDoc(collection(db, "notifications"), {
        userId: user.uid,
        bookingId,
        type: "BOOKING_CONFIRMED",
        title: "Booking Confirmed",
        message: `Your booking for ${vehicle.name} from ${startDate} to ${endDate} is confirmed.`,
        read: false,
        createdAt: new Date().toISOString(),
      });

      // Go to payment
      navigate("/payment", {
        state: {
          vehicle,
          total,
          startDate,
          endDate,
          pickupTime,
          dropoffTime,
          bookingId,
        },
      });
    } catch (err) {
      console.error("Error creating booking:", err);
      alert("Something went wrong while creating your booking.");
    } finally {
      setLoading(false); // 🔥 ENABLE BUTTON AGAIN AFTER FINISH
    }
  };

  return (
    <div className="book-vehicle-page">
      <div className="book-card">
        <img src={vehicle.img} alt={vehicle.name} className="book-img" />
        <h2 className="book-title">{vehicle.name}</h2>
        <p className="book-type">{vehicle.type}</p>
        <p className="book-price">NZ${vehicle.price}/day</p>

        <div className="date-row">
          <div className="date-field">
            <label>Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="date-field">
            <label>End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div className="date-row">
          <div className="date-field">
            <label>Pickup Time</label>
            <input
              type="time"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
            />
          </div>
          <div className="date-field">
            <label>Drop-off Time</label>
            <input
              type="time"
              value={dropoffTime}
              onChange={(e) => setDropoffTime(e.target.value)}
            />
          </div>
        </div>

        <button className="calc-btn" onClick={calculateTotal}>
          Calculate Total
        </button>

        {total && (
          <div className="total-section">
            <h3>
              Total: <span>NZ${total}</span>
            </h3>

            <button
              className="checkout-btn"
              disabled={loading}
              onClick={handleCheckout}
            >
              {loading ? "Processing..." : "Proceed to Checkout"}
            </button>
          </div>
        )}

        <button className="back-btn" onClick={() => navigate("/vehicles")}>
          ← Back to Vehicles
        </button>
      </div>
    </div>
  );
}
