import React from "react";
import "./SearchPage.css";
import mapImage from "./images/map-placeholder.png";
import gmcImage from "./images/gmc.jpg";
import porscheImage from "./images/porsche.jpg";
import mercedesImage from "./images/mercedes.jpg";
import logoImage from "./images/logo.png";
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaSearch } from "react-icons/fa";

function SearchPage() {
  return (
    <div className="search-container">
      {/* HEADER BAR */}
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
            <img
              src={mapImage}
              alt="Map"
              className="map-img"
            />
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
              <a href="#">Clear all filters</a>
            </div>

            <div className="filter-group">
              <h4>Location</h4>
              <label><input type="checkbox" /> Auckland</label><br />
              <label><input type="checkbox" /> Queens Town</label>
            </div>

            <div className="filter-group">
              <h4>Transmission</h4>
              <label><input type="checkbox" /> Automatic</label><br />
              <label><input type="checkbox" /> Manual</label>
            </div>

            <div className="filter-group">
              <h4>Price</h4>
              <label><input type="checkbox" /> $0 - $500</label><br />
              <label><input type="checkbox" /> $500+</label>
            </div>
          </div>
        </aside>

        {/* Search results and Vehicle Information*/}
        <section className="results">
          <h2>Vehicles Available</h2>

          <div className="sort-bar">
            <button>Sort By Vehicle Type</button>
            <button className="active">Automatic Transmission</button>
          </div>

          {/* GMC CARD */}
        <div className="car-card">
        <img src={gmcImage} alt="GMC Denali" />
      <div className="car-info">
        <h3>GMC Denali 2025</h3>
        <p>5 Seats • Automatic • 3 Bags</p>

        <div className="car-features">
        <span className="tooltip">
         Free cancellation (48h)
        <span className="tooltiptext">Cancel up to 48 hours before pick-up for a full refund.</span>
          </span>
          <span className="tooltip">
        Fair fuel policy
        <span className="tooltiptext">Return the car with the same fuel level as picked up. Over-filling will not be refunded.</span>
      </span>
      <span className="tooltip">
        Unlimited kilometres
        <span className="tooltiptext">Drive as much as you want, with no distance limits.</span>
      </span>
      <span className="tooltip">
        Liability coverage
        <span className="tooltiptext">Includes third-party liability protection as required by law.</span>
      </span>
      <span className="tooltip">
        Theft coverage
        <span className="tooltiptext">Covers vehicle theft or attempted theft, subject to terms.</span>
      </span>
      <span className="tooltip">
        Collision damage waiver
        <span className="tooltiptext">Reduces your financial liability if the vehicle is damaged.</span>
      </span>
    </div>

    {/* More Information Dropdown */}
    <details className="info-dropdown">
      <summary>More Information</summary>
      <div className="owner-info">
        <h4>Owner Contact Information</h4>
        <p>Email: gmcdenali@rentals.co.nz</p>
        <p>Phone: +64 21 555 1234</p>
        <p>Location: Auckland City</p>
        </div>
       </details>
     </div>
  </div>

                {/* Porche Card */}
<div className="car-card">
  <img src={porscheImage} alt="Porche" />
  <div className="car-info">
    <h3>Porche 2025</h3>
    <p>4 Seats • Automatic • 3 Bags</p>

    <div className="car-features">
      <span className="tooltip">
        Free cancellation (48h)
        <span className="tooltiptext">Cancel up to 48 hours before pick-up for a full refund.</span>
      </span>
      <span className="tooltip">
        Fair fuel policy
        <span className="tooltiptext">Return the car with the same fuel level as picked up. Over-filling will not be refunded.</span>
      </span>
      <span className="tooltip">
        Unlimited kilometres
        <span className="tooltiptext">Drive as much as you want, with no distance limits.</span>
      </span>
      <span className="tooltip">
        Liability coverage
        <span className="tooltiptext">Includes third-party liability protection as required by law.</span>
      </span>
      <span className="tooltip">
        Theft coverage
        <span className="tooltiptext">Covers vehicle theft or attempted theft, subject to terms.</span>
      </span>
      <span className="tooltip">
        Collision damage waiver
        <span className="tooltiptext">Reduces your financial liability if the vehicle is damaged.</span>
      </span>
    </div>

    {/* More Information Dropdown */}
    <details className="info-dropdown">
      <summary>More Information</summary>
      <div className="owner-info">
        <h4>Owner Contact Information</h4>
        <p>Email: porche@rentals.co.nz</p>
        <p>Phone: +64 21 555 1234</p>
        <p>Location: Auckland City</p>
      </div>
    </details>
  </div>
</div>

{/* Mercedes Card */}
<div className="car-card">
  <img src={mercedesImage} alt="Mercedes GTR 2025" />
  <div className="car-info">
    <h3>Mercedes GTR 2025</h3>
    <p>4 Seats • Automatic • 2 Bags</p>

    <div className="car-features">
      <span className="tooltip">
        Free cancellation (48h)
        <span className="tooltiptext">Cancel up to 48 hours before pick-up for a full refund.</span>
      </span>
      <span className="tooltip">
        Fair fuel policy
        <span className="tooltiptext">Return the car with the same fuel level as picked up. Over-filling will not be refunded.</span>
      </span>
      <span className="tooltip">
        Unlimited kilometres
        <span className="tooltiptext">Drive as much as you want, with no distance limits.</span>
      </span>
      <span className="tooltip">
        Liability coverage
        <span className="tooltiptext">Includes third-party liability protection as required by law.</span>
      </span>
      <span className="tooltip">
        Theft coverage
        <span className="tooltiptext">Covers vehicle theft or attempted theft, subject to terms.</span>
      </span>
      <span className="tooltip">
        Collision damage waiver
        <span className="tooltiptext">Reduces your financial liability if the vehicle is damaged.</span>
      </span>
    </div>

    {/* More Information Dropdown */}
    <details className="info-dropdown">
      <summary>More Information</summary>
      <div className="owner-info">
        <h4>Owner Contact Information</h4>
        <p>Email: gmcdenali@rentals.co.nz</p>
        <p>Phone: +64 21 555 1234</p>
        <p>Location: Auckland City</p>
      </div>
    </details>
  </div>            
          </div>
        </section>
      </main>
    </div>

    
  );
}

export default SearchPage;
