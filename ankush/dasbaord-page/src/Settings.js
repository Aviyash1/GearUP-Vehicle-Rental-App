import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Settings.css";

function Settings() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile");

  const [settings, setSettings] = useState({
    name: "Tanveer Singh",
    email: "TS@gmail.com",
    phone: "+64 9876543210",
    language: "English",
    darkMode: false,
    twoFactorAuth: true,
    emailNotifications: true,
    smsNotifications: false,
  });

  // ✅ Apply dark mode dynamically
  useEffect(() => {
    const root = document.documentElement;
    if (settings.darkMode) {
      root.classList.add("dark-mode");
    } else {
      root.classList.remove("dark-mode");
    }
  }, [settings.darkMode]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    alert("✅ Settings saved successfully!");
  };

  const renderTab = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="tab-content fade-in">
            <label>Name</label>
            <input
              name="name"
              value={settings.name}
              onChange={handleChange}
            />

            <label>Email</label>
            <input
              name="email"
              value={settings.email}
              onChange={handleChange}
            />

            <label>Phone</label>
            <input
              name="phone"
              value={settings.phone}
              onChange={handleChange}
            />

            <label>Language</label>
            <select
              name="language"
              value={settings.language}
              onChange={handleChange}
            >
              <option>English</option>
              <option>Hindi</option>
              <option>Spanish</option>
              <option>Chinese</option>
            </select>
          </div>
        );

      case "security":
        return (
          <div className="tab-content fade-in">
            <label className="checkbox-row">
              <input
                type="checkbox"
                name="twoFactorAuth"
                checked={settings.twoFactorAuth}
                onChange={handleChange}
              />
              Enable Two-Factor Authentication
            </label>
            <p className="info-text">
              Adds an extra layer of security to your account.
            </p>

            <label className="checkbox-row">
              <input
                type="checkbox"
                name="darkMode"
                checked={settings.darkMode}
                onChange={handleChange}
              />
              Enable Dark Mode
            </label>
            <p className="info-text">
              Instantly toggles the dashboard to a dark theme.
            </p>
          </div>
        );

      case "notifications":
        return (
          <div className="tab-content fade-in">
            <label className="checkbox-row">
              <input
                type="checkbox"
                name="emailNotifications"
                checked={settings.emailNotifications}
                onChange={handleChange}
              />
              Email Notifications
            </label>

            <label className="checkbox-row">
              <input
                type="checkbox"
                name="smsNotifications"
                checked={settings.smsNotifications}
                onChange={handleChange}
              />
              SMS Notifications
            </label>
          </div>
        );

      default:
        return <p>Invalid Tab</p>;
    }
  };

  return (
    <div className="settings-container fade-in">
      <div className="settings-header">
        <h2 className="settings-title">Settings</h2>
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back to Dashboard
        </button>
      </div>

      <div className="settings-tabs">
        <button
          className={activeTab === "profile" ? "tab active" : "tab"}
          onClick={() => setActiveTab("profile")}
        >
          👤 Profile
        </button>
        <button
          className={activeTab === "security" ? "tab active" : "tab"}
          onClick={() => setActiveTab("security")}
        >
          🔒 Security
        </button>
        <button
          className={activeTab === "notifications" ? "tab active" : "tab"}
          onClick={() => setActiveTab("notifications")}
        >
          🔔 Notifications
        </button>
      </div>

      <div className="settings-panel">{renderTab()}</div>

      <div className="settings-actions">
        <button className="btn primary" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default Settings;
