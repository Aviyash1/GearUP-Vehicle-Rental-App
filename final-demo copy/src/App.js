import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/authentication/Login";
import Register from "./pages/authentication/Register";
import ResetPassword from "./pages/authentication/ResetPassword";
import Dashboard from "./pages/Dashboard";

import Vehicles from "./pages/Vehicles";
import BookVehicle from "./pages/BookVehicle";
import PaymentPage from "./pages/PaymentPage";
import FeedbackPage from "./pages/FeedbackPage";
import MyBookings from "./pages/MyBookings";
import MyProfile from "./pages/MyProfile";
import Notifications from "./pages/Notifications";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Auth */}
        <Route path="/register" element={<Register />} />
        <Route path="/reset" element={<ResetPassword />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* User Pages */}
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/book/:vehicleName" element={<BookVehicle />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </Router>
  );
}

export default App;
