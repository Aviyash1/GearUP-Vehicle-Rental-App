import React from "react";
import { Routes, Route } from "react-router-dom";
import { uploadVehicles } from "./utils/uploadVehicles";
import SearchPage from "./pages/search-page/SearchPage";
import PaymentPage from "./pages/payment-page/PaymentPage";

function App() {

  return (
    <Routes>
      <Route path="/" element={<SearchPage />} />
      <Route path="/payment" element={<PaymentPage />} />
    </Routes>
  );
}

export default App;
