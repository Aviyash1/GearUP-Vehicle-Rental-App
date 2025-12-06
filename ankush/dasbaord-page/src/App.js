import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Settings from "./Settings";
import Documentation from "./Documentation";
import "./App.css";

function App() {
  return (
    // Enable routing in the app
    <Router>
      <Routes>

        {/* Main dashboard page */}
        <Route path="/" element={<Dashboard />} />

        {/* Separate pages (not used much because dashboard switches sections internally) */}
        <Route path="/settings" element={<Settings />} />
        <Route path="/documentation" element={<Documentation />} />

        {/* Fallback route when no page matches */}
        <Route
          path="*"
          element={
            <div style={{ padding: "50px", textAlign: "center" }}>
              <h2>404 - Page Not Found</h2>
              <p>The page you’re looking for doesn’t exist.</p>

              {/* Link back to home */}
              <a
                href="/"
                style={{
                  display: "inline-block",
                  marginTop: "20px",
                  color: "#2563eb",
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
