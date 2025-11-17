import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isAddCarModalOpen, setAddCarModalOpen] = useState(false);
  const [isCarDetailOpen, setCarDetailOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [lastBlobUrl, setLastBlobUrl] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

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

  const [bookings, setBookings] = useState([
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
    { id: 1, message: "New booking request for Toyota Corolla", date: "2024-12-01", read: false },
    { id: 2, message: "Car approval pending for Tesla Model 3", date: "2024-12-02", read: false },
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

  useEffect(() => {
    document.body.style.overflow =
      isProfileModalOpen || isAddCarModalOpen || isCarDetailOpen
        ? "hidden"
        : "auto";
  }, [isProfileModalOpen, isAddCarModalOpen, isCarDetailOpen]);

  const toggleSidebar = () => setSidebarCollapsed(!isSidebarCollapsed);

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
    const missing = required.filter((f) => !String(newCar[f]).trim());
    if (missing.length) return `Missing fields: ${missing.join(", ")}`;
    if (!/^\d{4}$/.test(newCar.year)) return "Year must be 4 digits.";
    return null;
  };

  const handleAddCar = () => {
    const err = validateCar();
    if (err) {
      alert(err);
      return;
    }
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

  const pendingCount = useMemo(
    () => cars.filter((c) => c.status === "Pending Admin Approval").length,
    [cars]
  );

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="content-box fade-in">
            <h2>Dashboard Overview</h2>
            <div className="overview-cards">
              <div className="overview-card stat-glass">
                <h3>{cars.length}</h3>
                <p>Total Cars</p>
              </div>
              <div className="overview-card stat-glass">
                <h3>$2,450</h3>
                <p>Monthly Earnings</p>
              </div>
              <div className="overview-card stat-glass">
                <h3>{bookings.length}</h3>
                <p>Active Bookings</p>
              </div>
              <div className="overview-card stat-glass">
                <h3>{pendingCount}</h3>
                <p>Pending Approvals</p>
              </div>
            </div>
          </div>
        );
      case "cars":
        return (
          <div className="content-box fade-in">
            <h2>My Cars</h2>
            <div className="car-grid">
              {cars.map((car) => (
                <div className="car-card hover-lift" key={car.id}>
                  <img src={car.image} alt={car.model} />
                  <h4>{car.model}</h4>
                  <p>{car.year} • {car.type}</p>
                  <p>Rent: {car.rent}</p>
                  <span
                    className={
                      car.status === "Available"
                        ? "status-available badge"
                        : "status-pending badge"
                    }
                  >
                    {car.status}
                  </span>
                  <button
                    className="btn detail-btn"
                    onClick={() => handleShowDetails(car)}
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      case "bookings":
        return (
          <div className="content-box fade-in">
            <h2>My Bookings</h2>
            <div className="booking-grid">
              {bookings.map((b) => (
                <div key={b.id} className="booking-card hover-lift">
                  <h4>{cars.find((c) => c.id === b.carId)?.model}</h4>
                  <p><strong>Customer:</strong> {b.customer}</p>
                  <p><strong>Dates:</strong> {b.startDate} to {b.endDate}</p>
                  <span className={`badge ${b.status.toLowerCase()}`}>{b.status}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case "notifications":
        return (
          <div className="content-box fade-in">
            <h2>Notifications</h2>
            <ul className="notification-list">
              {notifications.map((n) => (
                <li key={n.id} className={`notification-item ${n.read ? "read" : "unread"}`}>
                  <p>{n.message}</p>
                  <small>{n.date}</small>
                  {!n.read && (
                    <button
                      className="btn"
                      onClick={() =>
                        setNotifications((prev) =>
                          prev.map((x) => (x.id === n.id ? { ...x, read: true } : x))
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
      default:
        return <div className="content-box">Feature coming soon...</div>;
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
          <li
            onClick={() => setActiveSection("overview")}
            className={activeSection === "overview" ? "active" : ""}
            data-label="Overview"
          >
            📊 <span>Overview</span>
          </li>
          <li
            onClick={() => setActiveSection("cars")}
            className={activeSection === "cars" ? "active" : ""}
            data-label="My Cars"
          >
            🚗 <span>My Cars</span>
          </li>
          <li
            onClick={() => setActiveSection("bookings")}
            className={activeSection === "bookings" ? "active" : ""}
            data-label="Bookings"
          >
            📘 <span>Bookings</span>
          </li>
          <li
            onClick={() => setActiveSection("notifications")}
            className={activeSection === "notifications" ? "active" : ""}
            data-label="Notifications"
          >
            🔔 <span>Notifications</span>
          </li>
          <li
            onClick={() => navigate("/documentation")}
            className={location.pathname === "/documentation" ? "active" : ""}
            data-label="Car Documentation"
          >
            📖 <span>Car Documentation</span>
          </li>
          <li
            onClick={() => navigate("/settings")}
            className={location.pathname === "/settings" ? "active" : ""}
            data-label="Settings"
          >
            ⚙️ <span>Settings</span>
          </li>
          <li onClick={() => setProfileModalOpen(true)} data-label="Profile">
            👤 <span>Profile</span>
          </li>
          <li onClick={() => setAddCarModalOpen(true)} data-label="Add Car">
            ➕ <span>Add Car</span>
          </li>
        </ul>
      </aside>

      {/* Main content */}
      <main className="main">{renderSection()}</main>

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <div className="modal-overlay" onClick={() => setProfileModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Profile</h2>
            <div className="profile-modal-grid">
              <div className="image-upload-section">
                <input type="file" accept="image/*" onChange={handleProfileImageUpload} />
                <img src={profile.profileImage} alt="Profile" className="preview-image" />
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
              <button className="btn cancel" onClick={() => setProfileModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Car Modal */}
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

      {/* Car Detail Modal */}
      {isCarDetailOpen && selectedCar && (
        <div className="modal-overlay" onClick={() => setCarDetailOpen(false)}>
          <div className="modal car-detail-modal fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="car-detail-header">
              <h2>{selectedCar.model}</h2>
              <span
                className={`badge ${
                  selectedCar.status === "Available" ? "status-available" : "status-pending"
                }`}
              >
                {selectedCar.status}
              </span>
            </div>

            <div className="car-detail-body">
              <img
                src={selectedCar.image}
                alt={selectedCar.model}
                className="detail-image"
              />

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
