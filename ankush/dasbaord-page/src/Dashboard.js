import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Dashboard.css";

// Firebase services (you must have these in src/firebase/)
import {
  fetchCars,
  uploadCarImage,
  addCarToDatabase,
} from "./firebase/carService";
import { listenToNotifications } from "./firebase/notificationService";

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeSection, setActiveSection] = useState("overview");
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isAddCarModalOpen, setAddCarModalOpen] = useState(false);
  const [isCarDetailOpen, setCarDetailOpen] = useState(false);

  const [selectedCar, setSelectedCar] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [lastBlobUrl, setLastBlobUrl] = useState(null);

  const [loadingCars, setLoadingCars] = useState(true);
  const [imageFile, setImageFile] = useState(null);

  const [profile, setProfile] = useState({
    name: "Tanveer Singh",
    email: "TS@gmail.com",
    phone: "+64 9876543210",
    address: "350 Queen Street",
    city: "Auckland",
    country: "New Zealand",
    license: "EF56////7890",
    bank: "Bank of New Zealand",
    account: "****5678",
    profileImage: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  });

  // Cars now driven from Firestore instead of hardcoded
  const [cars, setCars] = useState([]);

  // Bookings still local for now (your college side can handle DB for this later)
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

  // Notifications now fetched from Firestore in real-time
  const [notifications, setNotifications] = useState([]);

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
  });

  // Lock scroll when modals are open
  useEffect(() => {
    const lock = isProfileModalOpen || isAddCarModalOpen || isCarDetailOpen;
    document.body.style.overflow = lock ? "hidden" : "auto";
  }, [isProfileModalOpen, isAddCarModalOpen, isCarDetailOpen]);

  // Fetch cars from Firestore on mount
  useEffect(() => {
    const loadCars = async () => {
      try {
        const data = await fetchCars();
        setCars(data);
      } catch (err) {
        console.error("Failed to load cars from Firestore:", err);
      } finally {
        setLoadingCars(false);
      }
    };

    loadCars();
  }, []);

  // Listen to notifications in real time from Firestore
  useEffect(() => {
    const unsubscribe = listenToNotifications((data) => {
      const mapped = data.map((n) => ({
        id: n.id,
        message: n.message || "Notification",
        date: n.date || "",
        read: !!n.read,
      }));
      setNotifications(mapped);
    });

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    if (lastBlobUrl) URL.revokeObjectURL(lastBlobUrl);

    setLastBlobUrl(url);
    setProfile((prev) => ({ ...prev, profileImage: url }));
  };

  const handleSaveProfile = () => {
    alert("Profile updated successfully!");
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
    setImageFile(file);
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
    ];
    const missing = required.filter((key) => !String(newCar[key]).trim());

    if (missing.length) return `Missing fields: ${missing.join(", ")}`;
    if (!/^\d{4}$/.test(newCar.year)) return "Year must be 4 digits.";

    return null;
  };

  const handleAddCar = async () => {
    const err = validateCar();
    if (err) return alert(err);

    if (!imageFile) {
      return alert("Please select an image for the car.");
    }

    try {
      // Upload image to Firebase Storage
      const imageUrl = await uploadCarImage(imageFile);

      // Save car data to Firestore
      await addCarToDatabase({
        ...newCar,
        image: imageUrl,
        status: "Pending Admin Approval",
        createdAt: Date.now(),
      });

      // Refresh car list from Firestore
      const updatedCars = await fetchCars();
      setCars(updatedCars);

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
      });
      setPreviewImage(null);
      setImageFile(null);

      alert("Car submitted for admin approval.");
    } catch (error) {
      console.error("Error adding car:", error);
      alert("Failed to add car. Please try again.");
    }
  };

  const handleShowDetails = (car) => {
    setSelectedCar(car);
    setCarDetailOpen(true);
  };

  const pendingCount = useMemo(
    () => cars.filter((c) => c.status === "Pending Admin Approval").length,
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

        <div classNameoverview-card="">
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

      {loadingCars ? (
        <p>Loading cars...</p>
      ) : cars.length === 0 ? (
        <p>No cars found. Add a car to get started.</p>
      ) : (
        <div className="car-grid">
          {cars.map((car) => (
            <div key={car.id} className="car-card">
              {car.image && <img src={car.image} alt={car.model} />}

              <h4>{car.model}</h4>
              <p>
                {car.year} • {car.type}
              </p>
              <p>Rent: {car.rent}</p>

              <span
                className={`badge ${
                  car.status === "Available"
                    ? "status-available"
                    : "status-pending"
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
          ))}
        </div>
      )}
    </div>
  );

  const renderBookings = () => (
    <div className="content-box fade-in">
      <h2>My Bookings</h2>

      <div className="booking-grid">
        {bookings.map((b) => (
          <div key={b.id} className="booking-card">
            <h4>{cars.find((c) => c.id === b.carId)?.model || "Car"}</h4>

            <p>
              <strong>Customer:</strong> {b.customer}
            </p>
            <p>
              <strong>Dates:</strong> {b.startDate} to {b.endDate}
            </p>

            <span className={`badge ${b.status.toLowerCase()}`}>
              {b.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="content-box fade-in">
      <h2>Notifications</h2>

      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <ul className="notification-list">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`notification-item ${n.read ? "read" : "unread"}`}
            >
            <h4>{n.title}</h4>
<p>{n.message}</p>
<small>{n.createdAt}</small>

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
      )}
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

        {/* ✅ LOGOUT BUTTON – left EXACTLY as you had it */}
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
        <div
          className="modal-overlay"
          onClick={() => setProfileModalOpen(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Profile</h2>

            <div className="profile-modal-grid">
              <div className="image-upload-section">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageUpload}
                />

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
        <div
          className="modal-overlay"
          onClick={() => setAddCarModalOpen(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Car</h2>

            <div className="add-car-grid">
              {Object.keys(newCar).map((key) =>
                key !== "description" ? (
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
              <button
                className="btn cancel"
                onClick={() => setAddCarModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CAR DETAIL MODAL */}
      {isCarDetailOpen && selectedCar && (
        <div
          className="modal-overlay"
          onClick={() => setCarDetailOpen(false)}
        >
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

            <div className="car-detail-body">
              {selectedCar.image && (
                <img
                  src={selectedCar.image}
                  alt={selectedCar.model}
                  className="detail-image"
                />
              )}

              <p className="car-description">{selectedCar.description}</p>

              <div className="info-grid">
                <div>
                  <strong>Type:</strong> {selectedCar.type}
                </div>
                <div>
                  <strong>Year:</strong> {selectedCar.year}
                </div>
                <div>
                  <strong>Mileage:</strong> {selectedCar.mileage} km
                </div>
                <div>
                  <strong>Engine:</strong> {selectedCar.engine}
                </div>
                <div>
                  <strong>Fuel:</strong> {selectedCar.fuel}
                </div>
                <div>
                  <strong>Transmission:</strong> {selectedCar.transmission}
                </div>
                <div>
                  <strong>Seats:</strong> {selectedCar.seats}
                </div>
                <div>
                  <strong>Color:</strong> {selectedCar.color}
                </div>
              </div>

              <div className="rent-highlight">
                <h3>{selectedCar.rent}</h3>
                <p>per day</p>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="btn secondary"
                onClick={() => alert("Edit feature coming soon!")}
              >
                ✏️ Edit Car
              </button>

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
