// AdminDashboard.js
// This file defines the complete admin dashboard used in the GearUP project.
// The dashboard uses a minimal black and gold theme and provides admin-only
// tools for reviewing verification requests, car postings, and payment approvals.
// All data inside this file is temporary and will later be replaced by Firebase.

import React, { useState } from "react";
import "./AdminDashboard.css";
import Lexus from "./images/lexus.png";
import Porsche from "./images/porsche.png";

function AdminDashboard() {

  // Tracks which section of the admin dashboard is currently active.
  const [activeSection, setActiveSection] = useState("overview");

  // Tracks which item is currently sliding out during animation.
  const [slidingItem, setSlidingItem] = useState(null);

  // Dummy data for verification requests.
  const [verificationRequests, setVerificationRequests] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", license: "DLX1111" },
    { id: 2, name: "Sarah Lee", email: "sarah@example.com", license: "DLX2222" },
  ]);

  // Dummy data for car approval requests.
  const [carRequests, setCarRequests] = useState([
    {
      id: 1,
      model: "Lexus IS 350",
      owner: "John Doe",
      rent: "$140/day",
      image: Lexus
    },
    {
      id: 2,
      model: "Porsche 911 Carrera",
      owner: "Sarah Lee",
      rent: "$90/day",
      image: Porsche
    }
  ]);

  // Dummy data for payments that require admin approval.
  const [paymentRequests, setPaymentRequests] = useState([
    { id: 1, user: "Michael", amount: "$150", method: "Visa" },
    { id: 2, user: "Emma", amount: "$60", method: "Mastercard" },
  ]);

  // Handles approving or denying an item with a slide-out animation.
  const handleSlideOut = (type, id) => {

    // Marks the item as currently sliding out.
    setSlidingItem(id);

    // Removes the item after animation completes.
    setTimeout(() => {
      if (type === "verification") {
        setVerificationRequests(prev => prev.filter(req => req.id !== id));
      }
      if (type === "car") {
        setCarRequests(prev => prev.filter(car => car.id !== id));
      }
      if (type === "payment") {
        setPaymentRequests(prev => prev.filter(pay => pay.id !== id));
      }
      setSlidingItem(null);
    }, 300); // Matches the 300ms animation duration
  };

  // Renders content based on admin's selected section.
  const renderSection = () => {

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

    if (activeSection === "verification") {
      return (
        <div className="admin-content-box fade-up">
          <h2 className="admin-heading">Verification Requests</h2>
          <p className="admin-subheading">Review car owner identity documents</p>
          <div className="admin-divider"></div>

          {verificationRequests.length === 0 && <p>No pending verification requests.</p>}

          {verificationRequests.map((req) => (
            <div
              key={req.id}
              className={`admin-item ${slidingItem === req.id ? "slide-out" : ""}`}
            >
              <div>
                <strong>{req.name}</strong>
                <p>Email: {req.email}</p>
                <p>License: {req.license}</p>
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
              <img src={car.image} alt={car.model} className="admin-thumb" />

              <div>
                <strong>{car.model}</strong>
                <p>Owner: {car.owner}</p>
                <p>Rent: {car.rent}</p>
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

    if (activeSection === "payments") {
      return (
        <div className="admin-content-box fade-up">
          <h2 className="admin-heading">Payment Approvals</h2>
          <p className="admin-subheading">Authorize pending user payments</p>
          <div className="admin-divider"></div>

          {paymentRequests.length === 0 && <p>No pending payments.</p>}

          {paymentRequests.map((pay) => (
            <div
              key={pay.id}
              className={`admin-item ${slidingItem === pay.id ? "slide-out" : ""}`}
            >
              <div>
                <strong>User: {pay.user}</strong>
                <p>Amount: {pay.amount}</p>
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

    return (
      <div className="admin-content-box fade-up">
        <h2 className="admin-heading">Settings</h2>
        <p className="admin-subheading">General administrative configurations</p>
        <div className="admin-divider"></div>
        <p>Settings will be implemented later.</p>
      </div>
    );
  };

  // Main UI structure: sidebar + top header + content.
  return (
    <div className="admin-dashboard-container">

      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="admin-brand">GearUP Admin</div>

        <ul>
          <li className={activeSection === "overview" ? "active" : ""} onClick={() => setActiveSection("overview")}>Overview</li>
          <li className={activeSection === "verification" ? "active" : ""} onClick={() => setActiveSection("verification")}>Verification</li>
          <li className={activeSection === "cars" ? "active" : ""} onClick={() => setActiveSection("cars")}>Car Approvals</li>
          <li className={activeSection === "payments" ? "active" : ""} onClick={() => setActiveSection("payments")}>Payments</li>
          <li className={activeSection === "settings" ? "active" : ""} onClick={() => setActiveSection("settings")}>Settings</li>
        </ul>
      </aside>

      {/* Main Panel */}
      <main className="admin-main">
        {/* Top header bar */}
        <header className="admin-top-header">
          <h1>GearUP Administration</h1>
        </header>

        {renderSection()}
      </main>

    </div>
  );
}

export default AdminDashboard;
