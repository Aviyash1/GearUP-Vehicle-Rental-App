import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Finance from "./Finance";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Routes>
          <Route path="/" element={<Finance />} />
          <Route path="/finance" element={<Finance />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
