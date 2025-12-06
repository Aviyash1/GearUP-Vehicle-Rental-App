// Main Dashboard component for the application
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Dashboard.css";

// Import Firebase services for data operations
import { fetchCars, deleteCarFromDatabase } from "./firebase/carService";
import { fetchBookings } from "./firebase/bookingService";
import { listenToNotifications } from "./firebase/notificationService";

// Import components used inside the dashboard
import AddNewCar from "./AddNewCar";
import ProfileModal from "./Profile";
import Bookings from "./Bookings";
import Documentation from "./Documentation";
import Settings from "./Settings";

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeSection, setActiveSection] = useState("overview");

  // Controls whether the sidebar is collapsed or expanded
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isAddCarModalOpen, setAddCarModalOpen] = useState(false);
  const [isCarDetailOpen, setCarDetailOpen] = useState(false);
  // Loading state for profile
  const [loadingProfile, setLoadingProfile] = useState(false);


  const [selectedCar, setSelectedCar] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [lastBlobUrl, setLastBlobUrl] = useState(null);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    license: "",
    bank: "",
    account: "",
    profileImage: "",
  });

  const [cars, setCars] = useState([
    {
      id: 1,
      model: "Toyota Corolla",
      type: "Sedan",
      year: "2023",
      mileage: "2000",
      engine: "1800cc",
      color: "Silver",
      seats: "5",
      fuel: "Petrol",
      transmission: "Automatic",
      rent: "$40/day",
      status: "Available",
      image:
        "https://cdn.motor1.com/images/mgl/02k1v/s1/2023-toyota-corolla-sedan-front-view.jpg",
      description: "Comfortable daily car with great mileage.",
    },
    {
      id: 2,
      model: "Tesla Model 3",
      type: "Electric",
      year: "2024",
      mileage: "20",
      engine: "Electric Motor",
      color: "Red",
      seats: "5",
      fuel: "Electric",
      transmission: "Automatic",
      rent: "$90/day",
      status: "Pending Admin Approval",
      image:
        "https://www.motortrend.com/uploads/sites/5/2023/09/2024-tesla-model-3-european-version-1.jpg",
      description: "Fully electric car with autopilot and advanced tech.",
    },
  ]);

  const [bookings] = useState([
    {
      id: 101,
      carId: 1,
      customer: "John Doe",
      startDate: "2024-12-10",
      endDate: "2024-12-12",
      status: "Active",
    },
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "New booking request for Toyota Corolla",
      date: "2024-12-01",
      read: false,
    },
    {
      id: 2,
      message: "Car approval pending for Tesla Model 3",
      date: "2024-12-02",
      read: false,
    },
  ]);

  const [newCar, setNewCar] = useState({
    model: "",
    type: "",
    year: "",
    mileage: "",
    engine: "",
    color: "",
    seats: "",
    fuel: "",
    transmission: "",
    rent: "",
    description: "",
    image: "",
  });

  // Disable scrolling when any modal is open
  useEffect(() => {
    const lock = isProfileModalOpen || isAddCarModalOpen || isCarDetailOpen;
    document.body.style.overflow = lock ? "hidden" : "auto";
  }, [isProfileModalOpen, isAddCarModalOpen, isCarDetailOpen]);

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);

  // Update profile state when input changes
  const handleProfileChange = (e) => {
    setProfile((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleProfileImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    if (lastBlobUrl) URL.revokeObjectURL(lastBlobUrl);

    setLastBlobUrl(url);
    setProfile((prev) => ({ ...prev, profileImage: url }));
  };

  // Save profile and close modal
  const handleSaveProfile = () => {
    setProfileModalOpen(false);
  };

  const handleNewCarChange = (e) => {
    const { name, value } = e.target;
    setNewCar((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    if (lastBlobUrl) URL.revokeObjectURL(lastBlobUrl);

    setLastBlobUrl(url);
    setPreviewImage(url);
    setNewCar((prev) => ({ ...prev, image: url }));
  };

  const validateCar = () => {
    const required = [
      "model",
      "type",
      "year",
      "mileage",
      "engine",
      "color",
      "seats",
      "fuel",
      "transmission",
      "rent",
      "image",
    ];
    const missing = required.filter((key) => !String(newCar[key]).trim());

    if (missing.length) return `Missing fields: ${missing.join(", ")}`;
    if (!/^\d{4}$/.test(newCar.year)) return "Year must be 4 digits.";

    return null;
  };

  const handleAddCar = () => {
    const err = validateCar();
    if (err) return alert(err);

    setCars((prev) => [
      ...prev,
      { id: Date.now(), ...newCar, status: "Pending Admin Approval" },
    ]);

    setAddCarModalOpen(false);
    setNewCar({
      model: "",
      type: "",
      year: "",
      mileage: "",
      engine: "",
      color: "",
      seats: "",
      fuel: "",
      transmission: "",
      rent: "",
      description: "",
      image: "",
    });
    setPreviewImage(null);

    alert("Car submitted for admin approval.");
  };

  const handleShowDetails = (car) => {
    setSelectedCar(car);
    setCarDetailOpen(true);
  };

  // Count number of cars waiting for approval
  const pendingCount = useMemo(
    () => cars.filter((c) => c.status?.includes("Pending")).length,
    [cars]
  );

  const renderOverview = () => (
    <div className="content-box fade-in">
      <h2>Dashboard Overview</h2>

      <div className="overview-cards">
        <div className="overview-card">
          <h3>{cars.length}</h3>
          <p>Total Cars</p>
        </div>

        <div className="overview-card">
          <h3>$2,450</h3>
          <p>Monthly Earnings</p>
        </div>

        <div className="overview-card">
          <h3>{bookings.length}</h3>
          <p>Active Bookings</p>
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
        {cars.map((car) => (
          <div key={car.id} className="car-card">
            <img src={car.image} alt={car.model} />

            <h4>{car.model}</h4>
            <p>
              {car.year} • {car.type}
            </p>
            <p>Rent: {car.rent}</p>

            <span
              className={`badge ${
                car.status === "Available" ? "status-available" : "status-pending"
              }`}
            >
              {car.status}
            </span>

            <button className="btn primary" onClick={() => handleShowDetails(car)}>
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="content-box fade-in">
      <h2>My Bookings</h2>

      <div className="booking-grid">
        {bookings.map((b) => (
          <div key={b.id} className="booking-card">
            <h4>{cars.find((c) => c.id === b.carId)?.model}</h4>

            <p>
              <strong>Customer:</strong> {b.customer}
            </p>
            <p>
              <strong>Dates:</strong> {b.startDate} to {b.endDate}
            </p>

            <span className={`badge ${b.status.toLowerCase()}`}>{b.status}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="content-box fade-in">
      <h2>Notifications</h2>

      <ul className="notification-list">
        {notifications.map((n) => (
          <li
            key={n.id}
            className={`notification-item ${n.read ? "read" : "unread"}`}
          >
            <p>{n.message}</p>
            <small>{n.date}</small>

            {!n.read && (
              <button
                className="btn primary"
                onClick={() =>
                  setNotifications((prev) =>
                    prev.map((x) =>
                      x.id === n.id ? { ...x, read: true } : x
                    )
                  )
                }
              >
                Mark as Read
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return renderOverview();
      case "cars":
        return renderCars();
      case "bookings":
        return renderBookings();
      case "notifications":
        return renderNotifications();
      default:
        return <div className="content-box">Feature coming soon...</div>;
    }
  };

  return (
    <div className="dashboard-container">
      <aside className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        
        {/* Sidebar brand and toggle */}
        <div className="brand" onClick={toggleSidebar}>
          {isSidebarCollapsed ? "🚗" : "GearUP"}
        </div>

        <ul>
          <li
            onClick={() => setActiveSection("overview")}
            className={activeSection === "overview" ? "active" : ""}
          >
            📊 <span>Overview</span>
          </li>

          <li
            onClick={() => setActiveSection("cars")}
            className={activeSection === "cars" ? "active" : ""}
          >
            🚗 <span>My Cars</span>
          </li>

          <li
            onClick={() => setActiveSection("bookings")}
            className={activeSection === "bookings" ? "active" : ""}
          >
            📘 <span>Bookings</span>
          </li>

          <li
            onClick={() => setActiveSection("notifications")}
            className={activeSection === "notifications" ? "active" : ""}
          >
            🔔 <span>Notifications</span>
          </li>

          <li
            onClick={() => navigate("/documentation")}
            className={location.pathname === "/documentation" ? "active" : ""}
          >
            📖 <span>Car Documentation</span>
          </li>

          <li
            onClick={() => navigate("/settings")}
            className={location.pathname === "/settings" ? "active" : ""}
          >
            ⚙️ <span>Settings</span>
          </li>

          <li onClick={() => setProfileModalOpen(true)}>
            👤 <span>Profile</span>
          </li>

          <li onClick={() => setAddCarModalOpen(true)}>
            ➕ <span>Add Car</span>
          </li>
        </ul>

        {/* ✅ LOGOUT BUTTON */}
        <button
          className="logout-btn"
          onClick={() => {
            try {
              fetch("/login", { method: "HEAD" })
                .then((res) => {
                  if (res.ok) {
                    window.location.href = "/login";
                  } else {
                    alert("Logout button has not been fully implemented yet");
                  }
                })
                .catch(() => {
                  alert("Logout button has not been fully implemented yet");
                });
            } catch (err) {
              alert("Logout button has not been fully implemented yet");
            }
          }}
        >
          🚪 Logout
        </button>
      </aside>

      <main className="main">{renderSection()}</main>

      {/* PROFILE MODAL */}
      {isProfileModalOpen && (
        <div className="modal-overlay" onClick={() => setProfileModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Profile</h2>

            <div className="profile-modal-grid">
              <div className="image-upload-section">
                <input type="file" accept="image/*" onChange={handleProfileImageUpload} />

                <img
                  src={profile.profileImage}
                  alt="Profile"
                  className="preview-image"
                />
              </div>

              {Object.keys(profile).map((key) =>
                key !== "profileImage" ? (
                  <input
                    key={key}
                    name={key}
                    value={profile[key]}
                    onChange={handleProfileChange}
                    placeholder={key}
                  />
                ) : null
              )}
            </div>

            <div className="modal-actions">
              <button className="btn primary" onClick={handleSaveProfile}>
                Save
              </button>
              <button
                className="btn cancel"
                onClick={() => setProfileModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD CAR MODAL */}
      {isAddCarModalOpen && (
        <div className="modal-overlay" onClick={() => setAddCarModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Car</h2>

            <div className="add-car-grid">
              {Object.keys(newCar).map((key) =>
                key !== "image" && key !== "description" ? (
                  <input
                    key={key}
                    name={key}
                    value={newCar[key]}
                    onChange={handleNewCarChange}
                    placeholder={key}
                  />
                ) : null
              )}

              <textarea
                name="description"
                value={newCar.description}
                onChange={handleNewCarChange}
                placeholder="Description"
              />
            </div>

            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {previewImage && (
              <img src={previewImage} alt="Preview" className="preview-image" />
            )}

            <div className="modal-actions">
              <button className="btn primary" onClick={handleAddCar}>
                Submit
              </button>
              <button className="btn cancel" onClick={() => setAddCarModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CAR DETAIL MODAL */}
      {isCarDetailOpen && selectedCar && (
        <div className="modal-overlay" onClick={() => setCarDetailOpen(false)}>
          <div
            className="modal car-detail-modal fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="car-detail-header">
              <h2>{selectedCar.model}</h2>

              <span
                className={`badge ${
                  selectedCar.status === "Available"
                    ? "status-available"
                    : "status-pending"
                }`}
              >
                {selectedCar.status}
              </span>
            </div>

            {/* Car image */}
            <img
              className="detail-image"
              src={
                selectedCar.image ||
                selectedCar.imageURL ||
                selectedCar.imageUrl ||
                "/placeholder-car.png"
              }
              alt={selectedCar.model}
            />

            {/* Car description */}
            <p className="car-description">{selectedCar.description}</p>

            {/* Car details in grid format */}
            <div className="info-grid">
              {Object.entries(selectedCar).map(([key, value]) =>
                typeof value === "string" || typeof value === "number" ? (
                  <div key={key}>
                    <strong>{key}:</strong> {value}
                  </div>
                ) : null
              )}
            </div>

            {/* Close modal */}
            <div className="modal-actions">
              <button className="btn secondary" onClick={() => alert("Edit feature coming soon!")}>
                ✏️ Edit Car
              </button>

              <button className="btn cancel" onClick={() => setCarDetailOpen(false)}>
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

// Export the Dashboard component
export default Dashboard;
