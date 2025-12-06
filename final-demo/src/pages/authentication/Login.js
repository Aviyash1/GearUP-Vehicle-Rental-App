import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const user = res.user;

      const snap = await getDoc(doc(db, "users", user.uid));
      const role = snap.data().role;

      //  All roles → same dashboard.
      navigate("/dashboard");

    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Login</h2>

        <input className="input-field" placeholder="Email"
          value={email} onChange={(e) => setEmail(e.target.value)} />

        <input type="password" className="input-field" placeholder="Password"
          value={password} onChange={(e) => setPassword(e.target.value)} />

        <button className="login-btn" onClick={handleLogin}>
          Login
        </button>

        <p className="login-link">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
