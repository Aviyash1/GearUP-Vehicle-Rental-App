// src/pages/payment-page/PaymentPage.js
import React, { useEffect, useState } from "react";
import "./PaymentPage.css";
import { useLocation, useNavigate } from "react-router-dom";

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract data passed from SearchPage
  const {
    car,
    pickupDate,
    pickupTime,
    returnDate,
    returnTime,
  } = location.state || {};

  // If someone manually types the URL, redirect to /search
  useEffect(() => {
    if (!car) navigate("/search");
  }, [car, navigate]);

  // Calculate rental days
  const getDays = () => {
    if (!pickupDate || !returnDate) return 0;

    const start = new Date(`${pickupDate}T${pickupTime}`);
    const end = new Date(`${returnDate}T${returnTime}`);

    const diff = (end - start) / (1000 * 60 * 60 * 24);
    return diff > 0 ? Math.ceil(diff) : 0;
  };

  const rentalDays = getDays();
  const baseTotal = rentalDays * car.price;

  // Commission logic (you chose option B)
  const commissionRate = 0.10; // 10% platform cut
  const commission = baseTotal * commissionRate;
  const ownerReceives = baseTotal - commission;

  return (
    <div className="payment-container">
      <h1 className="payment-title">Complete Your Booking</h1>

      {/* CAR DETAILS CARD */}
      <div className="payment-card">
        <img src={car.image} alt={car.name} className="payment-car-img" />
        <div className="payment-car-details">
          <h2>{car.name}</h2>
          <p>
            {car.seats} Seats • {car.transmission} • {car.bags} Bags
          </p>
          <p className="payment-location">Location: {car.location}</p>
        </div>
      </div>

      {/* BOOKING DETAILS */}
      <div className="payment-section">
        <h3>Booking Details</h3>

        <div className="payment-info-row">
          <span>Pickup:</span>
          <b>{pickupDate} at {pickupTime}</b>
        </div>

        <div className="payment-info-row">
          <span>Dropoff:</span>
          <b>{returnDate} at {returnTime}</b>
        </div>

        <div className="payment-info-row">
          <span>Rental Days:</span>
          <b>{rentalDays} day(s)</b>
        </div>

        <div className="payment-info-row total-row">
          <span>Total Cost:</span>
          <b>${baseTotal}</b>
        </div>

        {/* Commission Breakdown (Your Choice: B) */}
        <div className="payment-breakdown">
          <h4>Price Breakdown</h4>
          <p>Owner Receives: <b>${ownerReceives.toFixed(2)}</b></p>
          <p>GearUP Commission (10%): <b>${commission.toFixed(2)}</b></p>
          <p>Total: <b>${baseTotal.toFixed(2)}</b></p>
        </div>
      </div>

      {/* RENTER INFORMATION */}
      <div className="payment-section">
        <h3>Your Contact Information</h3>

        <input type="text" placeholder="Full Name" className="payment-input" />
        <input type="email" placeholder="Email" className="payment-input" />
        <input type="tel" placeholder="Phone Number" className="payment-input" />
        <input type="text" placeholder="Billing Address" className="payment-input" />
      </div>

      {/* PAYMENT FORM */}
      <div className="payment-section">
        <h3>Payment Details</h3>

        <input type="text" placeholder="Card Number" className="payment-input" />
        <div className="payment-row">
          <input type="text" placeholder="Expiry (MM/YY)" className="payment-input" />
          <input type="text" placeholder="CVC" className="payment-input" />
        </div>
      </div>

      {/* TERMS (placeholder since you’ll paste real T&C later) */}
      <div className="payment-terms-box">
        <p>By proceeding, you agree to the GearUP Terms & Conditions.</p>
      </div>

      {/* SUBMIT BUTTON */}
      <button className="payment-btn">Confirm Payment</button>
    </div>
  );
}

export default PaymentPage;
