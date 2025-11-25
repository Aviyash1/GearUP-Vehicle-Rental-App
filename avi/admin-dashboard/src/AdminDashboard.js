// AdminDashboard.js
// This file defines the complete admin dashboard used in the GearUP project.
// The dashboard uses a minimal black and gold theme and provides admin-only
// tools for reviewing verification requests, car postings, and payment approvals.
// All data inside this file is temporary and will later be replaced by Firebase.

import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";
import Lexus from "./images/lexus.png";
import Porsche from "./images/porsche.png";

function AdminDashboard() {

  const [activeSection, setActiveSection] = useState("overview");
  const [slidingItem, setSlidingItem] = useState(null);

  const [notifications, setNotifications] = useState([]);

  const [verificationRequests, setVerificationRequests] = useState([]);
  const [carRequests, setCarRequests] = useState([]);
  const [paymentRequests, setPaymentRequests] = useState([]);

  const addNotification = (msg, type) => {
    const newNote = {
      id: Date.now(),
      message: msg,
      type: type,
      time: "Just now"
    };
    setNotifications(prev => [newNote, ...prev]);
  };

  const handleSlideOut = (type, id) => {
    setSlidingItem(id);

    setTimeout(() => {
      if (type === "verification") {
        setVerificationRequests(prev => prev.filter(req => req.id !== id));
        addNotification("Verification request reviewed", "verification");
      }
      if (type === "car") {
        setCarRequests(prev => prev.filter(car => car.id !== id));
        addNotification("Car listing reviewed", "car");
      }
      if (type === "payment") {
        setPaymentRequests(prev => prev.filter(pay => pay.id !== id));
        addNotification("Payment processed", "payment");
      }
      setSlidingItem(null);
    }, 300);
  };

  const placeholderListenForCarRequests = () => {
    const incoming = [
      { id: 1, model: "Lexus IS 350", owner: "John Doe", rent: "$140/day", image: Lexus },
      { id: 2, model: "Porsche 911 Carrera", owner: "Sarah Lee", rent: "$90/day", image: Porsche }
    ];
    setCarRequests(incoming);
    incoming.forEach(() =>
      addNotification("New car added for approval", "car")
    );
  };

  const placeholderListenForVerificationRequests = () => {
    const incoming = [
      { id: 1, name: "John Doe", email: "john@example.com", license: "DLX1111" },
      { id: 2, name: "Sarah Lee", email: "sarah@example.com", license: "DLX2222" }
    ];
    setVerificationRequests(incoming);
    incoming.forEach(() =>
      addNotification("New verification request submitted", "verification")
    );
  };

  const placeholderListenForPayments = () => {
    const incoming = [
      { id: 1, user: "Michael", amount: "$150", method: "Visa" },
      { id: 2, user: "Emma", amount: "$60", method: "Mastercard" },
    ];
    setPaymentRequests(incoming);
    incoming.forEach(() =>
      addNotification("New payment awaiting approval", "payment")
    );
  };

  useEffect(() => {
    placeholderListenForCarRequests();
    placeholderListenForVerificationRequests();
    placeholderListenForPayments();
  }, []);

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

    if (activeSection === "notifications") {
      return (
        <div className="admin-content-box fade-up">
          <h2 className="admin-heading">Notifications</h2>
          <p className="admin-subheading">System Alerts & New Events</p>
          <div className="admin-divider"></div>

          {notifications.length === 0 && <p>No notifications available.</p>}

          {notifications.map(note => (
            <div key={note.id} className="admin-notification-item fade-up">
              <div>
                <strong>{note.message}</strong>
                <p style={{ color: "#bbbbbb", marginTop: 4 }}>{note.time}</p>
              </div>
            </div>
          ))}
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
