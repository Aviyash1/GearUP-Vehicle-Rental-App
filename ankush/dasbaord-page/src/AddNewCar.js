import React, { useState } from "react";
import "./AddNewCar.css";
import { addCarToDatabase, fetchCars } from "./firebase/carService";

export default function AddNewCar({ open, onClose, onCarAdded }) {
  // This state holds all input values for the car
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

  // If modal is not open, do not render anything
  if (!open) return null;

  // Update car state when user types in an input field
  const handleChange = (e) => {
    setCar({ ...car, [e.target.name]: e.target.value });
  };

  // Basic validation to check missing fields and year format
  const validateCar = () => {
    const required = [
      "model",
      "type",
      "year",
      "mileage",
      "engine",
      "color",
      "seats",
      "fuel",
      "transmission",
      "rent",
    ];

    // Find missing required fields
    const missing = required.filter((k) => !String(car[k]).trim());
    if (missing.length) return `Missing: ${missing.join(", ")}`;

    // Validate that year is exactly 4 digits
    if (!/^\d{4}$/.test(car.year)) return "Year must be 4 digits.";

    return null;
  };

  // Submit the form and save the new car to Firebase
  const handleSubmit = async () => {
    const err = validateCar();
    if (err) return alert(err);

    try {
      // Save new car to database
      await addCarToDatabase({
        ...car,
        status: "Pending Admin Approval",
        createdAt: Date.now(),
      });

      // Fetch updated list of cars
      const updated = await fetchCars();

      // Update parent's car list
      onCarAdded(updated);

      // Close modal after saving
      onClose();

    } catch (e) {
      console.error("Failed to add vehicle:", e);
      alert("Failed to add vehicle");
    }
  };

  return (
    // Clicking overlay closes the modal
    <div className="addcar-overlay" onClick={onClose}>

      {/* Stop click from closing modal when clicking inside box */}
      <div className="addcar-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Add New Vehicle</h2>

        {/* Responsive grid of all input fields */}
        <div className="addcar-grid">
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

          {/* Large multiline field for description */}
          <textarea
            name="description"
            value={car.description}
            placeholder="Description"
            onChange={handleChange}
          />
        </div>

        {/* Buttons for submitting or closing */}
        <div className="addcar-actions">
          <button className="btn primary" onClick={handleSubmit}>
            Submit
          </button>

          <button className="btn cancel" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
