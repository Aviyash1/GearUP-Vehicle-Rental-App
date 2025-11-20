// src/pages/BookVehicle.js
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
      alert("Please select both start and end dates.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      alert("End date must be after start date.");
      return;
    }

    setTotal(diffDays * vehicle.price);
  };

  const handleCheckout = () => {
    if (!startDate || !endDate || !pickupTime || !dropoffTime) {
      alert("Please fill all dates and times before checkout.");
      return;
    }

    if (!total) {
      alert("Please calculate the total before proceeding.");
      return;
    }

    // 🔥 Only navigate – booking will be saved in PaymentPage after payment success
    navigate("/payment", {
      state: {
        vehicle,
        total,
        startDate,
        endDate,
        pickupTime,
        dropoffTime,
      },
    });
  };

  return (
    <div className="book-vehicle-page">
      <div className="book-card">
        <img src={vehicle.img} alt={vehicle.name} className="book-img" />
        <h2 className="book-title">{vehicle.name}</h2>
        <p className="book-type">{vehicle.type}</p>
        <p className="book-price">NZ${vehicle.price}/day</p>

        {/* Dates */}
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

        {/* Times */}
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
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
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
