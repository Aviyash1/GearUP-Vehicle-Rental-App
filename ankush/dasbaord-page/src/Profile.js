import React from "react";
import "./Profile.css";

export default function ProfileModal({
  open,
  profile,
  onClose,
  onChange,
  onSave,
}) {
  if (!open) return null;

  return (
    <div className="profile-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Edit Profile</h2>

        <div className="profile-grid">

          {/* LEFT SIDE — JUST IMAGE */}
          <div className="profile-image-section">
            <img
              src={profile.profileImage}
              alt="Profile"
              className="profile-preview"
            />
          </div>

          {/* RIGHT SIDE — FIELDS */}
          <div className="profile-right">
            <input
              className="input-full"
              name="name"
              value={profile.name}
              onChange={onChange}
              placeholder="Full Name"
            />

            <input
              name="email"
              value={profile.email}
              onChange={onChange}
              placeholder="Email"
            />

            <input
              name="phone"
              value={profile.phone}
              onChange={onChange}
              placeholder="Phone"
            />

            <input
              name="address"
              value={profile.address}
              onChange={onChange}
              placeholder="Address"
              className="input-full"
            />

            <input
              name="city"
              value={profile.city}
              onChange={onChange}
              placeholder="City"
            />

            <input
              name="country"
              value={profile.country}
              onChange={onChange}
              placeholder="Country"
            />

            <input
              name="license"
              value={profile.license}
              onChange={onChange}
              placeholder="License"
            />

            <input
              name="bank"
              value={profile.bank}
              onChange={onChange}
              placeholder="Bank"
            />

            <input
              name="account"
              value={profile.account}
              onChange={onChange}
              placeholder="Account"
            />
          </div>
        </div>

        <div className="profile-actions">
          <button className="btn primary" onClick={onSave}>Save</button>
          <button className="btn cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
