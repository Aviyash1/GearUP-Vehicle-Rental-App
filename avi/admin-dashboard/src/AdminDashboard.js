// AdminDashboard.js
// Central admin panel for handling verification, car approvals and payment checks.

import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";

// Firebase logic
import {
  fetchVerificationRequests,
  fetchCarRequests,
  fetchPaymentRequests,
  pushAdminNotification,
  removeItem,
  approveVehicle,
  denyVehicle
} from "./firebase/adminQueries";

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const [slidingItem, setSlidingItem] = useState(null);

  // Data loaded from Firestore
  const [verificationRequests, setVerificationRequests] = useState([]);
  const [carRequests, setCarRequests] = useState([]);
  const [paymentRequests, setPaymentRequests] = useState([]);

  // Load all admin data once
  useEffect(() => {
    async function load() {
      setVerificationRequests(await fetchVerificationRequests());
      setCarRequests(await fetchCarRequests());
      setPaymentRequests(await fetchPaymentRequests());
    }
    load();
  }, []);

  /* When something is approved or denied, slide it out visually,
     then actually delete/update the collection and remove from state */
  const handleRemove = (type, id) => {
    setSlidingItem(id);

    setTimeout(async () => {
      if (type === "verification") {
        await removeItem("verificationRequests", id);
        setVerificationRequests(prev => prev.filter(x => x.id !== id));
      }

      if (type === "payment") {
        await removeItem("paymentRequests", id);
        setPaymentRequests(prev => prev.filter(x => x.id !== id));
      }

      setSlidingItem(null);
    }, 250);
  };

  /* Car approval logic:
     Update Firestore, send notif, then cleanly remove from UI */
  const handleCarDecision = async (id, ownerId, action) => {
    setSlidingItem(id);

    if (action === "approve") {
      await approveVehicle(id, ownerId);
    } else {
      await denyVehicle(id, ownerId);
    }

    // Remove from current list instantly
    setCarRequests(prev => prev.filter(c => c.id !== id));

    setTimeout(() => setSlidingItem(null), 250);
  };

  /* Renders a specific admin tab */
  const renderSection = () => {
    // ——————— OVERVIEW ———————
    if (activeSection === "overview") {
      return (
        <div className="admin-content-box fade-up">
          <h2 className="admin-heading">Administrator Control Center</h2>
          <p className="admin-subheading">Quick overview of pending tasks</p>
          <div className="admin-divider"></div>

          <div className="admin-cards-grid">
            <div className="admin-card">
              <h3>{verificationRequests.length}</h3>
              <p>Verification Requests</p>
            </div>
            <div className="admin-card">
              <h3>{carRequests.length}</h3>
              <p>Car Approvals Pending</p>
            </div>
            <div className="admin-card">
              <h3>{paymentRequests.length}</h3>
              <p>Payments Waiting</p>
            </div>
          </div>
        </div>
      );
    }

    // ——————— VERIFICATION ———————
    if (activeSection === "verification") {
      return (
        <div className="admin-content-box fade-up">
          <h2 className="admin-heading">Verification Requests</h2>
          <p className="admin-subheading">Check submitted identity documents</p>
          <div className="admin-divider"></div>

          {verificationRequests.map(req => (
            <div
              key={req.id}
              className={`admin-item ${slidingItem === req.id ? "slide-out" : ""}`}
            >
              <div>
                <strong>{req.name}</strong>
                <p>Email: {req.email}</p>
                <p>License: {req.licenseNumber}</p>
              </div>

              <div className="admin-actions">
                <button
                  className="approve-btn"
                  onClick={() => handleRemove("verification", req.id)}
                >
                  Approve
                </button>
                <button
                  className="deny-btn"
                  onClick={() => handleRemove("verification", req.id)}
                >
                  Deny
                </button>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // ——————— CAR APPROVALS ———————
    if (activeSection === "cars") {
      return (
        <div className="admin-content-box fade-up">
          <h2 className="admin-heading">Car Approval Requests</h2>
          <p className="admin-subheading">Review newly added vehicles</p>
          <div className="admin-divider"></div>

          {carRequests.length === 0 && <p>No cars awaiting approval.</p>}

          {carRequests.map(car => (
            <div
              key={car.id}
              className={`admin-item car-item ${slidingItem === car.id ? "slide-out" : ""}`}
            >
              <img
                src={car.imageUrl}
                alt={car.model}
                className="admin-thumb"
              />

              <div className="car-details">
                <strong>{car.model}</strong>
                <p>Owner ID: {car.ownerId}</p>
                <p>Rent: ${car.rent}/day</p>
              </div>

              <div className="admin-actions">
                <button
                  className="approve-btn"
                  onClick={() => handleCarDecision(car.id, car.ownerId, "approve")}
                >
                  Approve
                </button>

                <button
                  className="deny-btn"
                  onClick={() => handleCarDecision(car.id, car.ownerId, "deny")}
                >
                  Deny
                </button>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // ——————— PAYMENTS ———————
    if (activeSection === "payments") {
      return (
        <div className="admin-content-box fade-up">
          <h2 className="admin-heading">Pending Payments</h2>
          <div className="admin-divider"></div>

          {paymentRequests.map(pay => (
            <div
              key={pay.id}
              className={`admin-item ${slidingItem === pay.id ? "slide-out" : ""}`}
            >
              <div>
                <strong>User: {pay.user}</strong>
                <p>Total: ${pay.total}</p>
                <p>Method: {pay.method}</p>
              </div>

              <div className="admin-actions">
                <button
                  className="approve-btn"
                  onClick={() => handleRemove("payment", pay.id)}
                >
                  Approve
                </button>

                <button
                  className="deny-btn"
                  onClick={() => handleRemove("payment", pay.id)}
                >
                  Deny
                </button>
              </div>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="admin-dashboard-container">
      <aside className="admin-sidebar">
        <div className="admin-brand">GearUP Admin</div>

        <ul>
          <li className={activeSection === "overview" ? "active" : ""} onClick={() => setActiveSection("overview")}>Overview</li>
          <li className={activeSection === "verification" ? "active" : ""} onClick={() => setActiveSection("verification")}>Verification</li>
          <li className={activeSection === "cars" ? "active" : ""} onClick={() => setActiveSection("cars")}>Car Approvals</li>
          <li className={activeSection === "payments" ? "active" : ""} onClick={() => setActiveSection("payments")}>Payments</li>
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
