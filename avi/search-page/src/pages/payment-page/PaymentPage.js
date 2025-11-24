// src/pages/payment-page/PaymentPage.js
// Final version: includes stretched map, white header, overlay blend,
// confirmation popup, assistant, and balanced card layout.

import React, { useEffect, useState } from "react";
import "./PaymentPage.css";
import { useLocation, useNavigate } from "react-router-dom";

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    car,
    pickupDate,
    pickupTime,
    returnDate,
    returnTime,
  } = location.state || {};

  useEffect(() => {
    if (!car) navigate("/search");
  }, [car, navigate]);

  const getDays = () => {
    if (!pickupDate || !returnDate) return 0;

    const start = new Date(`${pickupDate}T${pickupTime}`);
    const end = new Date(`${returnDate}T${returnTime}`);
    const diff = (end - start) / (1000 * 60 * 60 * 24);

    return diff > 0 ? Math.ceil(diff) : 0;
  };

  const rentalDays = getDays();
  const baseTotal = rentalDays * car.price;
  const commission = baseTotal * 0.1;
  const ownerReceives = baseTotal - commission;

  // Popup state
  const [showSuccess, setShowSuccess] = useState(false);

  // Assistant responses
  const answers = {
    payment:
      "Payments are securely processed. Card details are encrypted and never stored.",
    pickup:
      "Pickup instructions will be emailed after payment. Bring ID and your licence.",
    fuel:
      "Return the vehicle with the same fuel level it was picked up with to avoid surcharges.",
    cancellation:
      "Free cancellation is available up to 48 hours before pickup.",
  };

  const handleAssistantClick = (topic) => {
    const output = document.getElementById("supportOutput");
    output.textContent = answers[topic];
  };

  return (
    <>
      <div className={`payment-wrapper ${showSuccess ? "blur-active" : ""}`}>

        {/* LEFT COLUMN */}
        <div className="left-column">

          <div className="payment-card">

            {/* IMAGE & MAP STACK */}
            <div className="image-stack">
              {/* Car Image */}
              <img src={car.imageUrl} alt={car.name} className="payment-car-img" />

              {/* Stretched map container */}
              <div className="pickup-map-container">
                <div className="pickup-map-header">📍 Pick-up Location</div>

                <div className="pickup-map-overlay"></div>

                <img
                  src="https://i.pinimg.com/736x/5f/61/8c/5f618cb6468ca8717794bb5ddb4e4795.jpg"   
                  alt="Pickup Map"
                  className="pickup-map"
                />
              </div>
            </div>

            {/* RIGHT DETAILS */}
            <div className="payment-car-details">
              <h2>{car.name}</h2>
              <p>{car.seats} Seats • {car.transmission} • {car.bags} Bags</p>
              <p className="payment-location">Location: {car.location}</p>

              {/* Features fill horizontal space */}
              <div className="car-features-grid">
                <div>Fair fuel policy</div>
                <div>Free cancellation (48h)</div>
                <div>Unlimited kilometres</div>
                <div>Liability coverage</div>
                <div>Theft coverage</div>
              </div>

              <div className="verification-box">
                <p>✔ Owner identity verified</p>
                <p>✔ Vehicle details validated</p>
                <p>✔ No hidden fees</p>
              </div>

              <div className="included-box">
                <h4>What’s Included</h4>
                <ul>
                  <li>24/7 roadside assistance</li>
                  <li>Basic liability cover</li>
                  <li>Unlimited mileage</li>
                  <li>Flexible pickup window</li>
                </ul>
              </div>

              <div className="fuel-box">
                <h4>Estimated Fuel Cost</h4>
                <p>$23 – $41 based on NZ averages.</p>
              </div>
            </div>
          </div>

          {/* BOOKING DETAILS */}
          <div className="payment-section">
            <h3>Your Booking</h3>

            <div className="payment-info-row">
              <span>Pickup</span>
              <b>{pickupDate} at {pickupTime}</b>
            </div>

            <div className="payment-info-row">
              <span>Dropoff</span>
              <b>{returnDate} at {returnTime}</b>
            </div>

            <div className="payment-info-row">
              <span>Rental Days</span>
              <b>{rentalDays} day(s)</b>
            </div>

            <div className="pickup-instructions">
              <h4>Pickup Instructions</h4>
              <p>You’ll receive pickup instructions via email after payment.</p>
            </div>

            <div className="payment-breakdown">
              <h4>Price Breakdown</h4>
              <p>Owner Receives: <b>${ownerReceives.toFixed(2)}</b></p>
              <p>Platform Fee (10%): <b>${commission.toFixed(2)}</b></p>
              <p>Total: <b>${baseTotal.toFixed(2)}</b></p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="right-column">

          {/* PAYMENT BOX */}
          <div className="payment-box">
            <h3>Secure Payment</h3>

            <div className="payment-logos">
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1200px-Mastercard-logo.svg.png" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" />
              <img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/paypal-icon.png" />
            </div>

            <div className="secure-badges">
              <span>🔒 Encryption</span>
              <span>🛡 Fraud Protection</span>
              <span>✔ Verified Owners</span>
            </div>

            <div className="card-input-wrapper">
              <span className="lock-icon">🔒</span>
              <input
                type="text"
                placeholder="Card Number"
                className="payment-input card-with-icon"
              />
            </div>

            <div className="payment-row">
              <input type="text" placeholder="MM/YY" className="payment-input" />
              <input type="text" placeholder="CVC" className="payment-input" />
            </div>

            <input type="text" placeholder="Name on Card" className="payment-input" />
            <input type="text" placeholder="Billing Address" className="payment-input" />

            <button
              className="payment-btn"
              onClick={() => setShowSuccess(true)}
            >
              Confirm Payment
            </button>

            <p className="processor-note">Payments processed securely.</p>
          </div>

          {/* ASSISTANT */}
          <div className="support-box">
            <div className="assistant-header">
              <img
                src="https://www.shutterstock.com/image-vector/support-icon-can-be-used-600nw-1887496465.jpg"
                className="assistant-avatar"
              />
              <h4>GearUP Assistant</h4>
            </div>

            <p className="assistant-text">Choose a topic below:</p>

            <div className="assistant-buttons">
              <button onClick={() => handleAssistantClick("payment")}>💳 Payment</button>
              <button onClick={() => handleAssistantClick("pickup")}>📍 Pickup</button>
              <button onClick={() => handleAssistantClick("fuel")}>⛽ Fuel Policy</button>
              <button onClick={() => handleAssistantClick("cancellation")}>❌ Cancellation</button>
            </div>

            <div id="supportOutput" className="support-response">
              Select an option to view details.
            </div>
          </div>
        </div>
      </div>

      {/* SUCCESS POPUP */}
      {showSuccess && (
        <div className="payment-success-overlay">
          <div className="payment-success-box">

            <h2>Payment Confirmed!</h2>
            <p>Your booking has been processed successfully.</p>

            <div className="success-btn-row">
              <button
                className="success-btn dashboard"
                onClick={() => navigate("/dashboard")}
              >
                Go to Dashboard
              </button>

              <button
                className="success-btn search"
                onClick={() => navigate("/search")}
              >
                Search More Cars
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PaymentPage;
