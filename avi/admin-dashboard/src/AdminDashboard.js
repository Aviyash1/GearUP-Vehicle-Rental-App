// AdminDashboard.js
// Minimal system version (Option B).
// Fully working Car Approvals. Other tabs show placeholders.

import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";

// Car approval Firestore queries
import {
  fetchPendingVehicles,
  approveVehicle,
  denyVehicle
} from "./firebase/adminQueries";

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const [slidingItem, setSlidingItem] = useState(null);

  // State for only the car approval feature
  const [carRequests, setCarRequests] = useState([]);

  // Everything else must exist to prevent errors
  const [notifications] = useState([]);
  const [verificationRequests] = useState([]);
  const [paymentRequests] = useState([]);

  // Load Firestore cars on start
  useEffect(() => {
    const loadCars = async () => {
      const cars = await fetchPendingVehicles();
      setCarRequests(cars);
    };
    loadCars();
  }, []);

  // Handles approval / denial with animation
  const handleVehicleDecision = async (vehicleId, decision) => {
    setSlidingItem(vehicleId);

    setTimeout(async () => {
      if (decision === "approve") {
        await approveVehicle(vehicleId);
      } else {
        await denyVehicle(vehicleId);
      }

      setCarRequests((prev) => prev.filter((c) => c.id !== vehicleId));
      setSlidingItem(null);
    }, 300);
  };

  // Page renderer
  const renderSection = () => {
    // ------------------ OVERVIEW ------------------
    if (activeSection === "overview") {
      return (
        <div className="admin-content-box fade-up">
          <h2 className="admin-heading">Administrator Control Center</h2>
          <p className="admin-subheading">System Authority Dashboard</p>
          <div className="admin-divider"></div>

          <div className="admin-cards-grid">
            <div className="admin-card">
              <h3>-</h3>
              <p>Verification Requests</p>
            </div>

            <div className="admin-card">
              <h3>{carRequests.length}</h3>
              <p>Car Approvals Pending</p>
            </div>

            <div className="admin-card">
              <h3>-</h3>
              <p>Payments Waiting</p>
            </div>
          </div>
        </div>
      );
    }

    // ------------------ NOTIFICATIONS ------------------
    if (activeSection === "notifications") {
      return (
        <div className="admin-content-box fade-up">
          <h2 className="admin-heading">Notifications</h2>
          <p className="admin-subheading">Feature not available yet.</p>
          <div className="admin-divider"></div>
        </div>
      );
    }

    // ------------------ VERIFICATION ------------------
    if (activeSection === "verification") {
      return (
        <div className="admin-content-box fade-up">
          <h2 className="admin-heading">Verification Requests</h2>
          <p className="admin-subheading">
            This feature will be implemented after merge.
          </p>
          <div className="admin-divider"></div>
        </div>
      );
    }

    // ------------------ CAR APPROVALS (WORKING FEATURE) ------------------
    if (activeSection === "cars") {
      return (
        <div className="admin-content-box fade-up">
          <h2 className="admin-heading">Car Approval Requests</h2>
          <p className="admin-subheading">Review new car listings</p>
          <div className="admin-divider"></div>

          {carRequests.length === 0 && <p>No pending car approvals.</p>}

          {carRequests.map((car) => (
            <div
              key={car.id}
              className={`admin-item ${slidingItem === car.id ? "slide-out" : ""}`}
            >
              <div>
                <strong>{car.model}</strong>
                <p>Year: {car.year}</p>
                <p>Fuel: {car.fuel}</p>
                <p>Seats: {car.seats}</p>
                <p>Transmission: {car.transmission}</p>
                <p>Rent: ${car.rent}/day</p>
                <p>Mileage: {car.mileage} km</p>
                <p style={{ color: "#c9c9c9" }}>Status: {car.status}</p>
              </div>

              <div className="admin-actions">
                <button
                  className="approve-btn"
                  onClick={() => handleVehicleDecision(car.id, "approve")}
                >
                  Approve
                </button>

                <button
                  className="deny-btn"
                  onClick={() => handleVehicleDecision(car.id, "deny")}
                >
                  Deny
                </button>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // ------------------ PAYMENTS ------------------
    if (activeSection === "payments") {
      return (
        <div className="admin-content-box fade-up">
          <h2 className="admin-heading">Payments</h2>
          <p className="admin-subheading">Feature not available yet.</p>
          <div className="admin-divider"></div>
        </div>
      );
    }

    // ------------------ SETTINGS ------------------
    return (
      <div className="admin-content-box fade-up">
        <h2 className="admin-heading">Settings</h2>
        <p className="admin-subheading">General administrative configurations</p>
        <div className="admin-divider"></div>
      </div>
    );
  };

  return (
    <div className="admin-dashboard-container">
      <aside className="admin-sidebar">
        <div className="admin-brand">GearUP Admin</div>

        <ul>
          <li
            className={activeSection === "overview" ? "active" : ""}
            onClick={() => setActiveSection("overview")}
          >
            Overview
          </li>

          <li
            className={activeSection === "notifications" ? "active" : ""}
            onClick={() => setActiveSection("notifications")}
          >
            Notifications
          </li>

          <li
            className={activeSection === "verification" ? "active" : ""}
            onClick={() => setActiveSection("verification")}
          >
            Verification
          </li>

          <li
            className={activeSection === "cars" ? "active" : ""}
            onClick={() => setActiveSection("cars")}
          >
            Car Approvals
          </li>

          <li
            className={activeSection === "payments" ? "active" : ""}
            onClick={() => setActiveSection("payments")}
          >
            Payments
          </li>

          <li
            className={activeSection === "settings" ? "active" : ""}
            onClick={() => setActiveSection("settings")}
          >
            Settings
          </li>
        </ul>
      </aside>

      <main className="admin-main">
        <header className="admin-top-header">
          <h1>GearUP Administration</h1>
        </header>

        {renderSection()}
      </main>
    </div>
  );
}

export default AdminDashboard;
