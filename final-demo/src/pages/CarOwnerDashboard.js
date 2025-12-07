import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/CarOwnerDashboard.css";

import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

import AddNewCar from "./AddNewCar";
import CarOwnerProfileModal from "./CarOwnerProfileModal";

import CarViewModal from "./CarViewModal";      // ⭐ ADDED
import CarEditModal from "./CarEditModal";      // ⭐ ADDED

import { fetchCarsByOwner, deleteCar } from "../firebase/carService";
import { fetchBookingsForOwner } from "../firebase/bookingService";

function CarOwnerDashboard() {
  const navigate = useNavigate();

  // modal states
  const [selectedCar, setSelectedCar] = useState(null);
  const [isViewOpen, setViewOpen] = useState(false);  // ⭐ ADDED
  const [isEditOpen, setEditOpen] = useState(false);  // ⭐ ADDED

  const [activeSection, setActiveSection] = useState("overview");
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isAddCarModalOpen, setAddCarModalOpen] = useState(false);

  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [loadingCars, setLoadingCars] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingVerification, setLoadingVerification] = useState(true);

  const [isVerified, setIsVerified] = useState(false);

  /* -------------------------
      CHECK VERIFICATION
  --------------------------*/
  useEffect(() => {
    async function checkVerification() {
      const uid = auth.currentUser?.uid;

      if (!uid) {
        setLoadingVerification(false);
        return;
      }

      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists()) {
        setIsVerified(snap.data().verificationStatus === "Approved");
      }

      setLoadingVerification(false);
    }

    checkVerification();
  }, []);

  /* -------------------------
      LOAD CARS
  --------------------------*/
  useEffect(() => {
    async function loadCars() {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      setLoadingCars(true);
      const result = await fetchCarsByOwner(uid);
      setCars(result || []);
      setLoadingCars(false);
    }
    loadCars();
  }, []);

  /* -------------------------
      LOAD BOOKINGS
  --------------------------*/
  useEffect(() => {
    async function loadBookings() {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      setLoadingBookings(true);
      const result = await fetchBookingsForOwner(uid);
      setBookings(result || []);
      setLoadingBookings(false);
    }
    loadBookings();
  }, [cars]);

  const pendingCount = useMemo(
    () => cars.filter((c) => c.status === "Pending Admin Approval").length,
    [cars]
  );

  /* -------------------------
      DELETE CAR
  --------------------------*/
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this vehicle?")) return;

    await deleteCar(id);

    setCars((prev) => prev.filter((c) => c.id !== id));
  };

  /* -------------------------
      SECTION VIEWS
  --------------------------*/
  const renderOverview = () => (
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
  );

  const renderCars = () => (
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
                <p>
                  Status:{" "}
                  <span className={car.status === "Approved" ? "approved" : "pending"}>
                    {car.status}
                  </span>
                </p>
              </div>

              {/* -------------------------------------
                   ACTION BUTTONS (FIXED)
              --------------------------------------*/}
              <div className="car-actions">
                <button
                  className="car-btn view"
                  onClick={() => {
                    setSelectedCar(car);
                    setViewOpen(true);
                  }}
                >
                  View
                </button>

                <button
                  className="car-btn edit"
                  onClick={() => {
                    setSelectedCar(car);
                    setEditOpen(true);
                  }}
                >
                  Edit
                </button>

                <button
                  className="car-btn delete"
                  onClick={() => handleDelete(car.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderBookings = () => (
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
  );

  /* -------------------------
      RETURN LAYOUT
  --------------------------*/
  if (loadingVerification)
    return (
      <div className="content-box">
        <h3>Checking verification...</h3>
      </div>
    );

  if (!isVerified)
    return (
      <div className="content-box verify-box">
        <h2>Complete Your Profile</h2>
        <p>You must be verified before listing vehicles.</p>

        <button className="btn primary" onClick={() => setProfileModalOpen(true)}>
          Complete Verification
        </button>

        <CarOwnerProfileModal
          open={isProfileModalOpen}
          onClose={() => setProfileModalOpen(false)}
        />
      </div>
    );

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">GearUP</div>

        <ul>
          <li className={activeSection === "overview" ? "active" : ""} onClick={() => setActiveSection("overview")}>
            📊 Overview
          </li>

          <li className={activeSection === "cars" ? "active" : ""} onClick={() => setActiveSection("cars")}>
            🚗 My Cars
          </li>

          <li className={activeSection === "bookings" ? "active" : ""} onClick={() => setActiveSection("bookings")}>
            📘 Bookings
          </li>

          <li onClick={() => navigate("/settings")}>⚙️ Settings</li>
          <li onClick={() => setProfileModalOpen(true)}>👤 Profile</li>
          <li onClick={() => setAddCarModalOpen(true)}>➕ Add Car</li>
        </ul>

        <button className="logout-btn" onClick={() => navigate("/")}>Logout</button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main">
        {activeSection === "overview" && renderOverview()}
        {activeSection === "cars" && renderCars()}
        {activeSection === "bookings" && renderBookings()}
      </main>

      {/* PROFILE MODAL */}
      <CarOwnerProfileModal open={isProfileModalOpen} onClose={() => setProfileModalOpen(false)} />

      {/* ADD CAR MODAL */}
      <AddNewCar 
        open={isAddCarModalOpen}
        onClose={() => setAddCarModalOpen(false)}
        onCarAdded={(updated) => setCars(updated)}
      />

      {/* VIEW MODAL  */}
      <CarViewModal
        open={isViewOpen}
        car={selectedCar}
        onClose={() => setViewOpen(false)}
      />

      {/* {/* EDIT MODAL } */}
      <CarEditModal
        open={isEditOpen}
        car={selectedCar}
        onClose={() => setEditOpen(false)}
        onSaved={async () => {
          const uid = auth.currentUser?.uid;
          const updated = await fetchCarsByOwner(uid);
          setCars(updated);
        }}
      />
    </div>
  );
}

export default CarOwnerDashboard;
