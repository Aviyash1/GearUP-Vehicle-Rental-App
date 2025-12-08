import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/CarOwnerDashboard.css";

import AddNewCar from "./AddNewCar";
import CarOwnerProfileModal from "./CarOwnerProfileModal";
import CarViewModal from "./CarViewModal";
import CarEditModal from "./CarEditModal";

import { fetchCarsByOwner, deleteCar } from "../firebase/carService";
import { fetchBookingsForOwner } from "../firebase/bookingService";

function CarOwnerDashboard() {
  const navigate = useNavigate();

  // ------------------------------
  // FIRESTORE SESSION USER (TOP LEVEL – SAFE)
  // ------------------------------
  const user = JSON.parse(localStorage.getItem("user"));
  const uid = user?.uid || null;

  // ------------------------------
  // HOOKS MUST BE HERE – ALWAYS
  // ------------------------------
  const [selectedCar, setSelectedCar] = useState(null);
  const [isViewOpen, setViewOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);

  const [activeSection, setActiveSection] = useState("overview");
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isAddCarModalOpen, setAddCarModalOpen] = useState(false);

  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [loadingCars, setLoadingCars] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // ------------------------------
  // IF NO USER: DO NOT RETURN EARLY
  // JUST RENDER A MESSAGE
  // ------------------------------
  const noUser = !user;

  // ------------------------------
  // VERIFICATION FLAG
  // ------------------------------
  const isVerified = user?.verified === true;

  // ------------------------------
  // LOAD CARS
  // ------------------------------
  useEffect(() => {
    if (!uid) return;

    async function loadCars() {
      setLoadingCars(true);
      const result = await fetchCarsByOwner(uid);
      setCars(result || []);
      setLoadingCars(false);
    }

    loadCars();
  }, [uid]);

  // ------------------------------
  // LOAD BOOKINGS
  // ------------------------------
  useEffect(() => {
    if (!uid) return;

    async function loadBookings() {
      setLoadingBookings(true);
      const result = await fetchBookingsForOwner(uid);
      setBookings(result || []);
      setLoadingBookings(false);
    }

    loadBookings();
  }, [uid, cars]);

  // ------------------------------
  // PENDING COUNT
  // ------------------------------
  const pendingCount = useMemo(
    () => cars.filter((c) => c.status === "Pending Admin Approval").length,
    [cars]
  );

  // ------------------------------
  // DELETE CAR
  // ------------------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this vehicle?")) return;

    await deleteCar(id);
    setCars((prev) => prev.filter((c) => c.id !== id));
  };

  // ------------------------------
  // CONDITIONAL RENDERING (NOT HOOKS)
  // ------------------------------

  if (noUser) {
    return (
      <div className="content-box">
        <h2>User session expired</h2>
        <button onClick={() => navigate("/login")}>Go to Login</button>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="content-box verify-box">
        <h2>Verification Required</h2>
        <p>You must complete verification before listing vehicles.</p>

        <button className="btn primary" onClick={() => setProfileModalOpen(true)}>
          Start Verification
        </button>

        <CarOwnerProfileModal
          open={isProfileModalOpen}
          onClose={() => setProfileModalOpen(false)}
        />
      </div>
    );
  }

  // ------------------------------
  // DASHBOARD UI
  // ------------------------------
  return (
    <div className="dashboard-container">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">GearUP</div>

        <ul>
          <li className={activeSection === "overview" ? "active" : ""} onClick={() => setActiveSection("overview")}>📊 Overview</li>
          <li className={activeSection === "cars" ? "active" : ""} onClick={() => setActiveSection("cars")}>🚗 My Cars</li>
          <li className={activeSection === "bookings" ? "active" : ""} onClick={() => setActiveSection("bookings")}>📘 Bookings</li>
          <li onClick={() => navigate("/settings")}>⚙️ Settings</li>
          <li onClick={() => setProfileModalOpen(true)}>👤 Profile</li>
          <li onClick={() => setAddCarModalOpen(true)}>➕ Add Car</li>
        </ul>

        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("user");
            navigate("/login");
          }}
        >
          Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main">
        {activeSection === "overview" && (
          <div className="content-box fade-in">
            <h2>Dashboard Overview</h2>

            <div className="overview-cards">
              <div className="overview-card">
                <h3>{cars.length}</h3>
                <p>Your Vehicles</p>
              </div>

              <div className="overview-card">
                <h3>{bookings.length}</h3>
                <p>Total Bookings</p>
              </div>

              <div className="overview-card">
                <h3>{pendingCount}</h3>
                <p>Pending Approvals</p>
              </div>
            </div>
          </div>
        )}

        {activeSection === "cars" && (
          <div className="content-box fade-in">
            <h2>Your Vehicles</h2>

            {loadingCars ? (
              <p>Loading cars...</p>
            ) : cars.length === 0 ? (
              <p>No cars added yet.</p>
            ) : (
              <div className="carowner-cars-list">
                {cars.map((car) => (
                  <div key={car.id} className="carowner-car-card">
                    <img src={car.imageUrl} alt={car.model} className="carowner-img" />

                    <div className="carowner-info">
                      <h3>{car.model}</h3>
                      <p>Status: {car.status}</p>
                    </div>

                    <div className="car-actions">
                      <button className="car-btn view" onClick={() => { setSelectedCar(car); setViewOpen(true); }}>View</button>
                      <button className="car-btn edit" onClick={() => { setSelectedCar(car); setEditOpen(true); }}>Edit</button>
                      <button className="car-btn delete" onClick={() => handleDelete(car.id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeSection === "bookings" && (
          <div className="content-box fade-in">
            <h2>Your Bookings</h2>

            {loadingBookings ? (
              <p>Loading...</p>
            ) : bookings.length === 0 ? (
              <p>No bookings yet.</p>
            ) : (
              <div className="bookings-list">
                {bookings.map((b) => (
                  <div key={b.id} className="booking-card">
                    <img src={b.carImage} className="booking-img" alt="" />

                    <div className="booking-info">
                      <h3>{b.carModel}</h3>
                      <p><b>From:</b> {b.pickupDate} {b.pickupTime}</p>
                      <p><b>To:</b> {b.returnDate} {b.returnTime}</p>
                      <p><b>Days:</b> {b.rentalDays}</p>
                      <p><b>You Earn:</b> ${b.ownerReceives}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* MODALS */}
      <CarOwnerProfileModal open={isProfileModalOpen} onClose={() => setProfileModalOpen(false)} />

      <AddNewCar 
        open={isAddCarModalOpen}
        onClose={() => setAddCarModalOpen(false)}
        onCarAdded={(updated) => setCars(updated)}
      />

      <CarViewModal open={isViewOpen} car={selectedCar} onClose={() => setViewOpen(false)} />

      <CarEditModal
        open={isEditOpen}
        car={selectedCar}
        onClose={() => setEditOpen(false)}
        onSaved={async () => {
          const updated = await fetchCarsByOwner(uid);
          setCars(updated);
        }}
      />
    </div>
  );
}

export default CarOwnerDashboard;
