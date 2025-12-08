// src/pages/authentication/ResetPassword.js
import React, { useState } from "react";
import "../../styles/Login.css";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebaseConfig";
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";

export default function ResetPassword() {
  const [form, setForm] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    // Basic validation
    if (!form.email || !form.newPassword || !form.confirmPassword) {
      setMsg("✗ Please fill in all fields.");
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
      // Query Firestore for user by email
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", form.email));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setMsg("✗ No account found with that email.");
        return;
      }

      // Update password in Firestore
      const userDoc = snapshot.docs[0];
      await updateDoc(userDoc.ref, { password: form.newPassword });

      setMsg("✓ Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/"), 2000);

    } catch (error) {
      console.error(error);
      setMsg("✗ Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-container">
      
      {/* LEFT PANEL */}
      <div className="login-left">
        <h1>Forgot Your Password?</h1>

        <p className="subheading">Wareware te kupuhipa?</p>

        <p>
          That's okay — even the strongest Kia Ora warriors forget sometimes.
          <br /><br />
          No worries. Enter your email and your new password on the right,
          and we’ll reset it for you.
        </p>
      </div>

      {/* RIGHT PANEL */}
      <div className="login-right">
        <h2>Reset Password</h2>

        <form className="reset-form" onSubmit={handleSubmit}>
          
          <input
            type="email"
            className="reset-input"
            placeholder="Enter Your Email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            type="password"
            className="reset-input"
            placeholder="New Password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
          />

          <input
            type="password"
            className="reset-input"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
          />

          <button type="submit" className="login-btn">
            Reset Password
          </button>

          {msg && (
            <p className={msg.startsWith("✓") ? "success-text" : "error-text"}>
              {msg}
            </p>
          )}
        </form>

        <p className="signup-link">
          <span onClick={() => navigate("/")}>Back to Login</span>
        </p>
      </div>
    </div>
  );
}
