import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/authentication/Login";
import Register from "./pages/authentication/Register";
import ResetPassword from "./pages/authentication/ResetPassword";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

import Vehicles from "./pages/Vehicles";
import BookVehicle from "./pages/BookVehicle";
import FeedbackPage from "./pages/FeedbackPage";
import MyBookings from "./pages/MyBookings";
import MyProfile from "./pages/MyProfile";
import UserNotifications from "./pages/UserNotifications";
import Documentation from "./pages/Documentation";
import CarOwnerDashboard from "./pages/CarOwnerDashboard";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/AdminDashboard";
import SearchPage from "./pages/SearchPage";
import PaymentPage from "./pages/PaymentPage";
import Favourites from "./pages/Favourites";

function App() {
  return (
    <Router>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset" element={<ResetPassword />} />

        {/* USER DASHBOARD (role: "User") */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["User", "CarOwner", "Admin"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* USER PAGES (Must be logged in) */}
        <Route
          path="/searchpage"
          element={
            <ProtectedRoute allowedRoles={["User", "CarOwner", "Admin"]}>
              <SearchPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment"
          element={
            <ProtectedRoute allowedRoles={["User"]}>
              <PaymentPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/book/:vehicleName"
          element={
            <ProtectedRoute allowedRoles={["User"]}>
              <BookVehicle />
            </ProtectedRoute>
          }
        />

        <Route
          path="/feedback"
          element={
            <ProtectedRoute allowedRoles={["User"]}>
              <FeedbackPage />
            </ProtectedRoute>
          }
        />

        <Route 
          path="/favourites"
          element={<Favourites />}
        />


        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute allowedRoles={["User"]}>
              <MyBookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-profile"
          element={
            <ProtectedRoute allowedRoles={["User"]}>
              <MyProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-notifications"
          element={
            <ProtectedRoute allowedRoles={["User"]}>
              <UserNotifications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRoles={["User", "CarOwner", "Admin"]}>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* ADMIN DASHBOARD */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* CAR OWNER DASHBOARD */}
        <Route
          path="/car-owner"
          element={
            <ProtectedRoute allowedRoles={["CarOwner"]}>
              <CarOwnerDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
