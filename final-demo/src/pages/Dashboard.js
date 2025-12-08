// pages/Dashboard.js
import React from "react";
import "../styles/Dashboard.css";
import { useNavigate } from "react-router-dom";

import { FaCar, FaUserCircle, FaClipboardList, FaBell, FaHeart } from "react-icons/fa";
import dashboardBanner from "../images/Toyota Crown Klugar.jpg";

export default function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="logo">GearUp Rentals</div>
        <div className="user-section">
          <span className="user-email">{user?.email || "User"}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <header className="welcome-banner">
        <div>
          <h1>Welcome back 👋</h1>
          <p>Manage your rentals, vehicles, and account all in one place.</p>
        </div>
        <img src={dashboardBanner} alt="Dashboard Banner" className="banner-img" />
      </header>

      {/* Feature Cards */}
      <section className="cards-section">
        <div className="card" onClick={() => navigate("/searchpage")}>
          <div className="icon"><FaCar /></div>
          <h3>Browse Vehicles</h3>
          <p>Explore available cars for your next trip.</p>
          <button className="primary-btn">Explore Now</button>
        </div>

        <div className="card" onClick={() => navigate("/my-bookings")}>
          <div className="icon"><FaClipboardList /></div>
          <h3>My Bookings</h3>
          <p>View your current and past rentals.</p>
          <button className="primary-btn">View Bookings</button>
        </div>

        <div className="card" onClick={() => navigate("/my-profile")}>
          <div className="icon"><FaUserCircle /></div>
          <h3>My Profile</h3>
          <p>Edit personal information.</p>
          <button className="primary-btn">Edit Profile</button>
        </div>

        <div className="card" onClick={() => navigate("/favourites")}>
          <div className="icon"><FaHeart /></div>
          <h3>Favourites</h3>
          <p>Your saved vehicles.</p>
          <button className="primary-btn">View Favourites</button>
        </div>

        <div className="card" onClick={() => navigate("/user-notifications")}>
          <div className="icon"><FaBell /></div>
          <h3>Notifications</h3>
          <p>Your alerts and updates.</p>
          <button className="primary-btn">Check Alerts</button>
        </div>
      </section>
    </div>
  );
}
