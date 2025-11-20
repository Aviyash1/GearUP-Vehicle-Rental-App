// src/pages/Register.js
import React, { useState } from "react";
import "../styles/register.css";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.phone || !form.password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setTimeout(() => setLoading(false), 10000); // ⏳ failsafe: stop loading after 10s max

    try {
      // ✅ 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email.trim(),
        form.password
      );
      const user = userCredential.user;

      // ✅ 2. Save user info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        createdAt: new Date().toISOString(),
      });

      // ✅ 3. Show success + redirect
      toast.success("✓ Registration successful! Redirecting to login...");
      setLoading(false);

      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error("Signup error:", error.code, error.message);
      setLoading(false);

      if (error.code === "auth/email-already-in-use") {
        toast.error("Email is already registered.");
      } else if (error.code === "auth/invalid-email") {
        toast.error("Invalid email format.");
      } else if (error.code === "auth/weak-password") {
        toast.error("Password should be at least 6 characters.");
      } else if (error.code === "permission-denied") {
        toast.error("Firestore permission denied — check Firebase rules.");
      } else {
        toast.error("Signup failed. Please try again.");
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            disabled={loading}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            disabled={loading}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            disabled={loading}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            disabled={loading}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="switch">
          Already have an account?{" "}
          <span onClick={() => navigate("/")}>Login</span>
        </p>
      </div>

      <ToastContainer position="top-center" autoClose={2500} hideProgressBar />
    </div>
  );
}
