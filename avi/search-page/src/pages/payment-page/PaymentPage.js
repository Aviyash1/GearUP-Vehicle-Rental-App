// src/pages/payment-page/PaymentPage.js
import React, { useEffect, useState } from "react";
import "./PaymentPage.css";
import { useLocation, useNavigate } from "react-router-dom";

// Firebase
import { auth } from "../../firebase/firebaseConfig";
import { createBooking } from "../../firebase/bookingService";

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

  // Calculate rental days
  const getDays = () => {
    if (!pickupDate || !returnDate) return 0;

    const start = new Date(`${pickupDate}T${pickupTime}`);
    const end = new Date(`${returnDate}T${returnTime}`);
    const diff = (end - start) / (1000 * 60 * 60 * 24);

    return diff > 0 ? Math.ceil(diff) : 0;
  };

  // Fixed rent calculation
  const rentalDays = getDays();
  const dailyRent = Number(car?.rent || 0);
  const baseTotal = rentalDays * dailyRent;
  const commission = baseTotal * 0.10;
  const ownerReceives = baseTotal - commission;

  const [showSuccess, setShowSuccess] = useState(false);

  // FAQ Assistant
  const answers = {
    payment:
      "Payments are processed securely. Your card details are encrypted and never stored.",
    pickup:
      "Pickup instructions will be emailed after payment. Bring your ID and driver's license.",
    fuel:
      "Return the car with the same amount of fuel to avoid surcharges.",
    cancellation:
      "Free cancellation up to 48 hours before pickup.",
  };

  const handleAssistantClick = (topic) => {
    const output = document.getElementById("supportOutput");
    output.textContent = answers[topic];
  };

  // SAVE BOOKING TO FIREBASE
  const handleConfirmPayment = async () => {
    if (!auth.currentUser) {
      navigate("/login");
      return;
    }

    const bookingData = {
      userId: auth.currentUser.uid,
      carId: car.id,
      carModel: car.model,
      carImage: car.imageUrl,
      pickupDate,
      pickupTime,
      returnDate,
      returnTime,
      rentalDays,
      dailyRent,
      totalPrice: baseTotal,
      platformFee: commission,
      ownerReceives,
    };

    const result = await createBooking(bookingData);

    if (result.success) {
      setShowSuccess(true);
    } else {
      alert("Failed to save booking.");
    }
  };

  return (
    <>
      <div className={`payment-wrapper ${showSuccess ? "blur-active" : ""}`}>

        {/* LEFT COLUMN */}
        <div className="left-column">

          <div className="payment-card">
            <div className="image-stack">

              <img src={car.imageUrl} alt={car.model} className="payment-car-img" />

              <div className="pickup-map-container">
                <div className="pickup-map-header">📍 Pick-up Location</div>

                <div className="pickup-map-overlay"></div>

                <img
                  src="https://www.apple.com/v/maps/d/images/overview/background_light_alt__bdgrj5s9pwqq_xlarge.jpg"
                  alt="Pickup Map"
                  className="pickup-map"
                />
              </div>
            </div>

            {/* CAR DETAILS */}
            <div className="payment-car-details">
              <h2>{car.model}</h2>
              <p>{car.seats} Seats • {car.transmission} • 2 Bags</p>
              <p className="payment-location">Location: {car.location}</p>

              <div className="car-features-grid">
                <div>Fair fuel policy</div>
                <div>Free cancellation (48h)</div>
                <div>Unlimited kilometres</div>
                <div>Liability coverage</div>
                <div>Theft protection</div>
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

          {/* PAYMENT FORM */}
          <div className="payment-box">
            <h3>Secure Payment</h3>

            <div className="payment-logos">
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1200px-Mastercard-logo.svg.png" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" />
              <img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/paypal-icon.png" />
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

            <button className="payment-btn" onClick={handleConfirmPayment}>
              Confirm Payment
            </button>

            <p className="processor-note">Payments are encrypted and securely processed.</p>
          </div>

          {/* FAQ ASSISTANT */}
          <div className="support-box">
            <div className="assistant-header">
              <img
                src="https://www.shutterstock.com/image-vector/support-icon-can-be-used-600nw-1887496465.jpg"
                className="assistant-avatar"
              />
              <h4>GearUP Assistant</h4>
            </div>

            <p className="assistant-text">Select a topic below:</p>

            <div className="assistant-buttons">
              <button onClick={() => handleAssistantClick("payment")}>Payment</button>
              <button onClick={() => handleAssistantClick("pickup")}>Pickup</button>
              <button onClick={() => handleAssistantClick("fuel")}>Fuel Policy</button>
              <button onClick={() => handleAssistantClick("cancellation")}>Cancellation</button>
            </div>

            <div id="supportOutput" className="support-response">
              Select an option above to view details.
            </div>
          </div>
        </div>
      </div>

      {/* SUCCESS POPUP */}
      {showSuccess && (
        <div className="payment-success-overlay">
          <div className="payment-success-box">
            <h2>Payment Successful!</h2>
            <p>Your booking has been confirmed.</p>

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
