import React, { useState } from "react";
import "./Dashboard.css";

function Dashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isAddCarModalOpen, setAddCarModalOpen] = useState(false);
  const [isCarDetailOpen, setCarDetailOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [profile, setProfile] = useState({
    name: "Tanveer Singh",
    email: "TS@gmail.com",
    phone: "+64 9876543210",
    address: "350 queen street",
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
      model: "Toyota Crolla",
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

  // =============================
  // Handlers
  // =============================
  const handleAction = (type) => {
    switch (type) {
      case "add":
        setAddCarModalOpen(true);
        break;
      case "profile":
        setProfileModalOpen(true);
        break;
      default:
        alert(`${type} feature coming soon...`);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfile((prev) => ({ ...prev, profileImage: url }));
    }
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
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
      setNewCar((prev) => ({ ...prev, image: url }));
    }
  };

  const handleAddCar = () => {
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
    const missing = required.filter((f) => !newCar[f]);
    if (missing.length) {
      alert("Missing fields: " + missing.join(", "));
      return;
    }
    setCars((p) => [
      ...p,
      { id: p.length + 1, ...newCar, status: "Pending Admin Approval" },
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

  // =============================
  // Section Renderer
  // =============================
  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="content-box">
            <h2>Dashboard Overview</h2>
            <p>
              Welcome back, <strong>{profile.name}</strong>! Here’s your
              business summary.
            </p>
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
                <h3>3</h3>
                <p>Active Bookings</p>
              </div>
              <div className="overview-card">
                <h3>
                  {cars.filter((car) => car.status === "Pending Admin Approval")
                    .length}
                </h3>
                <p>Pending Approvals</p>
              </div>
            </div>
          </div>
        );

      case "cars":
        return (
          <div className="content-box">
            <h2>My Cars</h2>
            <div className="car-grid">
              {cars.map((car) => (
                <div className="car-card" key={car.id}>
                  <img src={car.image} alt={car.model} />
                  <h4>{car.model}</h4>
                  <p>
                    {car.year} • {car.type}
                  </p>
                  <p>Rent: {car.rent}</p>
                  <span
                    className={
                      car.status === "Available"
                        ? "status-available"
                        : "status-pending"
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

      default:
        return (
          <div className="content-box">
            <h2>{activeSection}</h2>
            <p>Feature coming soon...</p>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">DriveRent</div>
        <ul>
          <li
            className={activeSection === "overview" ? "active" : ""}
            onClick={() => setActiveSection("overview")}
          >
            📊 Overview
          </li>
          <li
            className={activeSection === "cars" ? "active" : ""}
            onClick={() => setActiveSection("cars")}
          >
            🚗 My Cars
          </li>
        </ul>
      </aside>

      {/* Main */}
      <main className="main">
        <header className="topbar">
          <h1>Car Owner Dashboard</h1>
          <div className="top-actions">
            <button className="action-btn">💵 Finance</button>
            <button className="action-btn">📘 Bookings</button>
            <button className="action-btn">🔔 Notifications</button>
            <button className="action-btn">📊 Reports</button>
            <button className="action-btn">⚙️ Settings</button>
            <button
              className="action-btn profile-btn"
              onClick={() => handleAction("profile")}
            >
              👤 Profile
            </button>
            <button
              className="action-btn primary"
              onClick={() => handleAction("add")}
            >
              ➕ Add Car
            </button>
          </div>
        </header>

        {renderSection()}
      </main>

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Profile</h2>
            <div className="image-upload-section">
              <label>Profile Picture</label>
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

            <label>Name</label>
            <input name="name" value={profile.name} onChange={handleProfileChange} />
            <label>Email</label>
            <input name="email" value={profile.email} onChange={handleProfileChange} />
            <label>Phone</label>
            <input name="phone" value={profile.phone} onChange={handleProfileChange} />
            <label>Address</label>
            <input name="address" value={profile.address} onChange={handleProfileChange} />
            <label>City</label>
            <input name="city" value={profile.city} onChange={handleProfileChange} />
            <label>Country</label>
            <input name="country" value={profile.country} onChange={handleProfileChange} />
            <label>License Number</label>
            <input name="license" value={profile.license} onChange={handleProfileChange} />
            <label>Bank Name</label>
            <input name="bank" value={profile.bank} onChange={handleProfileChange} />
            <label>Account Number</label>
            <input name="account" value={profile.account} onChange={handleProfileChange} />

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

      {/* ✅ Full Add Car Modal */}
      {isAddCarModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add New Car</h2>
            <div className="add-car-grid">
              <input name="model" placeholder="Model *" value={newCar.model} onChange={handleNewCarChange} />
              <input name="type" placeholder="Type *" value={newCar.type} onChange={handleNewCarChange} />
              <input type="number" name="year" placeholder="Year *" value={newCar.year} onChange={handleNewCarChange} />
              <input name="mileage" placeholder="Mileage (km) *" value={newCar.mileage} onChange={handleNewCarChange} />
              <input name="engine" placeholder="Engine *" value={newCar.engine} onChange={handleNewCarChange} />
              <input name="color" placeholder="Color *" value={newCar.color} onChange={handleNewCarChange} />
              <input name="seats" placeholder="Seats *" value={newCar.seats} onChange={handleNewCarChange} />
              <input name="fuel" placeholder="Fuel *" value={newCar.fuel} onChange={handleNewCarChange} />
              <input name="transmission" placeholder="Transmission *" value={newCar.transmission} onChange={handleNewCarChange} />
              <input name="rent" placeholder="Daily Rent *" value={newCar.rent} onChange={handleNewCarChange} />
              <div className="image-upload-section">
                <label>Upload Image *</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
                {previewImage && <img src={previewImage} alt="Preview" className="preview-image" />}
              </div>
              <textarea name="description" placeholder="Description" value={newCar.description} onChange={handleNewCarChange} />
            </div>

            <div className="modal-actions">
              <button className="btn primary" onClick={handleAddCar}>
                Submit
              </button>
              <button className="btn cancel" onClick={() => setAddCarModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Car Details Modal */}
      {isCarDetailOpen && selectedCar && (
        <div className="modal-overlay">
          <div className="modal car-detail-modal">
            <h2>{selectedCar.model} Details</h2>
            <img src={selectedCar.image} alt={selectedCar.model} className="detail-image" />
            <div className="car-info">
              <p><strong>Type:</strong> {selectedCar.type}</p>
              <p><strong>Year:</strong> {selectedCar.year}</p>
              <p><strong>Mileage:</strong> {selectedCar.mileage} km</p>
              <p><strong>Engine:</strong> {selectedCar.engine}</p>
              <p><strong>Color:</strong> {selectedCar.color}</p>
              <p><strong>Fuel:</strong> {selectedCar.fuel}</p>
              <p><strong>Transmission:</strong> {selectedCar.transmission}</p>
              <p><strong>Rent:</strong> {selectedCar.rent}</p>
              <p><strong>Status:</strong> {selectedCar.status}</p>
              <p><strong>Description:</strong> {selectedCar.description}</p>
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
