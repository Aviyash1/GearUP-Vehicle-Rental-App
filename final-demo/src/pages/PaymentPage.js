import React, { useEffect, useState } from "react";
import "../styles/PaymentPage.css";
import { useLocation, useNavigate } from "react-router-dom";

import { auth, db } from "../firebase/firebaseConfig";
import { createBooking } from "../firebase/bookingService";
import { addDoc, collection } from "firebase/firestore";

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

  // RENTAL DAY CALCULATION
  const getDays = () => {
    if (!pickupDate || !returnDate) return 0;

    const start = new Date(`${pickupDate}T${pickupTime}`);
    const end = new Date(`${returnDate}T${returnTime}`);
    const diff = (end - start) / (1000 * 60 * 60 * 24);

    return diff > 0 ? Math.ceil(diff) : 0;
  };

  const rentalDays = getDays();
  const dailyRent = Number(car?.rent || 0);
  const baseTotal = rentalDays * dailyRent;
  const commission = baseTotal * 0.1;
  const ownerReceives = baseTotal - commission;

  const [showSuccess, setShowSuccess] = useState(false);

  // SUPPORT FAQ
  const answers = {
    payment: "Payments are encrypted and securely processed.",
    pickup: "Bring your ID and license at pickup.",
    fuel: "Return the car with the same fuel level.",
    cancellation: "Free cancellation up to 48 hours before pickup.",
  };

  const handleAssistantClick = (topic) => {
    document.getElementById("supportOutput").textContent = answers[topic];
  };

  // CONFIRM PAYMENT
  const handleConfirmPayment = async () => {
    if (!auth.currentUser) return navigate("/login");

    const bookingData = {
      userId: auth.currentUser.uid,
      ownerId: car.ownerId || "UNKNOWN",
      carId: car.id,
      carModel: car.model,
      carImage: car.imageUrl,
      location: car.location,

      pickupDate,
      pickupTime,
      returnDate,
      returnTime,
      rentalDays,

      dailyRent,
      totalPrice: baseTotal,
      platformFee: commission,
      ownerReceives,

      status: "Active",
      createdAt: Date.now(),
    };

    const result = await createBooking(bookingData);

    if (result.success) {
      // 🔥 ADD NOTIFICATION FOR USER
      await addDoc(collection(db, "notifications"), {
        userId: auth.currentUser.uid,
        title: "Booking Confirmed",
        message: `Your booking for ${car.model} is confirmed.
Pickup: ${pickupDate} ${pickupTime}
Return: ${returnDate} ${returnTime}`,
        createdAt: new Date(),
        read: false,
        type: "success",
      });

      setShowSuccess(true);
    } else {
      alert("Booking failed.");
    }
  };

  return (
    <>
      <div className={`payment-wrapper ${showSuccess ? "blur-active" : ""}`}>

        {/* LEFT SIDE */}
        <div className="left-column">
          <div className="payment-card">
            <div className="image-stack">
              <img src={car.imageUrl} alt={car.model} className="payment-car-img" />

              <div className="pickup-map-container">
                <div className="pickup-map-header">📍 Pick-up Location</div>
                <div className="pickup-map-overlay"></div>

                <img
                  src="https://www.apple.com/v/maps/d/images/overview/background_light_alt__bdgrj5s9pwqq_xlarge.jpg"
                  className="pickup-map"
                  alt="Map"
                />
              </div>
            </div>

            <div className="payment-car-details">
              <h2>{car.model}</h2>
              <p>{car.seats} Seats • {car.transmission} • 2 Bags</p>
              <p>Location: {car.location}</p>

              <div className="car-features-grid">
                <div>Fair fuel policy</div>
                <div>Unlimited km</div>
                <div>Free cancellation</div>
                <div>Roadside assist</div>
              </div>

              <div className="verification-box">
                <p>✔ Owner verified</p>
                <p>✔ Car validated</p>
                <p>✔ No hidden fees</p>
              </div>

              <div className="fuel-box">
                <h4>Estimated Fuel Cost</h4>
                <p>$23 – $41 based on NZ averages.</p>
              </div>
            </div>
          </div>

          {/* BOOKING SUMMARY */}
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
              <span>Days</span>
              <b>{rentalDays}</b>
            </div>

            <div className="payment-breakdown">
              <p>Owner Receives: <b>${ownerReceives.toFixed(2)}</b></p>
              <p>Platform Fee: <b>${commission.toFixed(2)}</b></p>
              <p>Total: <b>${baseTotal.toFixed(2)}</b></p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="right-column">
          <div className="payment-box">
            <h3>Secure Payment</h3>

            <div className="payment-logos">
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1200px-Mastercard-logo.svg.png" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg" />
            </div>

            <div className="card-input-wrapper">
              <span className="lock-icon">🔒</span>
              <input type="text" className="payment-input card-with-icon" placeholder="Card Number" />
            </div>

            <div className="payment-row">
              <input type="text" className="payment-input" placeholder="MM/YY" />
              <input type="text" className="payment-input" placeholder="CVC" />
            </div>

            <input type="text" className="payment-input" placeholder="Name on Card" />

            <button className="payment-btn" onClick={handleConfirmPayment}>
              Confirm Payment
            </button>
          </div>

          <div className="support-box">
            <div className="assistant-header">
              <img className="assistant-avatar"
                src="https://www.shutterstock.com/image-vector/support-icon-can-be-used-600nw-1887496465.jpg"
              />
              <h4>GearUP Support</h4>
            </div>

            <div className="assistant-buttons">
              <button onClick={() => handleAssistantClick("payment")}>Payment</button>
              <button onClick={() => handleAssistantClick("pickup")}>Pickup</button>
              <button onClick={() => handleAssistantClick("fuel")}>Fuel</button>
              <button onClick={() => handleAssistantClick("cancellation")}>Cancel</button>
            </div>

            <div id="supportOutput" className="support-response">
              Select a topic above.
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
                onClick={() => navigate("/searchpage")}
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
