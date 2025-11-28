import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Settings from "./Settings";
import Documentation from "./Documentation";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/documentation" element={<Documentation />} />

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
