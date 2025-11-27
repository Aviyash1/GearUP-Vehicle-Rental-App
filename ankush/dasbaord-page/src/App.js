import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Settings from "./Settings";
import Documentation from "./Documentation";
import "./App.css"; // Global styles

function App() {
  return (
    <Router>
      <Routes>
        {/* Dashboard is the main route */}
        <Route path="/" element={<Dashboard />} />

        {/* Settings page */}
        <Route path="/settings" element={<Settings />} />

        {/* Documentation page */}
        <Route path="/documentation" element={<Documentation />} />

        {/* Fallback for unknown routes */}
        <Route
          path="*"
          element={
            <div style={{ padding: "50px", textAlign: "center" }}>
              <h2>404 - Page Not Found</h2>
              <p>The page you’re looking for doesn’t exist.</p>
              <a
                href="/"
                style={{
                  display: "inline-block",
                  marginTop: "20px",
                  color: "#007bff",
                  fontWeight: "bold",
                }}
              >
                ← Back to Dashboard
              </a>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
