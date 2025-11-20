// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles"; // ✅ Added Vehicles page
import BookVehicle from "./pages/BookVehicle";
import PaymentPage from "./pages/PaymentPage";
import FeedbackPage from "./pages/FeedbackPage";
import MyBookings from "./pages/MyBookings";
import MyProfile from "./pages/MyProfile";
function App() {
  return (
    <Router>
      <Routes>
        {/* Default route = Login */}
        <Route path="/" element={<Login />} />

        {/* Other routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/vehicles" element={<Vehicles />} /> {/* ✅ Browse vehicles page */}
        <Route path="/book/:vehicleName" element={<BookVehicle />} />
        <Route path="/payment" element={<PaymentPage />} />
<Route path="/feedback" element={<FeedbackPage />} />
  <Route path="/my-bookings" element={<MyBookings />} />
  <Route path="/my-profile" element={<MyProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
