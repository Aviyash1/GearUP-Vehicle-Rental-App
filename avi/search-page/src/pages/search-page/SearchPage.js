// SearchPage.js
// Updated to include floating labels and a two-row input layout.
// All car card animations, colors, and logic are kept exactly the same.

import React, { useState, useEffect } from "react";
import "./SearchPage.css";

import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

import mapImage from "./images/map-placeholder.png";
import logoImage from "./images/logo.png";

import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaSearch } from "react-icons/fa";

function SearchPage() {
  const navigate = useNavigate();

  // Vehicle data loaded from Firestore
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search form values
  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");

  // Filters
  const [locationFilter, setLocationFilter] = useState([]);
  const [transmissionFilter, setTransmissionFilter] = useState([]);
  const [priceFilter, setPriceFilter] = useState([]);

  // Fetch vehicle documents
  useEffect(() => {
    async function fetchCars() {
      try {
        const querySnapshot = await getDocs(collection(db, "vehicles"));
        const fetched = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCars(fetched);
      } catch (err) {
        console.error("Firestore load error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCars();
  }, []);

  // Filter toggler
  const handleFilterChange = (type, value) => {
    const update = prev =>
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value];

    if (type === "location") setLocationFilter(update);
    if (type === "transmission") setTransmissionFilter(update);
    if (type === "price") setPriceFilter(update);
  };

  // Core filtering logic
  const filteredCars = cars.filter(car => {
    const matchLocation =
      (!pickupLocation ||
        car.location.toLowerCase().includes(pickupLocation.toLowerCase())) &&
      (locationFilter.length === 0 || locationFilter.includes(car.location));

    const matchTransmission =
      transmissionFilter.length === 0 || transmissionFilter.includes(car.transmission);

    const matchPrice =
      priceFilter.length === 0 ||
      priceFilter.some(range => {
        if (range === "low") return car.price <= 200;
        if (range === "high") return car.price > 200;
        return true;
      });

    return matchLocation && matchTransmission && matchPrice;
  });

  // Basic validation before moving to payment page
  const validateDates = () => {
    if (!pickupDate || !pickupTime || !returnDate || !returnTime) {
      alert("Please enter pickup and dropoff date and time.");
      return false;
    }
    const start = new Date(`${pickupDate}T${pickupTime}`);
    const end = new Date(`${returnDate}T${returnTime}`);
    const now = new Date();

    if (start < now) {
      alert("Pickup time must be in the future.");
      return false;
    }
    if (end <= start) {
      alert("Dropoff must be after pickup.");
      return false;
    }
    return true;
  };

  // Loading state
  if (loading) {
    return <h2 style={{ padding: "40px" }}>Loading vehicles...</h2>;
  }

  return (
    <div className="search-container">

      {/* HEADER — Floating labels */}
      <header className="header">
        <img src={logoImage} alt="Logo" className="logo-img" />

        {/* Two-row search layout */}
        <div className="search-form">

          {/* Row 1 */}
          <div className="search-row">
            {/* Floating label group */}
            <div className="input-group-float">
              <input
                type="text"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                required
              />
              <label>Pick-up Location</label>
            </div>

            <div className="input-group-float">
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                required
              />
              <label>Pickup Date</label>
            </div>

            <div className="input-group-float">
              <input
                type="time"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                required
              />
              <label>Pickup Time</label>
            </div>
          </div>

          {/* Row 2 */}
          <div className="search-row">
            <div className="input-group-float">
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                required
              />
              <label>Dropoff Date</label>
            </div>

            <div className="input-group-float">
              <input
                type="time"
                value={returnTime}
                onChange={(e) => setReturnTime(e.target.value)}
                required
              />
              <label>Dropoff Time</label>
            </div>

            <button className="search-btn">
              <FaSearch /> Search
            </button>
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <main className="main-layout">

        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="map-box">
            <img src={mapImage} alt="Map" className="map-img" />
            <div className="map-overlay">
              <FaMapMarkerAlt size={25} color="white" />
              <button
                className="map-btn"
                onClick={() =>
                  window.open("https://maps.app.goo.gl/dyskwAnqUHzFVPBU7", "_blank")
                }
              >
                Open Maps
              </button>
            </div>
          </div>

          <div className="filters">
            <div className="filter-header">
              <h3>Filters</h3>
              <a
                href="#"
                onClick={() => {
                  setLocationFilter([]);
                  setTransmissionFilter([]);
                  setPriceFilter([]);
                }}
              >
                Clear all filters
              </a>
            </div>

            <div className="filter-group">
              <h4>Location</h4>
              <label><input type="checkbox" onChange={() => handleFilterChange("location", "Auckland")} /> Auckland</label><br/>
              <label><input type="checkbox" onChange={() => handleFilterChange("location", "Wellington")} /> Wellington</label><br/>
              <label><input type="checkbox" onChange={() => handleFilterChange("location", "Queenstown")} /> Queenstown</label>
            </div>

            <div className="filter-group">
              <h4>Transmission</h4>
              <label><input type="checkbox" onChange={() => handleFilterChange("transmission", "Automatic")} /> Automatic</label><br/>
              <label><input type="checkbox" onChange={() => handleFilterChange("transmission", "Manual")} /> Manual</label>
            </div>

            <div className="filter-group">
              <h4>Price</h4>
              <label><input type="checkbox" onChange={() => handleFilterChange("price", "low")} /> $0 - $200</label><br/>
              <label><input type="checkbox" onChange={() => handleFilterChange("price", "high")} /> $200+</label>
            </div>
          </div>
        </aside>

        {/* RESULTS */}
        <section className="results">
          <h2>Vehicles Available ({filteredCars.length})</h2>

          {filteredCars.length === 0 && (
            <p style={{ marginTop: "20px", color: "#777" }}>No vehicles match your search.</p>
          )}

          {filteredCars.map((car) => (
            <div className="car-card" key={car.id}>
              <img src={car.imageUrl} alt={car.name} />

              <div className="car-info">
                <h3>{car.name}</h3>
                <p>{car.seats} Seats • {car.transmission} • {car.bags} Bags</p>

                <div className="price-section">
                  <h4>${car.price} / day</h4>

                  <button
                    className="rent-btn"
                    onClick={() => {
                      if (!validateDates()) return;

                      navigate("/payment", {
                        state: {
                          car,
                          pickupDate,
                          pickupTime,
                          returnDate,
                          returnTime,
                        },
                      });
                    }}
                  >
                    Rent Now
                  </button>
                </div>

                <details className="info-dropdown">
                  <summary>More Information</summary>
                  <div className="owner-info">
                    <h4>Owner Contact</h4>
                    <p>Email: info@{car.name.replace(/\s+/g, "").toLowerCase()}.co.nz</p>
                    <p>Phone: +64 21 555 1234</p>
                    <p>Location: {car.location}</p>
                  </div>
                </details>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default SearchPage;
