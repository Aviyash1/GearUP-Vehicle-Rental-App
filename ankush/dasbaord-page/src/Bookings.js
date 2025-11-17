import React from "react";
import "./Bookings.css";

function Bookings({ bookings, cars }) {
  return (
    <div className="content-box fade-in">
      <h2>My Bookings</h2>
      <div className="booking-grid">
        {bookings.map((booking) => (
          <div className="booking-card" key={booking.id}>
            <h4>{cars.find(c => c.id === booking.carId)?.model}</h4>
            <p><strong>Customer:</strong> {booking.customer}</p>
            <p><strong>Date:</strong> {booking.startDate} to {booking.endDate}</p>
            <span className={`badge ${booking.status.toLowerCase()}`}>{booking.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Bookings;
