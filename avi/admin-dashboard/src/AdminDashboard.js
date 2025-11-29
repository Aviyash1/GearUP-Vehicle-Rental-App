// AdminDashboard.js
// Complete Admin Dashboard for GearUP
// Includes Overview, Car Approvals, Payments (graph-only), Settings
// Uses Firestore (fetchAllBookings + fetchPendingVehicles)

import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";

// Firebase queries
import {
  fetchAllBookings,
  fetchPendingVehicles,
  approveVehicle,
  denyVehicle
} from "./firebase/adminQueries";

// Graph imports
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("overview");

  const [slidingItem, setSlidingItem] = useState(null);

  // FIREBASE STATE
  const [bookings, setBookings] = useState([]);
  const [carRequests, setCarRequests] = useState([]);

  // Load data once
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const bookingsData = await fetchAllBookings();
    const pendingCars = await fetchPendingVehicles();

    setBookings(bookingsData);
    setCarRequests(pendingCars);
  };

  // FOR CAR APPROVALS – Approve / Deny
  const handleVehicleDecision = async (id, decision) => {
    setSlidingItem(id);

    setTimeout(async () => {
      if (decision === "approve") {
        await approveVehicle(id);
      } else {
        await denyVehicle(id);
      }

      setCarRequests((prev) => prev.filter((c) => c.id !== id));
      setSlidingItem(null);
    }, 300);
  };

  // ---------------- PAYMENT GRAPH DATA ----------------
  const graphData = bookings.map((b, index) => ({
    label: b.vehicleName || `Booking ${index + 1}`,
    commission: Number(b.totalCost || 0) * 0.1, // 10% Commission
  }));

  const totalCommission = graphData.reduce(
    (sum, d) => sum + d.commission,
    0
  );

  // ---------------- SECTION RENDERING ----------------
  const renderSection = () => {
    // OVERVIEW
    if (activeSection === "overview") {
      return (
        <div className="admin-content-box fade-up">
          <h2 className="admin-heading">Administrator Control Center</h2>
          <p className="admin-subheading">System-level insight dashboard</p>
          <div className="admin-divider"></div>

          <div className="admin-cards-grid">
            <div className="admin-card">
              <h3>{carRequests.length}</h3>
              <p>Cars Pending Approval</p>
            </div>

            <div className="admin-card">
              <h3>{bookings.length}</h3>
              <p>Total Bookings</p>
            </div>

            <div className="admin-card">
              <h3>${totalCommission.toFixed(2)}</h3>
              <p>Total Commission Earned</p>
            </div>
          </div>
        </div>
      );
    }

    // CAR APPROVALS
    if (activeSection === "cars") {
      return (
        <div className="admin-content-box fade-up">
          <h2 className="admin-heading">Car Approval Requests</h2>
          <p className="admin-subheading">Review new car listings</p>
          <div className="admin-divider"></div>

          {carRequests.length === 0 && (
            <p>No pending car approvals.</p>
          )}

          {carRequests.map((car) => (
            <div
              key={car.id}
              className={`admin-item ${
                slidingItem === car.id ? "slide-out" : ""
              }`}
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

    // PAYMENTS → GRAPH ONLY
    if (activeSection === "payments") {
      return (
        <div className="admin-content-box fade-up">
          <h2 className="admin-heading">Payments Overview</h2>
          <p className="admin-subheading">
            Commission earnings across all user bookings
          </p>
          <div className="admin-divider"></div>

          {/* GRAPH */}
          <div style={{ height: "350px", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={graphData}>
                <CartesianGrid stroke="#333" strokeDasharray="3 3" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#c9c9c9", fontSize: 12 }}
                />
                <YAxis tick={{ fill: "#c9c9c9" }} />
                <Tooltip
                  contentStyle={{
                    background: "#1a1a1a",
                    border: "1px solid #444",
                  }}
                  labelStyle={{ color: "#fff" }}
                  itemStyle={{ color: "#D4AF37" }}
                />

                <Line
                  type="monotone"
                  dataKey="commission"
                  stroke="#D4AF37"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#D4AF37" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Total Commission */}
          <h3
            style={{
              marginTop: "30px",
              color: "var(--admin-primary)",
              fontSize: "1.3rem",
              fontWeight: "600",
            }}
          >
            Total Commission Earned: ${totalCommission.toFixed(2)}
          </h3>
        </div>
      );
    }

    // SETTINGS
    return (
      <div className="admin-content-box fade-up">
        <h2 className="admin-heading">Settings</h2>
        <p className="admin-subheading">Administrative configuration tools</p>
        <div className="admin-divider"></div>
        <p>Settings will be added later.</p>
      </div>
    );
  };

  // MAIN LAYOUT
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
