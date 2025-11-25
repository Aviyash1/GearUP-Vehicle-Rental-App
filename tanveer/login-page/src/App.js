import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";

//import CarOwnerDashboard from "./pages/CarOwnerDashboard";
//import AdminDashboard from "./pages/AdminDashboard";

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
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/vehicles" element={<Vehicles />} /> {/*  Browse vehicles page */}
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