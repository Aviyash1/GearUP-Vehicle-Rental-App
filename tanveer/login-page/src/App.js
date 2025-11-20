import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";

import UserDashboard from "./pages/Dashboard";
//import CarOwnerDashboard from "./pages/CarOwnerDashboard";
//import AdminDashboard from "./pages/AdminDashboard";

import Vehicles from "./pages/Vehicles";
import BookVehicle from "./pages/BookVehicle";
import PaymentPage from "./pages/PaymentPage";
import FeedbackPage from "./pages/FeedbackPage";
import MyBookings from "./pages/MyBookings";
import MyProfile from "./pages/MyProfile";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset" element={<ResetPassword />} />

        {/* USER */}
        <Route
          path="/Dashboard"
          element={
            <ProtectedRoute allowedRoles={["User"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vehicles"
          element={
            <ProtectedRoute allowedRoles={["User"]}>
              <Vehicles />
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
          path="/payment"
          element={
            <ProtectedRoute allowedRoles={["User"]}>
              <PaymentPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute allowedRoles={["User"]}>
              <MyBookings />
            </ProtectedRoute>
          }
        />

        {/* CAR OWNER */}
        {/* <Route */}
          {/* path="/carowner-dashboard" */}
          {/* element={ */}
            {/* <ProtectedRoute allowedRoles={["CarOwner"]}> */}
              {/* <CarOwnerDashboard /> */}
            {/* </ProtectedRoute> */}
          {/* } */}
        {/* /> */}

        {/* ADMIN */}
        {/* <Route */}
          {/* path="/admin-dashboard" */}
          {/* element={ */}
            {/* <ProtectedRoute allowedRoles={["Admin"]}> */}
              {/* <AdminDashboard /> */}
            {/* </ProtectedRoute> */}
          {/* } */}
        {/* /> */}

        {/* SHARED */}
        {/* <Route */}
          {/* path="/my-profile" */}
          {/* element={ */}
            {/* <ProtectedRoute allowedRoles={["User", "CarOwner", "Admin"]}> */}
              {/* <MyProfile /> */}
            {/* </ProtectedRoute> */}
          }
        {/* /> */}

        <Route path="/unauthorized" element={<h2>Access Denied</h2>} />
      </Routes>
    </Router>
  );
}
