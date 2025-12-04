import React from "react";
import "./Bookings.css";

function Bookings({ bookings, cars, loading }) {
  return (
    <div className="content-box fade-in">
      <h2>My Bookings</h2>
      <div className="booking-grid">
        {loading ? (
          <p>Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          bookings.map((booking) => (
            <div className="booking-card" key={booking.id}>
              <h4>{cars.find(c => c.id === booking.carId)?.model}</h4>
              <p><strong>Customer:</strong> {booking.customer}</p>
              <p><strong>Date:</strong> {booking.startDate} to {booking.endDate}</p>
              <span className={`badge ${booking.status.toLowerCase()}`}>{booking.status}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Bookings;
