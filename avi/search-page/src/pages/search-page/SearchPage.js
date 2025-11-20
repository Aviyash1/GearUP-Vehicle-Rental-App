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

  // Firestore-loaded cars
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");

  const [locationFilter, setLocationFilter] = useState([]);
  const [transmissionFilter, setTransmissionFilter] = useState([]);
  const [priceFilter, setPriceFilter] = useState([]);

  // Load cars from Firestore
  useEffect(() => {
    async function fetchCars() {
      try {
        const querySnapshot = await getDocs(collection(db, "vehicles"));
        const fetchedCars = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setCars(fetchedCars);
      } catch (error) {
        console.error("Error loading vehicles:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCars();
  }, []);

  // Filter toggle handler
  const handleFilterChange = (filterType, value) => {
    const updateFilter = (prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value];

    if (filterType === "location") setLocationFilter(updateFilter);
    if (filterType === "transmission") setTransmissionFilter(updateFilter);
    if (filterType === "price") setPriceFilter(updateFilter);
  };

  // Filtering logic
  const filteredCars = cars.filter((car) => {
    const locationMatch =
      (!pickupLocation ||
        car.location.toLowerCase().includes(pickupLocation.toLowerCase())) &&
      (locationFilter.length === 0 || locationFilter.includes(car.location));

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

  const validateDates = () => {
    if (!pickupDate || !pickupTime || !returnDate || !returnTime) {
      alert("Please enter pickup and dropoff date and time.");
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

  // Render loading
  if (loading) {
    return <h2 style={{ padding: "40px" }}>Loading vehicles...</h2>;
  }

  return (
    <div className="search-container">

      {/* HEADER BAR */}
      <div className="search-bar">

  <div className="input-group">
    <label>Pickup Location</label>
    <input
      type="text"
      placeholder="Pick-up Location"
      value={pickupLocation}
      onChange={(e) => setPickupLocation(e.target.value)}
    />
  </div>

  <div className="input-group">
    <label>Pickup Date</label>
    <input
      type="date"
      value={pickupDate}
      onChange={(e) => setPickupDate(e.target.value)}
    />
  </div>

  <div className="input-group">
    <label>Pickup Time</label>
    <input
      type="time"
      value={pickupTime}
      onChange={(e) => setPickupTime(e.target.value)}
    />
  </div>

  <div className="input-group">
    <label>Dropoff Date</label>
    <input
      type="date"
      value={returnDate}
      onChange={(e) => setReturnDate(e.target.value)}
    />
  </div>

  <div className="input-group">
    <label>Dropoff Time</label>
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


      {/* MAIN CONTENT */}
      <main className="main-layout">

        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="map-box">
            <img src={mapImage} alt="Map" className="map-img" />
            <div className="map-overlay">
              <FaMapMarkerAlt size={25} color="white" />
              <button
                className="map-btn"
                onClick={() => window.open("https://maps.app.goo.gl/dyskwAnqUHzFVPBU7", "_blank")}
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
              <label><input type="checkbox" onChange={() => handleFilterChange("location", "Auckland")} checked={locationFilter.includes("Auckland")} /> Auckland</label><br />
              <label><input type="checkbox" onChange={() => handleFilterChange("location", "Wellington")} checked={locationFilter.includes("Wellington")} /> Wellington</label><br />
              <label><input type="checkbox" onChange={() => handleFilterChange("location", "Queenstown")} checked={locationFilter.includes("Queenstown")} /> Queenstown</label>
            </div>

            <div className="filter-group">
              <h4>Transmission</h4>
              <label><input type="checkbox" onChange={() => handleFilterChange("transmission", "Automatic")} checked={transmissionFilter.includes("Automatic")} /> Automatic</label><br />
              <label><input type="checkbox" onChange={() => handleFilterChange("transmission", "Manual")} checked={transmissionFilter.includes("Manual")} /> Manual</label>
            </div>

            <div className="filter-group">
              <h4>Price</h4>
              <label><input type="checkbox" onChange={() => handleFilterChange("price", "low")} checked={priceFilter.includes("low")} /> $0 - $200</label><br />
              <label><input type="checkbox" onChange={() => handleFilterChange("price", "high")} checked={priceFilter.includes("high")} /> $200+</label>
            </div>
          </div>
        </aside>

        {/* RESULTS */}
        <section className="results">
          <h2>Vehicles Available ({filteredCars.length})</h2>

          {filteredCars.length === 0 && (
            <p style={{ marginTop: "20px", color: "#777" }}>No vehicles match your search or filters.</p>
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
                    <h4>Owner Contact Information</h4>
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
