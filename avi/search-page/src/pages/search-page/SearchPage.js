// SearchPage.js
// This version wires up the Search button so the search fields actually run through
// a proper validation check before showing any vehicles. Bookings will be added later,
// but the structure here already prepares for that.

// React + Firebase imports
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

  // keep full vehicle list loaded from the database
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // search inputs at the top
  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");

  // filter states from sidebar
  const [locationFilter, setLocationFilter] = useState([]);
  const [transmissionFilter, setTransmissionFilter] = useState([]);
  const [priceFilter, setPriceFilter] = useState([]);

  // store vehicles after pressing the search button
  const [searchedCars, setSearchedCars] = useState([]);
  const [searched, setSearched] = useState(false);

  // Load all vehicles from Firestore when page loads
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
        console.log("Error loading vehicles:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCars();
  }, []);

  // handles selecting and unselecting any filter checkbox
  const handleFilterChange = (type, value) => {
    const toggle = (prev) =>
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value];

    if (type === "location") setLocationFilter(toggle);
    if (type === "transmission") setTransmissionFilter(toggle);
    if (type === "price") setPriceFilter(toggle);
  };

  // basic date and time checks before a search is allowed
  const validateDates = () => {
    if (!pickupDate || !pickupTime || !returnDate || !returnTime) {
      alert("Please complete the date and time fields before searching.");
      return false;
    }

    const start = new Date(`${pickupDate}T${pickupTime}`);
    const end = new Date(`${returnDate}T${returnTime}`);
    const now = new Date();

    // pickup cannot be in the past
    if (start < now) {
      alert("Pickup must be in the future.");
      return false;
    }

    // dropoff must be after pickup
    if (end <= start) {
      alert("Dropoff must be after pickup.");
      return false;
    }

    return true;
  };

  // placeholder availability check (real bookings will be added later)
  // for now, every car is considered available once the dates are valid
  const isAvailable = () => {
    return true;
  };

  // this runs when the user presses the search button
  const handleSearch = () => {
    if (!validateDates()) return;

    // this is where availability checking would happen eventually
    const results = cars.filter(car => isAvailable(car));
    setSearchedCars(results);
    setSearched(true);
  };

  // apply normal filters (location, price, transmission)
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

      {/* top bar with inputs */}
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

          {/* Search button calls the handler */}
          <button className="search-btn" onClick={handleSearch}>
            <FaSearch /> Search
          </button>
        </div>
      </header>

      {/* main layout with sidebar + results */}
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

        {/* list of cars (either filtered list or searched list) */}
        <section className="results">
          <h2>
            Vehicles Available (
              {searched ? searchedCars.length : filteredCars.length}
            )
          </h2>

          {(searched ? searchedCars : filteredCars).length === 0 && (
            <p style={{ marginTop: "20px", color: "#777" }}>
              No vehicles match the current filters.
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
