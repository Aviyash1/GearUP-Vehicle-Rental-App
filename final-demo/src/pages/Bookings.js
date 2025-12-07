import React from "react";
import "../styles/Bookings.css";

function Bookings({ bookings = [], cars = [], loading = false }) {
  return (
    <div className="content-box fade-in">
      <h2>My Bookings</h2>

      {loading ? (
        <p>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p className="no-bookings-text">
          There are currently no active bookings for your vehicles.
        </p>
      ) : (
        <div className="booking-grid">
          {bookings.map((b) => {
            const car = cars.find((c) => c.model === b.vehicleName);

            return (
              <div key={b.id} className="booking-card">
                
                {/* Car Image */}
                <img
                  className="booking-car-img"
                  src={car?.imageUrl || b.vehicleImg || "/placeholder-car.png"}
                  alt={b.vehicleName}
                />

                {/* Car Name */}
                <h3 className="booking-car-name">{b.vehicleName}</h3>

                <div className="booking-info">
                  <p>
                    <strong>Customer:</strong> {b.userId}
                  </p>

                  <p>
                    <strong>Dates:</strong> {b.startDate} → {b.endDate}
                  </p>

                  <p>
                    <strong>Total Cost:</strong> ${b.totalCost}
                  </p>

                  <p>
                    <strong>Pickup:</strong> {b.pickupTime}
                  </p>

                  <p>
                    <strong>Dropoff:</strong> {b.dropoffTime}
                  </p>
                </div>

                <span className={`badge booking-status ${b.status.toLowerCase()}`}>
                  {b.status}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Bookings;
