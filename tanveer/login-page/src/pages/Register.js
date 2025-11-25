import React, { useState } from "react";
import { auth, db } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import "../styles/register.css";

export default function Register() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("User");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !phone || !email || !password) {
      alert("Please fill all fields");
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

      // ✔ Stop Firebase auto-login
      await signOut(auth);

      // ✔ Redirect user to login instead of dashboard
      navigate("/login");

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h2 className="register-title">Create Account</h2>

        <input className="input-field" placeholder="Full Name"
          value={name} onChange={(e) => setName(e.target.value)} />

        <input className="input-field" placeholder="Email"
          value={email} onChange={(e) => setEmail(e.target.value)} />

        <input className="input-field" placeholder="Phone"
          value={phone} onChange={(e) => setPhone(e.target.value)} />

        <select className="input-field"
          value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="User">User</option>
          <option value="CarOwner">Car Owner</option>
          <option value="Admin">Admin</option>
        </select>

        <input type="password" className="input-field" placeholder="Password"
          value={password} onChange={(e) => setPassword(e.target.value)} />

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
