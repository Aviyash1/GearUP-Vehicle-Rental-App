// src/pages/authentication/Register.js

import React, { useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";
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
    setErrorMsg("");

    if (!name || !phone || !email || !password) {
      setErrorMsg("Please fill all fields.");
      return;
    }

    try {
      // Check if email already used
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setErrorMsg("Email already registered.");
        return;
      }

      // Generate UID manually
      const userId = crypto.randomUUID();

      // Save user in Firestore
      await setDoc(doc(db, "users", userId), {
        uid: userId,
        name,
        phone,
        email,
        password,
        role,
        createdAt: new Date().toISOString()
      });

      navigate("/login");
    } catch (err) {
      console.error(err);
      setErrorMsg("Registration failed.");
    }
  };

  return (
    <div className="auth-container">
      {/* LEFT PANEL */}
      <div className="auth-left">
        <h1>Nau Mai, Haere Mai!</h1>
        <p className="auth-subtitle">
          You're one step away from joining GearUP.
        </p>
      </div>

      {/* RIGHT PANEL */}
      <div className="auth-right">
        <h2 className="register-header">Create Account</h2>

        {errorMsg && <div className="error-box">{errorMsg}</div>}

        <input className="input-field" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="input-field" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="input-field" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />

        <select className="input-field" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="User">User</option>
          <option value="CarOwner">Car Owner</option>
        </select>

        <input type="password" className="input-field" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button className="register-btn" onClick={handleRegister}>Sign Up</button>

        <p className="login-link">Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}
