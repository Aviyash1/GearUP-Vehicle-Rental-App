// src/pages/ResetPassword.js
import React, { useState } from "react";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
import { updatePassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function ResetPassword() {
  // Local form state for two password fields
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });

  // Feedback message (success or error)
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  /**
   * Handles both inputs.
   * Uses name prop to update the correct field.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Form submission:
   * 1. Basic validation (empty fields, mismatch, length check)
   * 2. Firebase updatePassword() call
   * 3. Handle "requires recent login" separately (common Firebase gotcha)
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    // Validation checks
    if (!form.newPassword || !form.confirmPassword) {
      setMsg("✗ Please fill in both fields.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setMsg("✗ Passwords do not match.");
      return;
    }

    if (form.newPassword.length < 6) {
      setMsg("✗ Password must be at least 6 characters.");
      return;
    }

    try {
      const user = auth.currentUser;

      // User must be logged in to change password
      if (!user) {
        setMsg("✗ Please log in first to change your password.");
        return;
      }

      // Firebase updates the password for the current user
      await updatePassword(user, form.newPassword);

      setMsg("✓ Password updated successfully! Redirecting to login...");

      // Give user visual confirmation then redirect
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error("Password update error:", error);

      // Most common error: user hasn’t authenticated recently
      if (error.code === "auth/requires-recent-login") {
        setMsg("✗ Please log in again to change your password.");
      } else {
        setMsg("✗ Failed to update password. Try again.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Reset Password</h2>

        {/* Password Reset Form */}
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={form.newPassword}
            onChange={handleChange}
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
          />

          <button type="submit">Reset Password</button>

          {/* Display success or error message */}
          {msg && (
            <p className={`msg ${msg.startsWith("✓") ? "success" : "error"}`}>
              {msg}
            </p>
          )}
        </form>

        {/* Link back to login */}
        <p className="switch">
          Back to <span onClick={() => navigate("/")}>Login</span>
        </p>
      </div>
    </div>
  );
}
