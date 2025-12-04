import React from "react";
import "./Profile.css";

export default function ProfileModal({
  open,
  profile,
  onClose,
  onChange,
  onSave,
}) {
  // Do not show modal if open is false
  if (!open) return null;

  return (
    // Clicking the overlay closes the modal
    <div className="profile-overlay" onClick={onClose}>
      
      {/* Stop modal from closing when clicking inside */}
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Edit Profile</h2>

        <div className="profile-grid">

          {/* Left side: profile image preview */}
          <div className="profile-image-section">
            <img
              src={profile.profileImage}
              alt="Profile"
              className="profile-preview"
            />
          </div>

          {/* Right side: form inputs */}
          <div className="profile-right">

            {/* Full Name */}
            <input
              className="input-full"
              name="name"
              value={profile.name}
              onChange={onChange}
              placeholder="Full Name"
            />

            {/* Email */}
            <input
              name="email"
              value={profile.email}
              onChange={onChange}
              placeholder="Email"
            />

            {/* Phone */}
            <input
              name="phone"
              value={profile.phone}
              onChange={onChange}
              placeholder="Phone"
            />

            {/* Address */}
            <input
              name="address"
              value={profile.address}
              onChange={onChange}
              placeholder="Address"
              className="input-full"
            />

            {/* City */}
            <input
              name="city"
              value={profile.city}
              onChange={onChange}
              placeholder="City"
            />

            {/* Country */}
            <input
              name="country"
              value={profile.country}
              onChange={onChange}
              placeholder="Country"
            />

            {/* License */}
            <input
              name="license"
              value={profile.license}
              onChange={onChange}
              placeholder="License"
            />

            {/* Bank */}
            <input
              name="bank"
              value={profile.bank}
              onChange={onChange}
              placeholder="Bank"
            />

            {/* Account */}
            <input
              name="account"
              value={profile.account}
              onChange={onChange}
              placeholder="Account"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="profile-actions">
          <button className="btn primary" onClick={onSave}>Save</button>
          <button className="btn cancel" onClick={onClose}>Cancel</button>
        </div>

      </div>
    </div>
  );
}
