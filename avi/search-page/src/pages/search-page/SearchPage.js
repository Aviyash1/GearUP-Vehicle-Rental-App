// SearchPage.js
// This version pulls real car data from Firestore, checks admin approval,
// and filters the results based on availability dates entered by the user.
// CSS, layout, and animations remain exactly the same as before.

import React, { useState, useEffect } from "react";
import "./SearchPage.css";

import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

import mapImage from "./images/map-placeholder.png";
import logoImage from "./images/logo.png";

import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";

function SearchPage() {
  const navigate = useNavigate();

  // database vehicle list
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // search bar values
  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");

  // filter checkboxes
  const [locationFilter, setLocationFilter] = useState([]);
  const [transmissionFilter, setTransmissionFilter] = useState([]);
  const [priceFilter, setPriceFilter] = useState([]);

  // cars displayed after pressing search
  const [searchedCars, setSearchedCars] = useState([]);
  const [searched, setSearched] = useState(false);

  // load all vehicles from Firestore
  useEffect(() => {
    async function fetchCars() {
      try {
        const querySnapshot = await getDocs(collection(db, "vehicles"));

        // only take cars that were approved by admin
        const fetched = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(car => car.approved === true);

        setCars(fetched);
      } catch (err) {
        console.log("Error loading vehicles:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCars();
  }, []);

  // simple checkbox handler for all filter groups
  const handleFilterChange = (type, value) => {
    const toggle = (prev) =>
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value];

    if (type === "location") setLocationFilter(toggle);
    if (type === "transmission") setTransmissionFilter(toggle);
    if (type === "price") setPriceFilter(toggle);
  };

  // ensures the user entered valid pickup and dropoff times
  const validateDates = () => {
    if (!pickupDate || !pickupTime || !returnDate || !returnTime) {
      alert("Please fill in both pickup and return date/time.");
      return false;
    }

    const start = new Date(`${pickupDate}T${pickupTime}`);
    const end = new Date(`${returnDate}T${returnTime}`);
    const now = new Date();

    if (start < now) {
      alert("Pickup must be in the future.");
      return false;
    }
    if (end <= start) {
      alert("Dropoff must be after pickup.");
      return false;
    }

    return true;
  };

  // checks if a selected range fits inside a car's availableFrom/availableTo
  const isAvailable = (car, start, end) => {
    // these values come directly from Firestore
    const availableStart = new Date(car.availableFrom);
    const availableEnd = new Date(car.availableTo);

    // availability is valid if the selected range fits in the car's range
    return start >= availableStart && end <= availableEnd;
  };

  // search button logic
  const handleSearch = () => {
    if (!validateDates()) return;

    const start = new Date(`${pickupDate}T${pickupTime}`);
    const end = new Date(`${returnDate}T${returnTime}`);

    // filter by availability based on the car's availableFrom / availableTo
    const results = cars.filter(car => isAvailable(car, start, end));

    setSearchedCars(results);
    setSearched(true);
  };

  // sidebar filters (location, transmission, price)
  const filteredCars = cars.filter((car) => {
    const matchLocation =
      (!pickupLocation ||
        car.location.toLowerCase().includes(pickupLocation.toLowerCase())) &&
      (locationFilter.length === 0 || locationFilter.includes(car.location));

    const matchTransmission =
      transmissionFilter.length === 0 ||
      transmissionFilter.includes(car.transmission);

    const matchPrice =
      priceFilter.length === 0 ||
      priceFilter.some((range) => {
        if (range === "low") return car.price <= 200;
        if (range === "high") return car.price > 200;
        return true;
      });

    return matchLocation && matchTransmission && matchPrice;
  });

  if (loading) {
    return <h2 style={{ padding: "40px" }}>Loading vehicles...</h2>;
  }

  return (
    <div className="search-container">

      {/* HEADER WITH SEARCH INPUTS */}
      <header className="header">
        <img src={logoImage} alt="Logo" className="logo-img" />

        <div className="search-bar-full">

          <div className="input-group-float">
            <input
              type="text"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
            />
            <label>Pick-up Location</label>
          </div>

          <div className="input-group-float">
            <input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
            />
            <label>Pickup Date</label>
          </div>

          <div className="input-group-float">
            <input
              type="time"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
            />
            <label>Pickup Time</label>
          </div>

          <div className="input-group-float">
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
            />
            <label>Dropoff Date</label>
          </div>

          <div className="input-group-float">
            <input
              type="time"
              value={returnTime}
              onChange={(e) => setReturnTime(e.target.value)}
            />
            <label>Dropoff Time</label>
          </div>

          <button className="search-btn" onClick={handleSearch}>
            <FaSearch /> Search
          </button>
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
              <label><input type="checkbox" onChange={() => handleFilterChange("location", "Auckland")} /> Auckland</label><br />
              <label><input type="checkbox" onChange={() => handleFilterChange("location", "Wellington")} /> Wellington</label><br />
              <label><input type="checkbox" onChange={() => handleFilterChange("location", "Queenstown")} /> Queenstown</label>
            </div>

            <div className="filter-group">
              <h4>Transmission</h4>
              <label><input type="checkbox" onChange={() => handleFilterChange("transmission", "Automatic")} /> Automatic</label><br />
              <label><input type="checkbox" onChange={() => handleFilterChange("transmission", "Manual")} /> Manual</label>
            </div>

            <div className="filter-group">
              <h4>Price</h4>
              <label><input type="checkbox" onChange={() => handleFilterChange("price", "low")} /> $0 - $200</label><br />
              <label><input type="checkbox" onChange={() => handleFilterChange("price", "high")} /> $200+</label>
            </div>
          </div>
        </aside>

        {/* VEHICLE RESULTS */}
        <section className="results">
          <h2>
            Vehicles Available (
              {searched ? searchedCars.length : filteredCars.length}
            )
          </h2>

          {(searched ? searchedCars : filteredCars).length === 0 && (
            <p style={{ marginTop: "20px", color: "#777" }}>
              No vehicles match the current search.
            </p>
          )}

          {(searched ? searchedCars : filteredCars).map(car => (
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
                    <h4>Owner Details</h4>
                    <p>Location: {car.location}</p>
                    <p>Available From: {car.availableFrom}</p>
                    <p>Available To: {car.availableTo}</p>
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
