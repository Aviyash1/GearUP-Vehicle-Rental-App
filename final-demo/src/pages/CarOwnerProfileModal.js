// src/pages/CarOwnerProfileModal.js
import React, { useState } from "react";
import "../styles/CarOwnerProfileModal.css";
import { db } from "../firebase/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";

export default function CarOwnerProfileModal({ open, onClose }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    licenseNumber: ""
  });

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit verification request
  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.licenseNumber) {
      return alert("Please fill out all fields.");
    }

    // FETCH USER FROM LOCALSTORAGE SESSION (FIXED)
    const sessionUser = JSON.parse(localStorage.getItem("user"));
    if (!sessionUser || !sessionUser.uid) {
      alert("Session expired. Please log in again.");
      onClose();
      return;
    }

    await addDoc(collection(db, "verificationRequests"), {
      userId: sessionUser.uid,          // FIXED
      name: form.name,
      email: form.email,
      licenseNumber: form.licenseNumber,
      status: "Pending",
      createdAt: Date.now()
    });

    alert("Your verification request was submitted!");
    onClose();
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Car Owner Verification</h2>

        <label>Full Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter your full name"
        />

        <label>Email</label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email"
        />

        <label>Driver License Number</label>
        <input
          name="licenseNumber"
          value={form.icenseNumber}
          onChange={handleChange}
          placeholder="Enter license number"
        />

        <div className="modal-actions">
          <button className="btn primary" onClick={handleSubmit}>
            Submit Verification
          </button>
          <button className="btn cancel" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
