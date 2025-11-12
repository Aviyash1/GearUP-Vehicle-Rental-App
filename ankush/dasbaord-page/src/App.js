import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
//import Finance from "./Finance";
import Settings from "./Settings";
import Documentation from "./Documentation";
import "./App.css"; // optional global styles

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route loads the Dashboard */}
        <Route path="/" element={<Dashboard />} />

        {/* Finance and Settings pages */}
        {/* <Route path="/finance" element={<Finance />} /> */}
        <Route path="/settings" element={<Settings />} />
        <Route path="/documentation" element={<Documentation />} />

        {/* Optional: fallback for unknown routes */}
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
