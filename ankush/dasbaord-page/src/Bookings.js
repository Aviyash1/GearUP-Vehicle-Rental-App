import React from "react";
import "./Bookings.css";

// Component receives bookings, cars, and loading as props
function Bookings({ bookings, cars, loading }) {
  return (
    <div className="content-box fade-in">
      <h2>My Bookings</h2>

      <div className="booking-grid">
        {loading ? (
          // If data is loading, show loading message
          <p>Loading bookings...</p>
        ) : bookings.length === 0 ? (
          // If no bookings exist, show empty message
          <p>No bookings found.</p>
        ) : (
          // Otherwise, loop through each booking and display it
          bookings.map((booking) => (
            <div className="booking-card" key={booking.id}>
              
              {/*
                Find the car associated with this booking.
                This matches booking.carId with cars array.
              */}
              <h4>{cars.find(c => c.id === booking.carId)?.model}</h4>

              <p>
                <strong>Customer:</strong> {booking.customer}
              </p>

              <p>
                <strong>Date:</strong> {booking.startDate} to {booking.endDate}
              </p>

              {/*
                The status is converted to lowercase to match CSS classes.
                For example: "Pending" becomes "pending".
              */}
              <span className={`badge ${booking.status.toLowerCase()}`}>
                {booking.status}
              </span>

            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Bookings;
