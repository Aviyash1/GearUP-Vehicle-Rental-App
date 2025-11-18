// src/pages/Login.js
import React, { useState } from "react";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");

    if (!form.email || !form.password) {
      setMsg("✗ Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, form.email, form.password);
      setMsg("✓ Login successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error) {
      console.error("Login error:", error.message);
      if (error.code === "auth/user-not-found") {
        setMsg("✗ No account found with this email.");
      } else if (error.code === "auth/wrong-password") {
        setMsg("✗ Incorrect password.");
      } else {
        setMsg("✗ Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          {msg && (
            <p className={`msg ${msg.startsWith("✓") ? "success" : "error"}`}>
              {msg}
            </p>
          )}
        </form>

        <p className="forgot">
          <a href="/reset">Forgot Password?</a>
        </p>
        <p className="switch">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/register")}>Register</span>
        </p>
      </div>
    </div>
  );
}
