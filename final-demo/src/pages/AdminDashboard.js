import React, { useState, useEffect } from "react";
import "../styles/AdminDashboard.css";

import {
  fetchVerificationRequests,
  fetchCarRequests,
  fetchPaymentRequests,
  approveVerification,
  denyVerification,
  approveVehicle,
  denyVehicle
} from "../firebase/adminQueries";

import { auth } from "../firebase/firebaseConfig";
import { signOut } from "firebase/auth";

// Converts Firestore timestamp or number → readable date
const formatDate = (ts) => {
  if (!ts) return "";
  if (ts.toDate) return ts.toDate().toLocaleDateString();
  if (typeof ts === "number") return new Date(ts).toLocaleDateString();
  return ts;
};

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("overview");

  const [verificationRequests, setVerificationRequests] = useState([]);
  const [carRequests, setCarRequests] = useState([]);
  const [paymentRequests, setPaymentRequests] = useState([]);

  useEffect(() => {
    async function loadAll() {
      setVerificationRequests(await fetchVerificationRequests());
      setCarRequests(await fetchCarRequests());
      setPaymentRequests(await fetchPaymentRequests());
    }
    loadAll();
  }, []);

  // CALCULATE TOTAL PLATFORM EARNINGS
  const totalEarnings = paymentRequests.reduce(
    (sum, p) => sum + (Number(p.platformFee) || 0),
    0
  );

  /* =======================================================
        SECTION RENDERERS
  ======================================================= */

  const renderOverview = () => (
    <div className="admin-box fade">
      <h2>Administrator Control Center</h2>

      <div className="admin-stats-grid">
        <div className="stat-card">
          <h3>{verificationRequests.length}</h3>
          <p>Verification Requests</p>
        </div>

        <div className="stat-card">
          <h3>{carRequests.length}</h3>
          <p>Pending Car Approvals</p>
        </div>

        <div className="stat-card">
          <h3>{paymentRequests.length}</h3>
          <p>Bookings</p>
        </div>
      </div>
    </div>
  );

  const renderVerification = () => (
    <div className="admin-box fade">
      <h2>Profile Verification Requests</h2>

      {verificationRequests.length === 0 && (
        <p>No pending verification requests.</p>
      )}

      {verificationRequests.map((req) => (
        <div className="admin-item" key={req.id}>
          <div>
            <h3>{req.fullName}</h3>
            <p><b>Email:</b> {req.email}</p>
            <p><b>Phone:</b> {req.phone}</p>
            <p><b>License:</b> {req.licenseNumber}</p>
          </div>

          <div className="admin-actions">
            <button
              className="approve-btn"
              onClick={async () => {
                await approveVerification(req.userId, req.id);
                setVerificationRequests((prev) =>
                  prev.filter((r) => r.id !== req.id)
                );
              }}
            >
              Approve
            </button>

            <button
              className="deny-btn"
              onClick={async () => {
                await denyVerification(req.id);
                setVerificationRequests((prev) =>
                  prev.filter((r) => r.id !== req.id)
                );
              }}
            >
              Deny
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCarApprovals = () => (
    <div className="admin-box fade">
      <h2>Car Approval Requests</h2>

      {carRequests.length === 0 && <p>No cars awaiting approval.</p>}

      {carRequests.map((car) => (
        <div className="admin-item" key={car.id}>
          <img src={car.imageUrl} alt={car.model} className="admin-thumb" />

          <div style={{ flex: 1 }}>
            <h3>{car.model}</h3>
            <p><b>Owner ID:</b> {car.ownerId}</p>
            <p><b>Rent:</b> ${car.rent}/day</p>
          </div>

          <div className="admin-actions">
            <button
              className="approve-btn"
              onClick={async () => {
                await approveVehicle(car.id, car.ownerId);
                setCarRequests((prev) =>
                  prev.filter((c) => c.id !== car.id)
                );
              }}
            >
              Approve
            </button>

            <button
              className="deny-btn"
              onClick={async () => {
                await denyVehicle(car.id, car.ownerId);
                setCarRequests((prev) =>
                  prev.filter((c) => c.id !== car.id)
                );
              }}
            >
              Deny
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderPayments = () => (
    <div className="admin-box fade">
      <h2>Financial Overview</h2>

      <div className="earnings-card">
        <h3>Total Platform Earnings</h3>
        <p className="earnings">${totalEarnings.toFixed(2)}</p>
      </div>

      <h3 style={{ marginTop: "20px" }}>All Bookings</h3>

      <table className="payments-table">
        <thead>
          <tr>
            <th>Car</th>
            <th>User</th>
            <th>Owner</th>
            <th>Total</th>
            <th>Platform Fee</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {paymentRequests.map((p) => (
            <tr key={p.id}>
              <td>{p.carModel}</td>
              <td>{p.userId}</td>
              <td>{p.ownerId}</td>
              <td>${Number(p.totalPrice || 0).toFixed(2)}</td>
              <td>${Number(p.platformFee || 0).toFixed(2)}</td>
              <td>{formatDate(p.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  /* =======================================================
        MAIN RETURN
  ======================================================= */
  return (
    <div className="admin-container">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <h2 className="admin-logo">GearUP Admin</h2>

        <ul>
          <li
            className={activeSection === "overview" ? "active" : ""}
            onClick={() => setActiveSection("overview")}
          >
            Overview
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
        </ul>

        <button
          className="logout-btn"
          onClick={() => {
            signOut(auth);
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main">
        <header className="admin-header">
          <h1>GearUP Administration</h1>
        </header>

        {activeSection === "overview" && renderOverview()}
        {activeSection === "verification" && renderVerification()}
        {activeSection === "cars" && renderCarApprovals()}
        {activeSection === "payments" && renderPayments()}
      </main>
    </div>
  );
}

export default AdminDashboard;
