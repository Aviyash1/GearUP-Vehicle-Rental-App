// src/pages/authentication/Login.js

import React, { useState } from "react";
import "../../styles/Login.css";
import { db } from "../../firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      // Find user in Firestore
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setError("No user found with this email.");
        return;
      }

      const userDoc = snapshot.docs[0];
      const data = userDoc.data();

      // Validate password
      if (data.password !== password) {
        setError("Incorrect password.");
        return;
      }

      // Save session
      localStorage.setItem("user", JSON.stringify(data));

      // Redirect based on role
      if (data.role === "Admin") navigate("/admin-dashboard");
      else if (data.role === "CarOwner") navigate("/car-owner");
      else navigate("/dashboard");

    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h1>Kia Ora!</h1>
        <p>Welcome to <b>GearUP</b> — your one-stop platform for rental services.</p>
      </div>

      <div className="login-right">
        <h2>Welcome Back</h2>

        {error && <p className="error-box">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <p className="forgot-password" onClick={() => navigate("/reset")}>
          Forgot Password?
        </p>

        <button className="login-btn" onClick={handleLogin}>Log In</button>

        <p className="signup-link">
          Don't have an account? <a href="/register">Sign Up</a>
        </p>
      </div>
    </div>
  );
}
