// AdminDashboard.js
// Admin panel for reviewing verification requests, car approvals & payments.
// Fully Firebase-connected backbone.

import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";

// Firebase Backbone
import {
  fetchVerificationRequests,
  fetchCarRequests,
  fetchPaymentRequests,
  pushAdminNotification,
  removeItem
} from "../firebase/adminQueries";

// Sample Images (can be removed when using real data)
import Lexus from "./images/lexus.png";
import Porsche from "./images/porsche.png";

function AdminDashboard() {

  const [activeSection, setActiveSection] = useState("overview");
  const [slidingItem, setSlidingItem] = useState(null);

  // Firebase collections
  const [notifications, setNotifications] = useState([]);
  const [verificationRequests, setVerificationRequests] = useState([]);
  const [carRequests, setCarRequests] = useState([]);
  const [paymentRequests, setPaymentRequests] = useState([]);

  // Load Firebase Data
  useEffect(() => {
    async function loadData() {
      setVerificationRequests(await fetchVerificationRequests());
      setCarRequests(await fetchCarRequests());
      setPaymentRequests(await fetchPaymentRequests());
    }

    async function loadNotifications() {
      const snap = await fetch("adminNotifications");
    }

    loadData();
  }, []);

  // Slide-out + Firebase delete + notification
  const handleSlideOut = (type, id) => {
    setSlidingItem(id);

    setTimeout(async () => {

      if (type === "verification") {
        await removeItem("verificationRequests", id);
        pushAdminNotification("Verification request reviewed", "verification");
        setVerificationRequests(prev => prev.filter(r => r.id !== id));
      }

      if (type === "car") {
        await removeItem("carApprovalRequests", id);
        pushAdminNotification("Car listing reviewed", "car");
        setCarRequests(prev => prev.filter(c => c.id !== id));
      }

      if (type === "payment") {
        await removeItem("payments", id);
        pushAdminNotification("Payment processed — commission added", "payment");
        setPaymentRequests(prev => prev.filter(p => p.id !== id));
      }

      setSlidingItem(null);
    }, 300);
  };

  // Render Section
  const renderSection = () => {

    // OVERVIEW
    if (activeSection === "overview") {
      return (
        <div className="admin-content-box fade-up">
          <h2 className="admin-heading">Administrator Control Center</h2>
          <p className="admin-subheading">System Authority Dashboard</p>
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

    // NOTIFICATIONS 
    if (activeSection === "notifications") {
      return (
        <div className="admin-content-box fade-up">
          <h2 className="admin-heading">Notifications</h2>
          <p className="admin-subheading">System Alerts & New Events</p>
          <div className="admin-divider"></div>

          {notifications.length === 0 && <p>No notifications available.</p>}

          {notifications.map(note => (
            <div key={note.id} className="admin-notification-item fade-up">
              <strong>{note.message}</strong>
              <p style={{ color: "#bbb", marginTop: 4 }}>{note.createdAt}</p>
            </div>
          ))}
        </div>
      );
    }

    // VERIFICATION 
    if (activeSection === "verification") {
      return (
        <div className="admin-content-box fade-up">
          <h2 className="admin-heading">Verification Requests</h2>
          <p className="admin-subheading">Review car owner identity documents</p>
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
                  onClick={() => handleSlideOut("verification", req.id)}
                >
                  Approve
                </button>

                <button
                  className="deny-btn"
                  onClick={() => handleSlideOut("verification", req.id)}
                >
                  Deny
                </button>
              </div>
            </div>
          ))}
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

          {carRequests.map(car => (
            <div
              key={car.id}
              className={`admin-item ${slidingItem === car.id ? "slide-out" : ""}`}
            >
              <img src={car.imageUrl || Lexus} alt={car.model} className="admin-thumb" />

              <div>
                <strong>{car.model}</strong>
                <p>Owner: {car.owner}</p>
                <p>Rent: ${car.rent}/day</p>
              </div>

              <div className="admin-actions">
                <button
                  className="approve-btn"
                  onClick={() => handleSlideOut("car", car.id)}
                >
                  Approve
                </button>
                <button
                  className="deny-btn"
                  onClick={() => handleSlideOut("car", car.id)}
                >
                  Deny
                </button>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // PAYMENTS ==========================================================
    if (activeSection === "payments") {
      return (
        <div className="admin-content-box fade-up">
          <h2 className="admin-heading">Payment Approvals</h2>
          <p className="admin-subheading">Authorize pending user payments</p>
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
                  onClick={() => handleSlideOut("payment", pay.id)}
                >
                  Approve
                </button>

                <button
                  className="deny-btn"
                  onClick={() => handleSlideOut("payment", pay.id)}
                >
                  Deny
                </button>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // SETTINGS ==========================================================
    return (
      <div className="admin-content-box fade-up">
        <h2 className="admin-heading">Settings</h2>
        <p className="admin-subheading">General administrative configurations</p>
        <div className="admin-divider"></div>
        <p>Settings will be implemented later.</p>
      </div>
    );
  };

  return (
    <div className="admin-dashboard-container">
      <aside className="admin-sidebar">
        <div className="admin-brand">GearUP Admin</div>

        <ul>
          <li className={activeSection === "overview" ? "active" : ""} onClick={() => setActiveSection("overview")}>Overview</li>

          <li className={activeSection === "notifications" ? "active" : ""} onClick={() => setActiveSection("notifications")}>
            Notifications {notifications.length > 0 && <span className="notif-badge"></span>}
          </li>

          <li className={activeSection === "verification" ? "active" : ""} onClick={() => setActiveSection("verification")}>Verification</li>

          <li className={activeSection === "cars" ? "active" : ""} onClick={() => setActiveSection("cars")}>Car Approvals</li>

          <li className={activeSection === "payments" ? "active" : ""} onClick={() => setActiveSection("payments")}>Payments</li>

          <li className={activeSection === "settings" ? "active" : ""} onClick={() => setActiveSection("settings")}>Settings</li>
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
