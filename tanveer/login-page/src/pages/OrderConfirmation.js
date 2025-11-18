import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/BookVehicle.css";

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { vehicle, total, startDate, endDate, pickupTime, dropoffTime } =
    location.state || {};

  return (
    <div className="book-vehicle-container">
      <div className="booking-card">
        <h2 className="success-title">🎉 Payment Successful!</h2>
        <p className="booking-sub">Your booking has been confirmed.</p>

        <div className="confirm-details">
          <p>
            <b>Vehicle:</b> {vehicle?.name}
          </p>
          <p>
            <b>Pickup:</b> {startDate} at {pickupTime}
          </p>
          <p>
            <b>Drop-off:</b> {endDate} at {dropoffTime}
          </p>
          <p>
            <b>Total Paid:</b> NZ${total}
          </p>
        </div>

        <button
          className="proceed-btn"
          onClick={() => navigate("/feedback")}
        >
          Write Feedback
        </button>
      </div>
    </div>
  );
}
