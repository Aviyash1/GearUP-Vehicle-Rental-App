import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Dashboard.css";

// Firebase services
import { fetchCars } from "./firebase/carService";
import { fetchBookings } from "./firebase/bookingService";

// Components
import AddNewCar from "./AddNewCar";
import ProfileModal from "./Profile";
import Bookings from "./Bookings";
import Documentation from "./Documentation";
import Settings from "./Settings";

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  /* =======================
        STATE
  ======================= */
  const [activeSection, setActiveSection] = useState("overview");

  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isAddCarModalOpen, setAddCarModalOpen] = useState(false);
  const [isCarDetailOpen, setCarDetailOpen] = useState(false);

  const [selectedCar, setSelectedCar] = useState(null);

  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [loadingCars, setLoadingCars] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);

  /* =======================
        FETCH CARS
  ======================= */
  useEffect(() => {
    async function loadCars() {
      setLoadingCars(true);
      try {
        const data = await fetchCars();
        setCars(data || []);
      } catch (err) {
        console.error("Failed to fetch cars:", err);
      }
      setLoadingCars(false);
    }

    loadCars();
  }, []);

  /* =======================
        FETCH BOOKINGS
  ======================= */
  useEffect(() => {
    if (loadingCars) return;

    async function loadBookings() {
      setLoadingBookings(true);
      try {
        const all = await fetchBookings();

        // Filter bookings that match this user's cars
        const filtered = all.filter((b) =>
          cars.some(
            (car) =>
              b.vehicleName === car.model &&
              car.imageUrl && car.imageUrl.trim() !== ""
          )
        );

        setBookings(filtered);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      }
      setLoadingBookings(false);
    }

    loadBookings();
  }, [cars, loadingCars]);

  /* =======================
        DISABLE SCROLL ON MODALS
  ======================= */
  useEffect(() => {
    const lock =
      isAddCarModalOpen || isCarDetailOpen || isProfileModalOpen;
    document.body.style.overflow = lock ? "hidden" : "auto";
  }, [isAddCarModalOpen, isCarDetailOpen, isProfileModalOpen]);

  /* =======================
        COUNTS
  ======================= */
  const pendingCount = useMemo(
    () =>
      cars.filter((c) =>
        c.status?.toLowerCase().includes("pending")
      ).length,
    [cars]
  );

  /* =======================
        HANDLERS
  ======================= */
  const handleShowDetails = (car) => {
    setSelectedCar(car);
    setCarDetailOpen(true);
  };

  /* =======================
        RENDER SECTIONS
  ======================= */
  const renderOverview = () => (
    <div className="content-box fade-in">
      <h2>Dashboard Overview</h2>

      <div className="overview-cards">
        <div className="overview-card">
          <h3>{cars.length}</h3>
          <p>Total Cars</p>
        </div>

        <div className="overview-card">
          <h3>{bookings.length}</h3>
          <p>Your Bookings</p>
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
      <h2>My Cars</h2>

      <div className="car-grid">
        {cars.length === 0 ? (
          <p>No cars added yet.</p>
        ) : (
          cars.map((car) => (
            <div key={car.id} className="car-card">
              <img src={car.imageUrl} alt={car.model} />

              <h4>{car.model}</h4>

              <p className="car-meta">
                <span>Year: {car.year}</span>
                <span>•</span>
                <span>{car.type}</span>
              </p>

              <p>Rent: {car.rent}</p>

              <span
                className={`badge ${
                  car.status?.toLowerCase().includes("pending")
                    ? "status-pending"
                    : car.status?.toLowerCase().includes("approved")
                    ? "status-approved"
                    : "status-available"
                }`}
              >
                {car.status}
              </span>

              <button
                className="btn primary"
                onClick={() => handleShowDetails(car)}
              >
                View Details
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="content-box fade-in">
      <h2>Notifications</h2>
      <p>No notifications yet.</p>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return renderOverview();

      case "cars":
        return renderCars();

      case "bookings":
        return (
          <Bookings
            cars={cars}
            bookings={bookings}
            loading={loadingBookings}
          />
        );

      case "notifications":
        return renderNotifications();

      default:
        return <div className="content-box">Feature coming soon...</div>;
    }
  };

  /* =======================
        MAIN RETURN
  ======================= */
  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">GearUP</div>

       <ul>
  <li
    className={activeSection === "overview" ? "active" : ""}
    onClick={() => setActiveSection("overview")}
  >
    📊 <span>Overview</span>
  </li>

  <li
    className={activeSection === "cars" ? "active" : ""}
    onClick={() => setActiveSection("cars")}
  >
    🚗 <span>My Cars</span>
  </li>

  <li
    className={activeSection === "bookings" ? "active" : ""}
    onClick={() => setActiveSection("bookings")}
  >
    📘 <span>Bookings</span>
  </li>

  <li
    className={activeSection === "notifications" ? "active" : ""}
    onClick={() => setActiveSection("notifications")}
  >
    🔔 <span>Notifications</span>
  </li>

  <li onClick={() => navigate("/documentation")}>
    📖 <span>Documentation</span>
  </li>

  <li onClick={() => navigate("/settings")}>
    ⚙️ <span>Settings</span>
  </li>

  <li onClick={() => setProfileModalOpen(true)}>
    👤 <span>Profile</span>
  </li>

  <li onClick={() => setAddCarModalOpen(true)}>
    ➕ <span>Add Car</span>
  </li>
</ul>


        <button className="logout-btn">🚪 Logout</button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main">{renderSection()}</main>

      {/* PROFILE MODAL */}
      <ProfileModal
        open={isProfileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />

      {/* ADD CAR MODAL */}
      <AddNewCar
        open={isAddCarModalOpen}
        onClose={() => setAddCarModalOpen(false)}
        onCarAdded={(updated) => setCars(updated)}
      />

      {/* CAR DETAIL MODAL */}
      {isCarDetailOpen && selectedCar && (
        <div
          className="modal-overlay"
          onClick={() => setCarDetailOpen(false)}
        >
          <div
            className="modal car-detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="car-detail-header">
              <h2>{selectedCar.model}</h2>

              <span
                className={`badge ${
                  selectedCar.status?.toLowerCase().includes("pending")
                    ? "status-pending"
                    : selectedCar.status?.toLowerCase().includes("approved")
                    ? "status-approved"
                    : "status-available"
                }`}
              >
                {selectedCar.status}
              </span>
            </div>

            <img
              className="detail-image"
              src={selectedCar.imageUrl}
              alt={selectedCar.model}
            />

            <p className="car-description">
              {selectedCar.description}
            </p>

            <div className="info-grid">
              {Object.entries(selectedCar).map(
                ([key, value]) =>
                  (typeof value === "string" ||
                    typeof value === "number") && (
                    <div className="car-info-item" key={key}>
                      <span className="car-info-label">
                        {key.toUpperCase()}
                      </span>
                      <span className="car-info-value">{value}</span>
                    </div>
                  )
              )}
            </div>

            <div className="modal-actions">
              <button className="btn secondary">✏️ Edit Car</button>
              <button
                className="btn cancel"
                onClick={() => setCarDetailOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
