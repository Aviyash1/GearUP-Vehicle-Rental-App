// src/pages/authentication/Login.js

import React, { useState } from "react";
import "../../styles/Login.css";
import { auth, db } from "../../firebase/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
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
      // Sign in user
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const uid = userCredential.user.uid;

      // Get user profile from Firestore
      const snap = await getDoc(doc(db, "users", uid));

      if (!snap.exists()) {
        setError("User profile not found in database.");
        return;
      }

      const data = snap.data();
      const role = data.role || "User";

      // ⭐ ROLE-BASED REDIRECTS
      if (role === "Admin") {
        navigate("/admin-dashboard");
      } else if (role === "CarOwner") {
        navigate("/car-owner");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);

      // Firebase error messages
      if (err.code === "auth/user-not-found") setError("User record not found.");
      else if (err.code === "auth/wrong-password") setError("Incorrect password.");
      else if (err.code === "auth/invalid-email") setError("Invalid email.");
      else setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h1>Kia Ora!</h1>
        <p>
          Welcome to <b>GearUP</b> — your one-stop platform for all your rental
          needs.
        </p>
        <p>Manage your bookings, discover vehicles, and enjoy a seamless rental experience.</p>
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

        <button className="login-btn" onClick={handleLogin}>
          Log In
        </button>

        <p className="signup-link">
          Don't have an account? <a href="/register">Sign Up</a>
        </p>
      </div>
    </div>
  );
}
