// src/pages/PaymentPage.js
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/PaymentPage.css";
import { auth, db } from "../firebaseConfig";
import { addDoc, collection } from "firebase/firestore";

export default function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const vehicle = state?.vehicle;
  const total = state?.total;
  const startDate = state?.startDate;
  const endDate = state?.endDate;
  const pickupTime = state?.pickupTime;
  const dropoffTime = state?.dropoffTime;

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);

  if (!vehicle || !total || !startDate || !endDate) {
    return (
      <div className="payment-page">
        <div className="payment-card">
          <h2>Invalid session</h2>
          <p>Please go back and select a vehicle again.</p>
          <button className="back-btn" onClick={() => navigate("/vehicles")}>
            ← Back to Vehicles
          </button>
        </div>
      </div>
    );
  }

  const handlePayment = async () => {
    if (!cardNumber || !expiry || !cvv) {
      alert("Please fill in all payment details.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      alert("Please log in again to complete the booking.");
      navigate("/");
      return;
    }

    try {
      setLoading(true);

      // 🔥 Save booking ONLY AFTER "payment" success
      await addDoc(collection(db, "bookings"), {
        userId: user.uid,
        vehicleName: vehicle.name,
        vehicleImg: vehicle.img || "", // used in MyBookings
        startDate,
        endDate,
        pickupTime,
        dropoffTime,
        totalCost: total,
        status: "Confirmed",
        createdAt: new Date().toISOString(),
      });

      alert("Payment Successful! Booking confirmed.");
      navigate("/feedback", { state: { vehicle } });
    } catch (err) {
      console.error("Error saving booking:", err);
      alert("Payment succeeded but booking could not be saved. Please contact support.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-card">
        <h2 className="payment-title">Payment for {vehicle.name}</h2>
        <p className="payment-total">
          Total: <span>NZ${total}</span>
        </p>

        <div className="payment-summary">
          <p>
            <strong>From:</strong> {startDate} &nbsp; <strong>To:</strong> {endDate}
          </p>
          <p>
            <strong>Pickup:</strong> {pickupTime || "-"} &nbsp;
            <strong>Drop-off:</strong> {dropoffTime || "-"}
          </p>
        </div>

        <div className="payment-fields">
          <label>Card Number</label>
          <input
            type="text"
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
          />

          <label>Expiry Date</label>
          <input
            type="text"
            placeholder="MM/YY"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
          />

          <label>CVV</label>
          <input
            type="password"
            placeholder="123"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
          />
        </div>

        <button className="pay-btn" onClick={handlePayment} disabled={loading}>
          {loading ? "Processing..." : "Pay Now"}
        </button>

        <button className="back-btn" onClick={() => navigate("/vehicles")}>
          ← Cancel / Back
        </button>
      </div>
    </div>
  );
}
