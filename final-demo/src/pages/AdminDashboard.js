// AdminDashboard.js 
// Central admin panel for handling verification, car approvals and payment checks.

import React, { useState, useEffect } from "react";
import "../styles/AdminDashboard.css";
import { useNavigate } from "react-router-dom";

// Firebase logic (unchanged)
import {
  fetchVerificationRequests,
  fetchCarRequests,
  fetchPaymentRequests,
  fetchAllBookings,
  pushAdminNotification,
  approveVehicle,
  denyVehicle,
  approveVerification,
  denyVerification
} from "../firebase/adminQueries";

function AdminDashboard() {
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("overview");
  const [slidingItem, setSlidingItem] = useState(null);

  // Data
  const [verificationRequests, setVerificationRequests] = useState([]);
  const [carRequests, setCarRequests] = useState([]);
  const [paymentRequests, setPaymentRequests] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [totalRevenue, setTotalRevenue] = useState(0);

  // Logout function (LOCAL STORAGE AUTH)
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login"); 
  };

  useEffect(() => {
    async function load() {
      const ver = await fetchVerificationRequests();
      const cars = await fetchCarRequests();
      const pays = await fetchPaymentRequests();
      const allBookings = await fetchAllBookings();

      setVerificationRequests(ver);
      setCarRequests(cars);
      setPaymentRequests(pays);
      setBookings(allBookings);

      const revenueTotal = allBookings.reduce(
        (sum, b) => sum + Number(b.totalPrice || 0),
        0
      );
      setTotalRevenue(revenueTotal);
    }

    load();
  }, []);

  // Animation handler
  const slideThen = async (callback) => {
    setSlidingItem(Math.random());
    setTimeout(async () => {
      await callback();
      setSlidingItem(null);
    }, 250);
  };

  /* Render Sections */
  const renderSection = () => {
    
    // ============= OVERVIEW =============
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
              <p>Car Approvals</p>
            </div>
            <div className="admin-card">
              <h3>${totalRevenue}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
        </div>
      );
    }

    // ============= VERIFICATION =============
    if (activeSection === "verification") {
      return (
        <div className="admin-content-box fade-up">
          <h2 className="admin-heading">Verification Requests</h2>
          <div className="admin-divider"></div>

          {verificationRequests.length === 0 && <p>No verification requests.</p>}

          {verificationRequests.map(req => (
            <div key={req.id} className="admin-item">
              <div>
                <strong>{req.fullName}</strong>
                <p>Email: {req.email}</p>
                <p>License Number: {req.licenseNumber}</p>
              </div>

              <div className="admin-actions">
                <button
                  className="approve-btn"
                  onClick={() =>
                    slideThen(async () => {
                      await approveVerification(req.id, req.userId);
                      setVerificationRequests(prev => prev.filter(x => x.id !== req.id));
                    })
                  }
                >
                  Approve
                </button>

                <button
                  className="deny-btn"
                  onClick={() =>
                    slideThen(async () => {
                      await denyVerification(req.id, req.userId);
                      setVerificationRequests(prev => prev.filter(x => x.id !== req.id));
                    })
                  }
                >
                  Deny
                </button>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // ============= CAR APPROVALS =============
    if (activeSection === "cars") {
      return (
        <div className="admin-content-box fade-up">
          <h2 className="admin-heading">Car Approval Requests</h2>
          <div className="admin-divider"></div>

          {carRequests.length === 0 && <p>No cars awaiting approval.</p>}

          {carRequests.map(car => (
            <div key={car.id} className="admin-item car-item">
              <img src={car.imageUrl} alt={car.model} className="admin-thumb" />

              <div className="car-details">
                <strong>{car.model}</strong>
                <p>Owner: {car.ownerId}</p>
                <p>Rent: ${car.rent}/day</p>
              </div>

              <div className="admin-actions">
                <button
                  className="approve-btn"
                  onClick={() =>
                    slideThen(async () => {
                      await approveVehicle(car.id, car.ownerId);
                      setCarRequests(prev => prev.filter(c => c.id !== car.id));
                    })
                  }
                >
                  Approve
                </button>

                <button
                  className="deny-btn"
                  onClick={() =>
                    slideThen(async () => {
                      await denyVehicle(car.id, car.ownerId);
                      setCarRequests(prev => prev.filter(c => c.id !== car.id));
                    })
                  }
                >
                  Deny
                </button>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // ============= PAYMENTS =============
    if (activeSection === "payments") {
      return (
        <div className="admin-content-box fade-up">
          <h2 className="admin-heading">Payments Overview</h2>
          <div className="admin-divider"></div>

          <p>
            Total Revenue: <strong>${totalRevenue.toFixed(2)}</strong>
          </p>

          <div className="payments-scroll-box">
            {bookings.map((b) => (
              <div key={b.id} className="admin-item">
                <div>
                  <strong>{b.carModel}</strong>
                  <p>User: {b.userId}</p>
                  <p>Total Paid: ${b.totalPrice}</p>
                  <p>Platform Fee: ${b.platformFee}</p>
                  <p>Pickup: {b.pickupDate}</p>
                  <p>Return: {b.returnDate}</p>
                </div>
              </div>
            ))}
          </div>
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

        {/* FIXED LOGOUT BUTTON */}
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
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
