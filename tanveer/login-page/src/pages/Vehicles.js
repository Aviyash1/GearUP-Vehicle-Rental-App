import React, { useState } from "react";
import "../styles/Vehicles.css";
import { useNavigate } from "react-router-dom";

// === import assets ===
import crownklugar from "../assets/Toyota Crown Klugar.jpg";
import camry from "../assets/camry.jpg";
import chr from "../assets/chr.jpg";
import fortuner from "../assets/Fortuner.jpg";
import city from "../assets/Hoda City.jpg";
import mercedes from "../assets/Mercedes_C.jpg";
import audi from "../assets/Audi_A6.jpg";
import taigun from "../assets/Volkswagon-Taigun.webp";
import bmwM4 from "../assets/bmw-m4-cs-04.jpg";
import bmwX5 from "../assets/BmwX5.webp";
import range from "../assets/Range Rover.webp";
import porsche from "../assets/Porsche.jpg";
import harrier from "../assets/Tata Harrier.webp";
import creta from "../assets/Hyundai Creta.jpg";
import enfield from "../assets/Royal Enfield.jpg";
import ninja from "../assets/ninja650_3.jpg";

export default function Vehicles() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("default");

  const allVehicles = [
    { name: "Toyota Camry", type: "Sedan", price: 130, img: camry },
    { name: "Honda City", type: "Sedan", price: 90, img: city },
    { name: "Mercedes C-Class", type: "Sedan", price: 180, img: mercedes },
    { name: "Audi A6", type: "Sedan", price: 170, img: audi },
    { name: "Toyota Crown Klugar", type: "SUV", price: 220, img: crownklugar },
    { name: "Toyota C-HR", type: "SUV", price: 140, img: chr },
    { name: "Toyota Fortuner", type: "SUV", price: 200, img: fortuner },
    { name: "Volkswagen Taigun", type: "SUV", price: 130, img: taigun },
    { name: "BMW X5", type: "SUV", price: 260, img: bmwX5 },
    { name: "Range Rover Evoque", type: "SUV", price: 280, img: range },
    { name: "Hyundai Creta", type: "SUV", price: 120, img: creta },
    { name: "Tata Harrier", type: "SUV", price: 125, img: harrier },
    { name: "BMW M4", type: "Sports", price: 330, img: bmwM4 },
    { name: "Porsche 911 Carrera", type: "Sports", price: 420, img: porsche },
    { name: "Royal Enfield Classic 350", type: "Motorbike", price: 70, img: enfield },
    { name: "Kawasaki Ninja 650", type: "Motorbike", price: 120, img: ninja },
  ];

  const filtered = filter === "All" ? allVehicles : allVehicles.filter(v => v.type === filter);

  const sortedVehicles = [...filtered].sort((a, b) => {
    if (sortOrder === "lowToHigh") return a.price - b.price;
    if (sortOrder === "highToLow") return b.price - a.price;
    return 0;
  });

  return (
    <div className="vehicles-section">
      <div className="vehicles-overlay">
        <h2 className="vehicles-heading">Available Vehicles</h2>
        <p className="vehicles-subheading">
          Select from our premium collection for your next trip
        </p>

        {/* Filter Buttons */}
        <div className="filter-bar">
          {["All", "Sedan", "SUV", "Sports", "Motorbike"].map((type) => (
            <button
              key={type}
              className={`filter-btn ${filter === type ? "active" : ""}`}
              onClick={() => setFilter(type)}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Sort Dropdown - TOP RIGHT corner */}
        <div className="sort-wrapper">
          <select
            className="sort-dropdown"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="default">Sort by Price</option>
            <option value="lowToHigh">Low to High</option>
            <option value="highToLow">High to Low</option>
          </select>
        </div>

        {/* Vehicle Cards */}
        <div className="vehicle-grid">
          {sortedVehicles.map((v, i) => (
            <div className="vehicle-card" key={i}>
              <img src={v.img} alt={v.name} className="vehicle-img" />
              <h3>{v.name}</h3>
              <p className="vehicle-type">{v.type}</p>
              <p className="vehicle-price">NZ${v.price}/day</p>
              <button
                className="book-btn"
                onClick={() =>
                  navigate(`/book/${encodeURIComponent(v.name)}`, {
                    state: { vehicle: v },
                  })
                }
              >
                Book Now
              </button>
            </div>
          ))}
        </div>

        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
