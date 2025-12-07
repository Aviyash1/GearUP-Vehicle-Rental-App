import React, { useState, useEffect } from "react";
import "../styles/CarModal.css";
import { updateCar } from "../firebase/carService";

export default function CarEditModal({ open, onClose, car, onSaved }) {
  const [form, setForm] = useState({});

  useEffect(() => {
    if (car) setForm(car);
  }, [car]);

  if (!open || !car) return null;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    await updateCar(car.id, form);
    onSaved();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box compact">

        {/* Close button */}
        <button className="modal-close" onClick={onClose}>✕</button>

        <h2 className="modal-title">Edit Vehicle</h2>

        <div className="modal-form compact">

          <input name="model" value={form.model} onChange={handleChange} placeholder="Model" />
          <input name="year" value={form.year} onChange={handleChange} placeholder="Year" />
          <input name="mileage" value={form.mileage} onChange={handleChange} placeholder="Mileage" />

          <input name="engine" value={form.engine} onChange={handleChange} placeholder="Engine" />
          <input name="color" value={form.color} onChange={handleChange} placeholder="Color" />
          <input name="seats" value={form.seats} onChange={handleChange} placeholder="Seats" />

          <input name="fuel" value={form.fuel} onChange={handleChange} placeholder="Fuel Type" />
          <input name="transmission" value={form.transmission} onChange={handleChange} placeholder="Transmission" />
          <input name="rent" value={form.rent} onChange={handleChange} placeholder="Daily Rent" />

          <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="Image URL" />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            rows={3}
          />

          {/* Locked (non-editable) */}
          <input value={form.status} disabled className="locked-field small" />
          <input value={form.type} disabled className="locked-field small" />

        </div>

        <button className="modal-save compact" onClick={handleSave}>
          Save Changes
        </button>

      </div>
    </div>
  );
}
