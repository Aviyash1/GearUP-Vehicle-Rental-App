import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Dashboard.css";

import { fetchCars, deleteCarFromDatabase } from "./firebase/carService";
import { listenToNotifications } from "./firebase/notificationService";

import AddNewCar from "./AddNewCar";
import ProfileModal from "./Profile";

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeSection, setActiveSection] = useState("overview");
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isAddCarModalOpen, setAddCarModalOpen] = useState(false);
  const [isCarDetailOpen, setCarDetailOpen] = useState(false);

  const [selectedCar, setSelectedCar] = useState(null);
  const [lastBlobUrl, setLastBlobUrl] = useState(null);

  const [loadingCars, setLoadingCars] = useState(true);
  const [cars, setCars] = useState([]);

  const [notifications, setNotifications] = useState([]);

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

  // Disable scrolling for modals
  useEffect(() => {
    const lock = isProfileModalOpen || isAddCarModalOpen || isCarDetailOpen;
    document.body.style.overflow = lock ? "hidden" : "auto";
  }, [isProfileModalOpen, isAddCarModalOpen, isCarDetailOpen]);

  // Fetch cars
  useEffect(() => {
    const loadCars = async () => {
      try {
        const data = await fetchCars();
        setCars(data);
      } catch (err) {
        console.error("Error loading cars:", err);
      } finally {
        setLoadingCars(false);
      }
    };
    loadCars();
  }, []);

  // Real-time notifications
  useEffect(() => {
    const unsubscribe = listenToNotifications((data) => {
      const mapped = data.map((n) => ({
        id: n.id,
        title: n.title || "Notification",
        message: n.message || "",
        createdAt: n.createdAt || "",
        read: !!n.read,
      }));
      setNotifications(mapped);
    });

    return () => unsubscribe && unsubscribe();
  }, []);

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);

  const handleProfileChange = (e) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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

  const handleShowDetails = (car) => {
    setSelectedCar(car);
    setCarDetailOpen(true);
  };

  // ✅ DELETE HANDLER ADDED HERE
  const handleDeleteCar = async (id) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;

    try {
      await deleteCarFromDatabase(id);
      setCars((prev) => prev.filter((c) => c.id !== id));
      alert("Car deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete car");
    }
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

      {loadingCars ? (
        <p>Loading cars...</p>
      ) : cars.length === 0 ? (
        <p>No cars found.</p>
      ) : (
        <div className="car-grid">
          {cars.map((car) => (
            <div key={car.id} className="car-card">
              {car.image && <img src={car.image} alt={car.model} />}
              <h4>{car.model}</h4>
              <p>{car.year} • {car.type}</p>
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

              {/* ✅ DELETE BUTTON */}
              <button
                className="btn danger"
                onClick={() => handleDeleteCar(car.id)}
              >
                Delete
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
            <p><strong>Customer:</strong> {b.customer}</p>
            <p><strong>Dates:</strong> {b.startDate} to {b.endDate}</p>
            <span className={`badge ${b.status.toLowerCase()}`}>{b.status}</span>
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
      case "overview": return renderOverview();
      case "cars": return renderCars();
      case "bookings": return renderBookings();
      case "notifications": return renderNotifications();
      default: return <div className="content-box">Feature coming soon...</div>;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <div className="brand" onClick={toggleSidebar}>
          {isSidebarCollapsed ? "🚗" : "GearUP"}
        </div>

        <ul>
          <li onClick={() => setActiveSection("overview")} className={activeSection === "overview" ? "active" : ""}>📊 <span>Overview</span></li>
          <li onClick={() => setActiveSection("cars")} className={activeSection === "cars" ? "active" : ""}>🚗 <span>My Cars</span></li>
          <li onClick={() => setActiveSection("bookings")} className={activeSection === "bookings" ? "active" : ""}>📘 <span>Bookings</span></li>
          <li onClick={() => setActiveSection("notifications")} className={activeSection === "notifications" ? "active" : ""}>🔔 <span>Notifications</span></li>

          <li onClick={() => navigate("/documentation")}>📖 <span>Car Documentation</span></li>
          <li onClick={() => navigate("/settings")}>⚙️ <span>Settings</span></li>

          <li onClick={() => setProfileModalOpen(true)}>👤 <span>Profile</span></li>
          <li onClick={() => setAddCarModalOpen(true)}>➕ <span>Add Car</span></li>
        </ul>

        <button className="logout-btn" onClick={() => (window.location.href = "/login")}>
          🚪 Logout
        </button>
      </aside>

      <main className="main">{renderSection()}</main>

      {/* Profile Modal */}
      <ProfileModal
        open={isProfileModalOpen}
        profile={profile}
        onClose={() => setProfileModalOpen(false)}
        onChange={handleProfileChange}
        onImageUpload={handleProfileImageUpload}
        onSave={handleSaveProfile}
      />

      {/* Add New Car Modal */}
      <AddNewCar
        open={isAddCarModalOpen}
        onClose={() => setAddCarModalOpen(false)}
        onCarAdded={(updatedCars) => setCars(updatedCars)}
      />

      {/* Car Details */}
      {isCarDetailOpen && selectedCar && (
        <div className="modal-overlay" onClick={() => setCarDetailOpen(false)}>
          <div className="modal car-detail-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedCar.model}</h2>

            {selectedCar.image && (
              <img
                src={selectedCar.image}
                alt={selectedCar.model}
                className="detail-image"
              />
            )}

            <p className="car-description">{selectedCar.description}</p>

            <div className="info-grid">
              <div><strong>Type:</strong> {selectedCar.type}</div>
              <div><strong>Year:</strong> {selectedCar.year}</div>
              <div><strong>Mileage:</strong> {selectedCar.mileage} km</div>
              <div><strong>Engine:</strong> {selectedCar.engine}</div>
              <div><strong>Fuel:</strong> {selectedCar.fuel}</div>
              <div><strong>Transmission:</strong> {selectedCar.transmission}</div>
              <div><strong>Seats:</strong> {selectedCar.seats}</div>
              <div><strong>Color:</strong> {selectedCar.color}</div>
            </div>

            <div className="modal-actions">
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

export default Dashboard;
