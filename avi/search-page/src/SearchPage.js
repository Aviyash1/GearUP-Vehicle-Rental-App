import React, { useState } from "react";
import "./SearchPage.css";
import mapImage from "./images/map-placeholder.png";
import gmcImage from "./images/gmc.jpg";
import porscheImage from "./images/porsche.jpg";
import mercedesImage from "./images/mercedes.jpg";
import logoImage from "./images/logo.png";
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaSearch } from "react-icons/fa";

function SearchPage() {
  // Sample car data 
  const allCars = [
    {
      id: 1,
      name: "GMC Denali 2025",
      seats: 5,
      transmission: "Automatic",
      bags: 3,
      price: 180,
      location: "Auckland",
      image: gmcImage,
    },
    {
      id: 2,
      name: "Porsche 2025",
      seats: 4,
      transmission: "Automatic",
      bags: 3,
      price: 250,
      location: "Queenstown",
      image: porscheImage,
    },
    {
      id: 3,
      name: "Mercedes GTR 2025",
      seats: 4,
      transmission: "Automatic",
      bags: 2,
      price: 300,
      location: "Auckland",
      image: mercedesImage,
    },
    {
      id: 4,
      name: "Mazda CX-5 2024",
      seats: 5,
      transmission: "Manual",
      bags: 3,
      price: 150,
      location: "Queenstown",
      image: gmcImage,
    },
  ];

  // States
  const [cars, setCars] = useState(allCars);
  const [locationFilter, setLocationFilter] = useState([]);
  const [transmissionFilter, setTransmissionFilter] = useState([]);
  const [priceFilter, setPriceFilter] = useState([]);

  // Filter logic
  const handleFilterChange = (filterType, value) => {
    const updateFilter = (prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value];

    if (filterType === "location") setLocationFilter(updateFilter);
    if (filterType === "transmission") setTransmissionFilter(updateFilter);
    if (filterType === "price") setPriceFilter(updateFilter);
  };

  const filteredCars = allCars.filter((car) => {
    const locationMatch =
      locationFilter.length === 0 || locationFilter.includes(car.location);
    const transmissionMatch =
      transmissionFilter.length === 0 ||
      transmissionFilter.includes(car.transmission);
    const priceMatch =
      priceFilter.length === 0 ||
      priceFilter.some((range) => {
        if (range === "low") return car.price <= 200;
        if (range === "high") return car.price > 200;
        return true;
      });

    return locationMatch && transmissionMatch && priceMatch;
  });

  return (
    <div className="search-container">
      {/* HEADER */}
      <header className="header">
        <img src={logoImage} alt="Logo" className="logo-img" />
        <div className="search-bar">
          <input type="text" placeholder="Pick-up Location" />
          <div className="input-icon"><FaMapMarkerAlt /></div>

          <input type="date" />
          <div className="input-icon"><FaCalendarAlt /></div>

          <input type="time" />
          <div className="input-icon"><FaClock /></div>

          <input type="date" />
          <div className="input-icon"><FaCalendarAlt /></div>

          <input type="time" />
          <div className="input-icon"><FaClock /></div>

          <button className="search-btn">
            <FaSearch /> Search
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="main-layout">
        {/* LEFT SIDEBAR */}
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

          {/* FILTERS */}
          <div className="filters">
            <div className="filter-header">
              <h3>Filters</h3>
              <a href="#" onClick={() => {
                setLocationFilter([]);
                setTransmissionFilter([]);
                setPriceFilter([]);
              }}>Clear all filters</a>
            </div>

            <div className="filter-group">
              <h4>Location</h4>
              <label>
                <input
                  type="checkbox"
                  onChange={() => handleFilterChange("location", "Auckland")}
                  checked={locationFilter.includes("Auckland")}
                /> Auckland
              </label><br />
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
              </label><br />
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
              </label><br />
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

        {/* RESULTS SECTION */}
        <section className="results">
          <h2>Vehicles Available ({filteredCars.length})</h2>

          {filteredCars.map((car) => (
            <div className="car-card" key={car.id}>
              <img src={car.image} alt={car.name} />
              <div className="car-info">
                <h3>{car.name}</h3>
                <p>
                  {car.seats} Seats • {car.transmission} • {car.bags} Bags
                </p>

                <div className="price-section">
                  <h4>${car.price} / day</h4>
                  <button className="rent-btn">Rent Now</button>
                </div>

                <div className="car-features">
                  <span className="tooltip">Free cancellation (48h)
                    <span className="tooltiptext">
                      Cancel up to 48 hours before pick-up for a full refund.
                    </span>
                  </span>
                  <span className="tooltip">Unlimited kilometres
                    <span className="tooltiptext">
                      Drive as much as you want, with no distance limits.
                    </span>
                  </span>
                </div>

                <details className="info-dropdown">
                  <summary>More Information</summary>
                  <div className="owner-info">
                    <h4>Owner Contact Information</h4>
                    <p>Email: info@{car.name.replace(/\s+/g, "").toLowerCase()}.co.nz</p>
                    <p>Phone: +64 21 555 1234</p>
                    <p>Location: {car.location}</p>
                  </div>
                </details>
              </div>
            </div>
          ))}

          {filteredCars.length === 0 && (
            <p style={{ color: "#888", marginTop: "20px" }}>
              No vehicles match your filters.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}

export default SearchPage;
