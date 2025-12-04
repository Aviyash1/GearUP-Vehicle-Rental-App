import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";

import Vehicles from "./pages/Vehicles";
import BookVehicle from "./pages/BookVehicle";
import PaymentPage from "./pages/PaymentPage";
import FeedbackPage from "./pages/FeedbackPage";
import MyBookings from "./pages/MyBookings";
import MyProfile from "./pages/MyProfile";
import Notifications from "./pages/Notifications";
import FavoriteBookings from "./pages/FavoriteBookings";

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
        <Route path="/favorite-bookings" element={<FavoriteBookings />} />
      </Routes>
    </Router>
  );
}

export default App;
