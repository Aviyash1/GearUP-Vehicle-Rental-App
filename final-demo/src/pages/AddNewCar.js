import React, { useState, useEffect } from "react";
import "../styles/AddNewCar.css";
import { addCarToDatabase, fetchCarsByOwner } from "../firebase/carService";

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
    location: "",
    ownerId: null, 
  });

  /* ---------------------------------------------
     LOAD OWNER ID FROM LOCAL STORAGE SESSION
  ----------------------------------------------*/
  useEffect(() => {
    const sessionUser = JSON.parse(localStorage.getItem("user"));
    if (sessionUser && sessionUser.uid) {
      setCar((prev) => ({ ...prev, ownerId: sessionUser.uid }));
    }
  }, []);

  if (!open) return null;

  const handleChange = (e) => {
    let value = e.target.value;

    if (["year", "mileage", "seats", "rent"].includes(e.target.name)) {
      value = value.replace(/[^0-9]/g, "");
    }

    setCar({ ...car, [e.target.name]: value });
  };

  const validateCar = () => {
    const required = [
      "model", "type", "year", "mileage", "engine",
      "color", "seats", "fuel", "transmission",
      "rent", "location", "imageUrl"
    ];

    const missing = required.filter((k) => !String(car[k]).trim());
    if (missing.length > 0) return `Missing: ${missing.join(", ")}`;

    if (!/^\d{4}$/.test(car.year)) return "Year must be 4 digits.";
    if (!car.ownerId) return "Owner ID missing. Please re-login.";

    return null;
  };

  const handleSubmit = async () => {
    const err = validateCar();
    if (err) {
      alert(err);
      return;
    }

    const vehicleData = {
      ...car,
      year: Number(car.year),
      mileage: Number(car.mileage),
      seats: Number(car.seats),
      rent: Number(car.rent),
      createdAt: Date.now(),
      status: "Pending Admin Approval",
    };

    try {
      await addCarToDatabase(vehicleData);

      // 🔥 LOAD ONLY THIS OWNER'S VEHICLES
      const updated = await fetchCarsByOwner(car.ownerId);

      onCarAdded(updated);
      onClose();
    } catch (e) {
      console.error("Failed to add vehicle:", e);
      alert("Failed to add vehicle.");
    }
  };

  return (
    <div className="addcar-overlay" onClick={onClose}>
      <div className="addcar-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Add New Vehicle</h2>

        <div className="addcar-grid">
          {Object.keys(car).map((key) =>
            key !== "description" && key !== "ownerId" ? (
              <input
                key={key}
                name={key}
                value={car[key]}
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                onChange={handleChange}
                className="addcar-input"
              />
            ) : null
          )}

          <textarea
            name="description"
            className="addcar-description"
            value={car.description}
            placeholder="Description (optional)"
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
