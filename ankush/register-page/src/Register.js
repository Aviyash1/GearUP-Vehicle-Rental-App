import React, { useState } from "react";
import "./Register.css";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [msg, setMsg] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.confirm) {
      setMsg("✗ Please fill all fields.");
      return;
    }

    if (form.password !== form.confirm) {
      setMsg("✗ Passwords do not match.");
      return;
    }

    setMsg("✓ Registration successful (simulation).");
  }

  return (
    <div
      className="login-container"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL + "/bg.jpeg"})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="login-card">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
          />
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
          <input
            type="password"
            name="confirm"
            placeholder="Confirm Password"
            value={form.confirm}
            onChange={handleChange}
          />
          <button type="submit">Register</button>
          {msg && (
            <p className={`msg ${msg.startsWith("✗") ? "error" : "ok"}`}>{msg}</p>
          )}
        </form>

        {/*  Display text only — not an active link */}
        <p className="switch">
          Already have an account? <span>Login here</span>
        </p>
      </div>
    </div>
  );
}
