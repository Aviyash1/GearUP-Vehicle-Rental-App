// Dashboard.js
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth, db, storage } from "./firebaseConfig";

import {
  ref,
  onValue,
  set,
  push,
  update,
} from "firebase/database";

import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const uid = auth.currentUser?.uid;

  // -----------------------------
  // STATE
  // -----------------------------
  const [activeSection, setActiveSection] = useState("overview");
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isAddCarModalOpen, setAddCarModalOpen] = useState(false);
  const [isCarDetailOpen, setCarDetailOpen] = useState(false);

  const [selectedCar, setSelectedCar] = useState(null);
  const [profile, setProfile] = useState({});
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [previewImage, setPreviewImage] = useState(null);
  const [newCarImageFile, setNewCarImageFile] = useState(null);

  const [profileImageFile, setProfileImageFile] = useState(null);

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

  // -----------------------------
  // REALTIME FETCHES
  // -----------------------------
  useEffect(() => {
    if (!uid) return;

    // PROFILE
    onValue(ref(db, `users/${uid}/profile`), (snap) => {
      if (snap.exists()) setProfile(snap.val());
    });

    // GLOBAL CARS — filter by owner
    onValue(ref(db, "cars"), (snap) => {
      if (!snap.exists()) return setCars([]);
      const data = snap.val();
      const list = Object.keys(data)
        .map((id) => ({ id, ...data[id] }))
        .filter((car) => car.ownerUid === uid);

      setCars(list);
    });

    // BOOKINGS (per user)
    onValue(ref(db, `users/${uid}/bookings`), (snap) => {
      if (!snap.exists()) return setBookings([]);
      const data = snap.val();
      const list = Object.keys(data).map((id) => ({
        id,
        ...data[id],
      }));
      setBookings(list);
    });

    // NOTIFICATIONS (per user)
    onValue(ref(db, `users/${uid}/notifications`), (snap) => {
      if (!snap.exists()) return setNotifications([]);
      const data = snap.val();
      const list = Object.keys(data).map((id) => ({
        id,
        ...data[id],
      }));
      setNotifications(list);
    });
  }, [uid]);

  // -----------------------------
  // DISABLE SCROLL ON MODALS
  // -----------------------------
  useEffect(() => {
    const lock =
      isProfileModalOpen || isAddCarModalOpen || isCarDetailOpen;
    document.body.style.overflow = lock ? "hidden" : "auto";
  }, [
    isProfileModalOpen,
    isAddCarModalOpen,
    isCarDetailOpen,
  ]);

  // -----------------------------
  // HANDLERS
  // -----------------------------
  const toggleSidebar = () => setSidebarCollapsed((p) => !p);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  const handleProfileImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileImageFile(file);
  };

  const handleSaveProfile = async () => {
    let imageURL = profile.profileImage || "";

    if (profileImageFile) {
      const imgRef = storageRef(
        storage,
        `profiles/${uid}_${profileImageFile.name}`
      );

      await uploadBytes(imgRef, profileImageFile);
      imageURL = await getDownloadURL(imgRef);
    }

    await set(ref(db, `users/${uid}/profile`), {
      ...profile,
      profileImage: imageURL,
    });

    alert("Profile Updated");
    setProfileModalOpen(false);
  };

  const handleNewCarChange = (e) => {
    const { name, value } = e.target;
    setNewCar((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setNewCarImageFile(file);

    const url = URL.createObjectURL(file);
    setPreviewImage(url);
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
    for (let field of required) {
      if (!newCar[field]?.trim()) return `${field} is required`;
    }
    if (!/^\d{4}$/.test(newCar.year)) return "Year must be 4 digits";

    return null;
  };

  const handleAddCar = async () => {
    const err = validateCar();
    if (err) return alert(err);

    // Upload image
    let imageURL = "";
    if (newCarImageFile) {
      const imgRef = storageRef(
        storage,
        `cars/${Date.now()}_${newCarImageFile.name}`
      );
      await uploadBytes(imgRef, newCarImageFile);
      imageURL = await getDownloadURL(imgRef);
    }

    // Create car globally
    const newCarRef = push(ref(db, "cars"));
    await set(newCarRef, {
      ownerUid: uid,
      ...newCar,
      image: imageURL,
      status: "Pending", // Admin approval
      adminComments: "",
      approvedBy: "",
      updatedAt: Date.now(),
    });

    // Reset
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

    alert("Car submitted for admin approval.");
  };

  const handleShowDetails = (car) => {
    setSelectedCar(car);
    setCarDetailOpen(true);
  };

  // -----------------------------
  // MEMO
  // -----------------------------
  const pendingCount = useMemo(
    () => cars.filter((c) => c.status === "Pending").length,
    [cars]
  );

  // -----------------------------
  // SECTION RENDERS
  // -----------------------------
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
                car.status === "Approved"
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
    </div>
  );

  const renderBookings = () => (
    <div className="content-box fade-in">
      <h2>My Bookings</h2>

      <div className="booking-grid">
        {bookings.map((b) => (
          <div key={b.id} className="booking-card">
            <h4>{cars.find((c) => c.id === b.carId)?.model}</h4>

            <p><strong>Customer:</strong> {b.customer}</p>
            <p>
              <strong>Dates:</strong> {b.startDate} to {b.endDate}
            </p>

            <span
              className={`badge ${b.status.toLowerCase()}`}
            >
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

      <ul className="notification-list">
        {notifications.map((n) => (
          <li
            key={n.id}
            className={`notification-item ${
              n.read ? "read" : "unread"
            }`}
          >
            <p>{n.message}</p>
            <small>{n.date}</small>

            {!n.read && (
              <button
                className="btn primary"
                onClick={() =>
                  update(
                    ref(db, `users/${uid}/notifications/${n.id}`),
                    { read: true }
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

  // -----------------------------
  // RETURN UI
  // -----------------------------
  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
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
      </aside>

      {/* MAIN CONTENT */}
      <main className="main">{renderSection()}</main>

      {/* ------------------------------- */}
      {/* PROFILE MODAL */}
      {/* ------------------------------- */}
      {isProfileModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setProfileModalOpen(false)}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
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
              <button className="btn cancel" onClick={() => setProfileModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------- */}
      {/* ADD CAR MODAL */}
      {/* ------------------------------- */}
      {isAddCarModalOpen && (
        <div className="modal-overlay" onClick={() => setAddCarModalOpen(false)}>
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
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
              <button className="btn cancel" onClick={() => setAddCarModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------- */}
      {/* CAR DETAIL MODAL */}
      {/* ------------------------------- */}
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
                  selectedCar.status === "Approved"
                    ? "status-available"
                    : "status-pending"
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
