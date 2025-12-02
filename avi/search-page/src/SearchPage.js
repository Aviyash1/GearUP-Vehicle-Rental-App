import React, { useState, useEffect } from "react";
import "./SearchPage.css";
import mapImage from "./images/map-placeholder.png";
import gmcImage from "./images/gmc.jpg";
import porscheImage from "./images/porsche.jpg";
import mercedesImage from "./images/mercedes.jpg";
import mazdaImage from "./images/mazda.jpg";
import logoImage from "./images/logo.png";
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaSearch } from "react-icons/fa";
import { fetchCars } from "./firebase/carService";

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

  useEffect(() => {
    async function loadCars() {
      const result = await fetchCars();
      setCars(result);
    }
    loadCars();
  }, []);

  const handleFilterChange = (filterType, value) => {
    const updateFilter = (prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value];

    if (filterType === "location") setLocationFilter(updateFilter);
    if (filterType === "transmission") setTransmissionFilter(updateFilter);
    if (filterType === "price") setPriceFilter(updateFilter);
  };

  const filteredCars = cars.filter((car) => {
    const locationMatch =
      (pickupLocation === "" || car.location?.toLowerCase().includes(pickupLocation.toLowerCase())) &&
      (locationFilter.length === 0 || locationFilter.includes(car.location));

    const transmissionMatch =
      transmissionFilter.length === 0 ||
      transmissionFilter.includes(car.transmission);

    const priceMatch =
      priceFilter.length === 0 ||
      priceFilter.some((range) => {
        if (range === "low") return car.rent <= 200;
        if (range === "high") return car.rent > 200;
        return true;
      });

    const pickupDateTime = pickupDate && pickupTime ? `${pickupDate}T${pickupTime}` : null;
    const returnDateTime = returnDate && returnTime ? `${returnDate}T${returnTime}` : null;

    const dateMatch =
      !pickupDateTime ||
      !returnDateTime ||
      (car.availableFrom <= pickupDateTime && car.availableTo >= returnDateTime);

    return locationMatch && transmissionMatch && priceMatch && dateMatch;
  });

  return (
    <div className="search-container">

      <header className="header">
        <img src={logoImage} alt="Logo" className="logo-img" />
        <div className="search-bar">
          <input
            type="text"
            placeholder="Pick-up Location"
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
          />
          <div className="input-icon"><FaMapMarkerAlt /></div>

          <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} />
          <div className="input-icon"><FaCalendarAlt /></div>

          <input type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} />
          <div className="input-icon"><FaClock /></div>

          <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
          <div className="input-icon"><FaCalendarAlt /></div>

          <input type="time" value={returnTime} onChange={(e) => setReturnTime(e.target.value)} />
          <div className="input-icon"><FaClock /></div>

          <button className="search-btn">
            <FaSearch /> Search
          </button>
        </div>
      </header>

      <main className="main-layout">

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

        <section className="results">
          <h2>Vehicles Available ({filteredCars.length})</h2>

          {filteredCars.map((car) => (
            <div className="car-card" key={car.id}>
              <img src={car.imageUrl} alt={car.model} />
              <div className="car-info">
                <h3>{car.model}</h3>
                <p>{car.seats} Seats • {car.transmission} • {car.bags} Bags</p>

                <div className="price-section">
                  <h4>${car.rent} / day</h4>
                  <button className="rent-btn">Rent Now</button>
                </div>

                <details className="info-dropdown">
                  <summary>More Information</summary>
                  <div className="owner-info">
                    <h4>Owner Contact Information</h4>
                    <p>Email: info@{car.model?.replace(/\s+/g, "").toLowerCase()}.co.nz</p>
                    <p>Phone: +64 21 555 1234</p>
                    <p>Location: {car.location}</p>
                  </div>
                </details>
              </div>
            </div>
          ))}

          {filteredCars.length === 0 && (
            <p style={{ color: "#888", marginTop: "20px" }}>
              No vehicles match your search or filters.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}

export default SearchPage;
