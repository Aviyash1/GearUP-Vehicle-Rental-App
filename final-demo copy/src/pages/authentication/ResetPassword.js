// src/pages/ResetPassword.js
import React, { useState } from "react";
import "../../styles/Login.css";
import { useNavigate } from "react-router-dom";
import { updatePassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";

export default function ResetPassword() {
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

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
      if (!user) {
        setMsg("✗ Please log in first to change your password.");
        return;
      }

      await updatePassword(user, form.newPassword);
      setMsg("✓ Password updated successfully! Redirecting to login...");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error("Password update error:", error);
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
          {msg && (
            <p className={`msg ${msg.startsWith("✓") ? "success" : "error"}`}>
              {msg}
            </p>
          )}
        </form>

        <p className="switch">
          Back to{" "}
          <span onClick={() => navigate("/")}>Login</span>
        </p>
      </div>
    </div>
  );
}
