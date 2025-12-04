import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

import { fetchCars, deleteCarFromDatabase } from "./firebase/carService";
import { listenToNotifications } from "./firebase/notificationService";

import AddNewCar from "./AddNewCar";
import ProfileModal from "./Profile";

function Dashboard() {
  const navigate = useNavigate();

  // UI State
  const [activeSection, setActiveSection] = useState("overview");
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Modal State
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isAddCarModalOpen, setAddCarModalOpen] = useState(false);
  const [isCarDetailOpen, setCarDetailOpen] = useState(false);

  // Data State
  const [cars, setCars] = useState([]);
  const [loadingCars, setLoadingCars] = useState(true);

  const [notifications, setNotifications] = useState([]);

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

  const [selectedCar, setSelectedCar] = useState(null);

  // Disable scroll on modal open
  useEffect(() => {
    const lock =
      isProfileModalOpen || isAddCarModalOpen || isCarDetailOpen;
    document.body.style.overflow = lock ? "hidden" : "auto";
  }, [
    isProfileModalOpen,
    isAddCarModalOpen,
    isCarDetailOpen,
  ]);

  // Load Cars (Firebase)
  useEffect(() => {
    const loadCars = async () => {
      try {
        const data = await fetchCars();
        setCars(data || []);
      } catch (err) {
        console.error("Error loading cars:", err);
      } finally {
        setLoadingCars(false);
      }
    };
    loadCars();
  }, []);

  // Load Notifications (Realtime)
  useEffect(() => {
    const unsubscribe = listenToNotifications((data) => {
      const mapped = data.map((n) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        createdAt: n.createdAt,
        read: n.read,
      }));
      setNotifications(mapped);
    });

    return () => unsubscribe && unsubscribe();
  }, []);

  // Sidebar collapse toggle
  const toggleSidebar = () =>
    setSidebarCollapsed((prev) => !prev);

  // Profile update handler
  const handleProfileChange = (e) => {
    setProfile((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleProfileImageUpload = (file) => {
    const url = URL.createObjectURL(file);
    setProfile((prev) => ({ ...prev, profileImage: url }));
  };

  const handleSaveProfile = () => {
    setProfileModalOpen(false);
  };

  // Car Detail Modal
  const openCarDetail = (car) => {
    setSelectedCar(car);
    setCarDetailOpen(true);
  };

  // Delete Car
  const handleDeleteCar = async (id) => {
    if (!window.confirm("Delete this car?")) return;

    try {
      await deleteCarFromDatabase(id);
      setCars((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Count pending approvals
  const pendingCount = useMemo(
    () => cars.filter((c) => c.status?.includes("Pending")).length,
    [cars]
  );

  // ------------------------
  // UI SECTIONS
  // ------------------------

  const sectionList = {
    overview: (
      <div className="content-box fade-in">
        <h2>Dashboard Overview</h2>

        <div className="overview-cards">
          <div className="overview-card">
            <h3>{cars.length}</h3>
            <p>Total Cars</p>
          </div>

          <div className="overview-card">
            <h3>{pendingCount}</h3>
            <p>Pending Approvals</p>
          </div>
        </div>
      </div>
    ),

    cars: (
      <div className="content-box fade-in">
        <h2>My Cars</h2>

        {loadingCars ? (
          <p>Loading cars...</p>
        ) : cars.length === 0 ? (
          <p>No cars found.</p>
        ) : (
          <div className="car-grid">
            {cars.map((car) => (
              <div key={car.id} className="car-card">
                <img
                  src={
                    car.image ||
                    car.imageURL ||
                    car.imageUrl ||
                    "/placeholder-car.png" /* fallback asset */
                  }
                  alt={car.model}
                />

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
                  onClick={() => openCarDetail(car)}
                >
                  View Details
                </button>

                <button
                  className="btn cancel"
                  onClick={() => handleDeleteCar(car.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    ),

    notifications: (
      <div className="content-box fade-in">
        <h2>Notifications</h2>

        {notifications.length === 0 ? (
          <p>No notifications.</p>
        ) : (
          <ul className="notification-list">
            {notifications.map((n) => (
              <li
                key={n.id}
                className={`notification-item ${
                  n.read ? "read" : "unread"
                }`}
              >
                <h4>{n.title}</h4>
                <p>{n.message}</p>
                <small>{n.createdAt}</small>

                {!n.read && (
                  <button
                    className="btn primary"
                    onClick={() =>
                      setNotifications((prev) =>
                        prev.map((i) =>
                          i.id === n.id
                            ? { ...i, read: true }
                            : i
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
    ),
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <div className="brand" onClick={toggleSidebar}>
          {isSidebarCollapsed ? "🚗" : "GearUP"}
        </div>

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
            className={activeSection === "notifications" ? "active" : ""}
            onClick={() => setActiveSection("notifications")}
          >
            🔔 <span>Notifications</span>
          </li>

          <li onClick={() => setProfileModalOpen(true)}>👤 <span>Profile</span></li>
          <li onClick={() => setAddCarModalOpen(true)}>➕ <span>Add Car</span></li>
        </ul>

        <button
          className="logout-btn"
          onClick={() => navigate("/login")}
        >
          🚪 <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="main">{sectionList[activeSection]}</main>

      {/* Profile Modal */}
      <ProfileModal
        open={isProfileModalOpen}
        profile={profile}
        onClose={() => setProfileModalOpen(false)}
        onChange={handleProfileChange}
        onImageUpload={handleProfileImageUpload}
        onSave={handleSaveProfile}
      />

      {/* Add Car Modal */}
      <AddNewCar
        open={isAddCarModalOpen}
        onClose={() => setAddCarModalOpen(false)}
        onCarAdded={(updatedCars) => setCars(updatedCars)}
      />

      {/* Car Details Modal */}
      {isCarDetailOpen && selectedCar && (
        <div
          className="modal-overlay"
          onClick={() => setCarDetailOpen(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedCar.model}</h2>

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

            <p className="car-description">
              {selectedCar.description}
            </p>

            <div className="info-grid">
              {Object.entries(selectedCar).map(([key, value]) =>
                typeof value === "string" ||
                typeof value === "number" ? (
                  <div key={key}>
                    <strong>{key}:</strong> {value}
                  </div>
                ) : null
              )}
            </div>

            <div className="modal-actions">
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
