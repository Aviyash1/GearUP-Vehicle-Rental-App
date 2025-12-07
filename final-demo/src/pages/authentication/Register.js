import React, { useState } from "react";
import { auth, db } from "../../firebase/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/register.css";

export default function Register() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("User");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !phone || !email || !password) {
      setErrorMsg("Please fill all fields.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name,
        phone,
        email,
        role,
        createdAt: new Date().toISOString()
      });

      await signOut(auth);

      navigate("/login");
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="auth-container">

      {/* ANIMATED LOGO TOP LEFT */}
      <div className="logo-container">
        <svg
          className="gear-logo"
          width="55"
          height="55"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="50" r="12" fill="#1F4E79" />
          <path
            d="
              M50 5 L58 5 L62 20 L75 25 L85 15 L95 25 
              L85 35 L90 50 L85 65 L95 75 L85 85 
              L75 75 L62 80 L58 95 L50 95 L42 95 
              L38 80 L25 75 L15 85 L5 75 L15 65 
              L10 50 L15 35 L5 25 L15 15 L25 25 
              L38 20 L42 5 Z"
            fill="#1F4E79"
          />
        </svg>

        <span className="logo-text">GearUP</span>
      </div>

      {/* LEFT PANEL */}
      <div className="auth-left">
        <h1>Nau Mai, Haere Mai!</h1>

        <p className="auth-subtitle">
          Welcome — we are glad to have you here.
        </p>

        <p className="auth-desc">
          You’re one step away from unlocking your dream rental, or transforming
          your own vehicles into passive income.  
          Sign up on the right to get started.
        </p>

        <p className="auth-desc roles">
          <strong>Choose your role:</strong><br />
          <strong>User</strong> — Looking to rent vehicles<br />
          <strong>Car Owner</strong> — Wanting to list vehicles and start earning
        </p>
      </div>

      {/* RIGHT PANEL */}
      <div className="auth-right">
        <h2 className="register-header">Create Account</h2>

        {errorMsg && <div className="error-box">{errorMsg}</div>}

        <input
          className="input-field"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="input-field"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="input-field"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <select
          className="input-field"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="User">User</option>
          <option value="CarOwner">Car Owner</option>
        </select>

        <input
          type="password"
          className="input-field"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="register-btn" onClick={handleRegister}>
          Sign Up
        </button>

        <p className="login-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
