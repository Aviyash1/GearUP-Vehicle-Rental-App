// Main Dashboard component for the application
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate(); // Used to navigate to other routes

  // Track which section of the dashboard is currently active
  const [activeSection, setActiveSection] = useState("overview");

  // Controls whether the sidebar is collapsed or expanded
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  // State for modal visibility
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isAddCarModalOpen, setAddCarModalOpen] = useState(false);
  const [isCarDetailOpen, setCarDetailOpen] = useState(false);

  // Car data and loading state
  const [cars, setCars] = useState([]);
  const [loadingCars, setLoadingCars] = useState(true);

  // Booking data and loading state
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Notification data
  const [notifications, setNotifications] = useState([]);

  // Local profile information stored in component state
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

  // Stores the currently selected car for details modal
  const [selectedCar, setSelectedCar] = useState(null);

  // Disable scrolling when any modal is open
  useEffect(() => {
    const lock = isProfileModalOpen || isAddCarModalOpen || isCarDetailOpen;
    document.body.style.overflow = lock ? "hidden" : "auto";
  }, [isProfileModalOpen, isAddCarModalOpen, isCarDetailOpen]);

  // Fetch list of cars from Firebase when component loads
  useEffect(() => {
    const loadCars = async () => {
      try {
        const data = await fetchCars(); // Fetch cars from database
        setCars(data || []);
      } catch (err) {
        console.error("Error loading cars:", err);
      } finally {
        setLoadingCars(false); // Stop loading indicator
      }
    };
    loadCars();
  }, []);

  // Fetch list of bookings from Firebase when component loads
  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await fetchBookings();
        setBookings(data || []);
      } catch (err) {
        console.error("Error loading bookings:", err);
      } finally {
        setLoadingBookings(false);
      }
    };
    loadBookings();
  }, []);

  // Listen to notifications in real time from Firebase
  useEffect(() => {
    const unsubscribe = listenToNotifications((data) => {
      // Map raw data into structured format
      const mapped = data.map((n) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        createdAt: n.createdAt,
        read: n.read,
      }));
      setNotifications(mapped);
    });

    // Cleanup function to stop listening
    return () => unsubscribe && unsubscribe();
  }, []);

  // Toggle sidebar collapse or expand
  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);

  // Update profile state when input changes
  const handleProfileChange = (e) => {
    setProfile((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Update profile image preview
  const handleProfileImageUpload = (file) => {
    const url = URL.createObjectURL(file); // Create temporary preview URL
    setProfile((prev) => ({ ...prev, profileImage: url }));
  };

  // Save profile and close modal
  const handleSaveProfile = () => {
    setProfileModalOpen(false);
  };

  // Open car details modal with selected car
  const openCarDetail = (car) => {
    setSelectedCar(car);
    setCarDetailOpen(true);
  };

  // Delete car from Firebase and remove it from UI list
  const handleDeleteCar = async (id) => {
    if (!window.confirm("Delete this car?")) return;

    try {
      await deleteCarFromDatabase(id); // Delete from Firebase
      setCars((prev) => prev.filter((c) => c.id !== id)); // Update UI list
    } catch (err) {
      console.error(err);
    }
  };

  // Count number of cars waiting for approval
  const pendingCount = useMemo(
    () => cars.filter((c) => c.status?.includes("Pending")).length,
    [cars]
  );

  // All dashboard sections defined here
  const sectionList = {
    overview: (
      <div className="content-box fade-in">
        <h2>Dashboard Overview</h2>

        <div className="overview-cards">
          {/* Show total number of cars */}
          <div className="overview-card">
            <h3>{cars.length}</h3>
            <p>Total Cars</p>
          </div>

          {/* Show number of pending cars */}
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

        {/* Display based on loading or empty state */}
        {loadingCars ? (
          <p>Loading cars...</p>
        ) : cars.length === 0 ? (
          <p>No cars found.</p>
        ) : (
          <div className="car-grid">
            {/* Loop through each car and show a card */}
            {cars.map((car) => (
              <div key={car.id} className="car-card">
                
                {/* Car image with fallbacks */}
                <img
                  src={
                    car.image ||
                    car.imageURL ||
                    car.imageUrl ||
                    "/placeholder-car.png"
                  }
                  alt={car.model}
                />

                <h4>{car.model}</h4>
                <p>{car.year} • {car.type}</p>
                <p>Rent: {car.rent}</p>

                {/* Status badge */}
                <span
                  className={`badge ${
                    car.status === "Available"
                      ? "status-available"
                      : "status-pending"
                  }`}
                >
                  {car.status}
                </span>

                {/* Open details modal */}
                <button className="btn primary" onClick={() => openCarDetail(car)}>
                  View Details
                </button>

                {/* Delete car */}
                <button className="btn cancel" onClick={() => handleDeleteCar(car.id)}>
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

        {/* Show no notifications message */}
        {notifications.length === 0 ? (
          <p>No notifications.</p>
        ) : (
          <ul className="notification-list">
            {/* Loop through notifications */}
            {notifications.map((n) => (
              <li
                key={n.id}
                className={`notification-item ${n.read ? "read" : "unread"}`}
              >
                <h4>{n.title}</h4>
                <p>{n.message}</p>
                <small>{n.createdAt}</small>

                {/* Mark notification as read */}
                {!n.read && (
                  <button
                    className="btn primary"
                    onClick={() =>
                      setNotifications((prev) =>
                        prev.map((i) =>
                          i.id === n.id ? { ...i, read: true } : i
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

    // Bookings section (currently passed empty bookings array)
    bookings: <Bookings bookings={[]} cars={cars} />,

    documentation: <Documentation />,
    settings: <Settings />,
  };

  return (
    <div className="dashboard-container">

      {/* Sidebar container */}
      <aside className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        
        {/* Sidebar brand and toggle */}
        <div className="brand" onClick={toggleSidebar}>
          {isSidebarCollapsed ? "🚗" : "GearUP"}
        </div>

        {/* Sidebar menu items */}
        <ul>
          <li className={activeSection === "overview" ? "active" : ""} onClick={() => setActiveSection("overview")}>
            📊 <span>Overview</span>
          </li>

          <li className={activeSection === "cars" ? "active" : ""} onClick={() => setActiveSection("cars")}>
            🚗 <span>My Cars</span>
          </li>

          <li className={activeSection === "bookings" ? "active" : ""} onClick={() => setActiveSection("bookings")}>
            📅 <span>Bookings</span>
          </li>

          <li className={activeSection === "documentation" ? "active" : ""} onClick={() => setActiveSection("documentation")}>
            📄 <span>Documentation</span>
          </li>

          <li className={activeSection === "notifications" ? "active" : ""} onClick={() => setActiveSection("notifications")}>
            🔔 <span>Notifications</span>
          </li>

          <li className={activeSection === "settings" ? "active" : ""} onClick={() => setActiveSection("settings")}>
            ⚙️ <span>Settings</span>
          </li>

          {/* Open profile modal */}
          <li onClick={() => setProfileModalOpen(true)}>
            👤 <span>Profile</span>
          </li>

          {/* Open Add Car modal */}
          <li onClick={() => setAddCarModalOpen(true)}>
            ➕ <span>Add Car</span>
          </li>
        </ul>

        {/* Logout button */}
        <button className="logout-btn" onClick={() => navigate("/login")}>
          🚪 <span>Logout</span>
        </button>
      </aside>

      {/* Main content area */}
      <main className="main">{sectionList[activeSection]}</main>

      {/* Profile modal */}
      <ProfileModal
        open={isProfileModalOpen}
        profile={profile}
        onClose={() => setProfileModalOpen(false)}
        onChange={handleProfileChange}
        onImageUpload={handleProfileImageUpload}
        onSave={handleSaveProfile}
      />

      {/* Add Car modal */}
      <AddNewCar
        open={isAddCarModalOpen}
        onClose={() => setAddCarModalOpen(false)}
        onCarAdded={(updatedCars) => setCars(updatedCars)}
      />

      {/* Car details modal */}
      {isCarDetailOpen && selectedCar && (
        <div className="modal-overlay" onClick={() => setCarDetailOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            
            <h2>{selectedCar.model}</h2>

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
