import React, { useState, useEffect } from "react";
import "./SearchPage.css";
import mapImage from "./images/map-placeholder.png";
import logoImage from "./images/logo.png";
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaSearch } from "react-icons/fa";
import { fetchCars } from "../../firebase/carService";
import { useNavigate } from "react-router-dom";

function SearchPage() {
  const [cars, setCars] = useState([]);
  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");

  const [locationFilter, setLocationFilter] = useState([]);
  const [transmissionFilter, setTransmissionFilter] = useState([]);
  const [priceFilter, setPriceFilter] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      const result = await fetchCars();
      console.log("Fetched cars:", result);
      setCars(result);
    }
    load();
  }, []);

  // Sidebar filters
  const handleFilterChange = (type, value) => {
    const toggle = (prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value];

    if (type === "location") setLocationFilter(toggle);
    if (type === "transmission") setTransmissionFilter(toggle);
    if (type === "price") setPriceFilter(toggle);
  };

  // FILTERING SYSTEM (fixed)
  const filteredCars = cars.filter((car) => {
    let matches = true;

    // SEARCHBAR TYPED LOCATION
    if (pickupLocation.trim() !== "") {
      if (!car.location.toLowerCase().includes(pickupLocation.toLowerCase())) {
        matches = false;
      }
    }

    // SIDEBAR LOCATION FILTERS
    if (locationFilter.length > 0 && !locationFilter.includes(car.location)) {
      matches = false;
    }

    // TRANSMISSION FILTER
    if (transmissionFilter.length > 0 && !transmissionFilter.includes(car.transmission)) {
      matches = false;
    }

    // PRICE FILTER
    if (priceFilter.length > 0) {
      if (priceFilter.includes("low") && car.rent > 200) matches = false;
      if (priceFilter.includes("high") && car.rent <= 200) matches = false;
    }

    return matches;
  });

  // Rented car navigation
  const handleRent = (car) => {
    navigate("/payment", {
      state: { car, pickupDate, pickupTime, returnDate, returnTime },
    });
  };

  return (
    <div className="search-container">

      {/* HEADER */}
      <header className="header">
        <img src={logoImage} alt="Logo" className="logo-img" />

        <div className="search-bar">

          <div className="input-wrapper">
            <FaMapMarkerAlt className="input-icon" />
            <input
              type="text"
              placeholder="Pick-up Location"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
            />
          </div>

          <div className="input-wrapper">
            <FaCalendarAlt className="input-icon" />
            <input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
            />
          </div>

          <div className="input-wrapper">
            <FaClock className="input-icon" />
            <input
              type="time"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
            />
          </div>

          <div className="input-wrapper">
            <FaCalendarAlt className="input-icon" />
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
            />
          </div>

          <div className="input-wrapper">
            <FaClock className="input-icon" />
            <input
              type="time"
              value={returnTime}
              onChange={(e) => setReturnTime(e.target.value)}
            />
          </div>

          <button className="search-btn">
            <FaSearch /> Search
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main className="main-layout">

        {/* SIDEBAR */}
        <aside className="sidebar">

          {/* MAP */}
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

          {/* FILTERS */}
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
              <label>
                <input
                  type="checkbox"
                  onChange={() => handleFilterChange("location", "Auckland")}
                  checked={locationFilter.includes("Auckland")}
                /> Auckland
              </label>
              <label>
                <input
                  type="checkbox"
                  onChange={() => handleFilterChange("location", "Queenstown")}
                  checked={locationFilter.includes("Queenstown")}
                /> Queenstown
              </label>
            </div>

            <div className="filter-group">
              <h4>Transmission</h4>
              <label>
                <input
                  type="checkbox"
                  onChange={() => handleFilterChange("transmission", "Automatic")}
                  checked={transmissionFilter.includes("Automatic")}
                /> Automatic
              </label>
              <label>
                <input
                  type="checkbox"
                  onChange={() => handleFilterChange("transmission", "Manual")}
                  checked={transmissionFilter.includes("Manual")}
                /> Manual
              </label>
            </div>

            <div className="filter-group">
              <h4>Price</h4>
              <label>
                <input
                  type="checkbox"
                  onChange={() => handleFilterChange("price", "low")}
                  checked={priceFilter.includes("low")}
                /> $0 - $200
              </label>
              <label>
                <input
                  type="checkbox"
                  onChange={() => handleFilterChange("price", "high")}
                  checked={priceFilter.includes("high")}
                /> $200+
              </label>
            </div>
          </div>
        </aside>

        {/* RESULTS PANEL */}
        <section className="results">
          <h2>Vehicles Available ({filteredCars.length})</h2>

          <div className="car-grid">
            {filteredCars.map((car) => (
              <div className="car-card" key={car.id}>
                <img src={car.imageUrl} alt={car.model} />

                <h3>{car.model}</h3>
                <p>{car.seats} Seats • {car.transmission} • 2 Bags</p>

                <div className="price-section">
                  <h4>${car.rent} / day</h4>
                  <button className="rent-btn" onClick={() => handleRent(car)}>
                    Rent Now
                  </button>
                </div>

                <details className="info-dropdown">
                  <summary>More Information</summary>
                  <div className="owner-info">
                    <h4>Owner Contact Information</h4>
                    <p>Email: info@{car.model.replace(/\s+/g, "").toLowerCase()}.co.nz</p>
                    <p>Phone: +64 21 555 1234</p>
                    <p>Location: {car.location}</p>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default SearchPage;
