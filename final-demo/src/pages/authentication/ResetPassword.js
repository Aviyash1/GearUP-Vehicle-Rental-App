// src/pages/authentication/ResetPassword.js

import React, { useState } from "react";
import "../../styles/Login.css";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebaseConfig";
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";

export default function ResetPassword() {
  const [form, setForm] = useState({ email: "", newPassword: "", confirmPassword: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!form.email || !form.newPassword || !form.confirmPassword) {
      setMsg("✗ Please fill in all fields.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setMsg("✗ Passwords do not match.");
      return;
    }

    try {
      const q = query(collection(db, "users"), where("email", "==", form.email));
      const snap = await getDocs(q);

      if (snap.empty) return setMsg("✗ No user found with that email.");

      const userDoc = snap.docs[0];
      await updateDoc(userDoc.ref, { password: form.newPassword });

      setMsg("✓ Password reset successful! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);

    } catch (err) {
      console.error(err);
      setMsg("✗ Something went wrong.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h1>Forgot Your Password?</h1>
      </div>

      <div className="login-right">
        <h2>Reset Password</h2>

        <form className="reset-form" onSubmit={handleSubmit}>
          <input className="reset-input" placeholder="Email" name="email" onChange={handleChange} />
          <input className="reset-input" placeholder="New Password" name="newPassword" type="password" onChange={handleChange} />
          <input className="reset-input" placeholder="Confirm Password" name="confirmPassword" type="password" onChange={handleChange} />
          <button className="login-btn" type="submit">Reset Password</button>

          {msg && <p className={msg.startsWith("✓") ? "success-text" : "error-text"}>{msg}</p>}
        </form>

        <p className="signup-link"><span onClick={() => navigate("/login")}>Back to Login</span></p>
      </div>
    </div>
  );
}
