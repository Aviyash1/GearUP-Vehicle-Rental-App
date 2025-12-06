import React, { useState } from "react";
import "./AddNewCar.css";
import { addCarToDatabase, fetchCars } from "./firebase/carService";

export default function AddNewCar({ open, onClose, onCarAdded }) {

  const [car, setCar] = useState({
    model: "",
    type: "",
    year: "",
    mileage: "",
    engine: "",
    color: "",
    seats: "",
    fuel: "",
    transmission: "",
    rent: "",
    imageUrl: "",   
    description: "",
  });

  if (!open) return null;

  const handleChange = (e) => {
    setCar({ ...car, [e.target.name]: e.target.value });
  };

  const validateCar = () => {
    const required = [
      "model", "type", "year", "mileage", "engine",
      "color", "seats", "fuel", "transmission", "rent"
    ];

    const missing = required.filter((k) => !String(car[k]).trim());
    if (missing.length) return `Missing: ${missing.join(", ")}`;
    if (!/^\d{4}$/.test(car.year)) return "Year must be 4 digits.";

    return null;
  };

  const handleSubmit = async () => {
    const err = validateCar();
    if (err) return alert(err);

    try {
      await addCarToDatabase({
        ...car,
        status: "Pending Admin Approval",
        createdAt: Date.now(),
      });

      const updated = await fetchCars();
      onCarAdded(updated);
      onClose();

    } catch (e) {
      console.error("Failed to add vehicle:", e);
      alert("Failed to add vehicle");
    }
  };

  return (
    <div className="addcar-overlay" onClick={onClose}>
      <div className="addcar-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Add New Vehicle</h2>

        <div className="addcar-grid">

          {/* Renders all input fields except description */}
          {Object.keys(car).map((key) =>
            key !== "description" ? (
              <input
                key={key}
                name={key}
                value={car[key]}
                placeholder={key}
                onChange={handleChange}
              />
            ) : null
          )}

          {/* Description full-size field */}
          <textarea
            name="description"
            value={car.description}
            placeholder="Description"
            onChange={handleChange}
          />
        </div>

        <div className="addcar-actions">
          <button className="btn primary" onClick={handleSubmit}>Submit</button>
          <button className="btn cancel" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
