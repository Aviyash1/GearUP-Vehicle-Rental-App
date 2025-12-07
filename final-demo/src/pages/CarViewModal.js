import React from "react";
import "../styles/CarModal.css";

export default function CarViewModal({ open, onClose, car }) {
  if (!open || !car) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">

        <button className="modal-close" onClick={onClose}>✕</button>

        <img src={car.imageUrl} className="modal-image" />

        <h2>{car.model}</h2>
        <span className="modal-badge">{car.status}</span>

        <div className="modal-grid">
          <p><b>Year:</b> {car.year}</p>
          <p><b>Mileage:</b> {car.mileage}</p>
          <p><b>Seats:</b> {car.seats}</p>
          <p><b>Fuel:</b> {car.fuel}</p>
          <p><b>Transmission:</b> {car.transmission}</p>
          <p><b>Rent:</b> ${car.rent}</p>
        </div>

        <h3>Description</h3>
        <p className="modal-description">{car.description}</p>

      </div>
    </div>
  );
}
