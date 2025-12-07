import React, { useState } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

function ProfileModal({ open, onClose }) {
  const [form, setForm] = useState({
    fullName: "",
    dob: "",
    licenseNumber: "",
    licenseImage: null,
  });

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("Error: No logged in user.");
      return;
    }

    // 🟢 SAVE PROFILE DATA + STATUS FLAGS
    await setDoc(
      doc(db, "users", user.uid),
      {
        profileCompleted: true,
        ownerVerified: false, // Admin will later update this to true
        carOwnerProfile: {
          fullName: form.fullName,
          dob: form.dob,
          licenseNumber: form.licenseNumber,
        },
      },
      { merge: true }
    );

    alert("Profile submitted for verification!");
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Car Owner Profile</h2>

        <input
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
        />

        <input
          name="dob"
          placeholder="Date of Birth"
          value={form.dob}
          onChange={handleChange}
        />

        <input
          name="licenseNumber"
          placeholder="Driver License Number"
          value={form.licenseNumber}
          onChange={handleChange}
        />

        <button className="btn primary" onClick={handleSave}>
          Submit for Verification
        </button>

        <button className="btn cancel" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default ProfileModal;
