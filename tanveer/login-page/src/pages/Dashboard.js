import React from "react";
import "./Dashboard.css";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FaCar, FaUserCircle, FaClipboardList, FaBell } from "react-icons/fa";
import dashboardBanner from "../assets/Toyota Crown Klugar.jpg"; // ✅ Local image

export default function Dashboard() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div className="dashboard">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="logo">GearUp Rentals</div>
        <div className="user-section">
          <span className="user-email">{user?.email || "User"}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Welcome Banner */}
      <header className="welcome-banner">
        <div>
          <h1>Welcome back 👋</h1>
          <p>Manage your rentals, vehicles, and account all in one place.</p>
        </div>
        <img
          src={dashboardBanner}
          alt="Dashboard Banner"
          className="banner-img"
        />
      </header>

      {/* Dashboard Cards */}
      <section className="cards-section">
        <div className="card" onClick={() => navigate("/vehicles")}>
          <div className="icon"><FaCar /></div>
          <h3>Browse Vehicles</h3>
          <p>Explore available cars, bikes, and SUVs for your next trip.</p>
          <button className="primary-btn">Explore Now</button>
        </div>

        <div className="card" onClick={() => navigate("/my-bookings")}>
          <div className="icon"><FaClipboardList /></div>
          <h3>My Bookings</h3>
          <p>Check your active rentals and review past trips easily.</p>
          <button className="primary-btn">View Bookings</button>
        </div>

        <div className="card" onClick={() => navigate("/my-profile")}>
          <div className="icon"><FaUserCircle /></div>
          <h3>My Profile</h3>
          <p>Update personal information and manage preferences.</p>
          <button className="primary-btn">Edit Profile</button>
        </div>

        <div className="card" onClick={() => navigate("/notifications")}>
          <div className="icon"><FaBell /></div>
          <h3>Notifications</h3>
          <p>Stay informed with your latest booking updates.</p>
          <button className="primary-btn">Check Alerts</button>
        </div>
      </section>
    </div>
  );
}
