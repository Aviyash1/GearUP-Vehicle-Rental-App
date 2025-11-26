// Settings.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { auth, db } from "./firebaseConfig";
import { ref, onValue, update, set } from "firebase/database";

import "./Settings.css";

function Settings() {
  const uid = auth.currentUser?.uid;
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile");

  // All settings pulled from DB
  const [settings, setSettings] = useState({
    name: "",
    email: "",
    phone: "",
    language: "English",
    darkMode: false,
    twoFactorAuth: false,
    emailNotifications: true,
    smsNotifications: false,
  });

  // --------------------------------------------------------
  // LOAD USER SETTINGS IN REALTIME
  // --------------------------------------------------------
  useEffect(() => {
    if (!uid) return;

    onValue(ref(db, `users/${uid}/settings`), (snap) => {
      if (snap.exists()) {
        setSettings((prev) => ({
          ...prev,
          ...snap.val(),
        }));
      }
    });

    // Also load profile for name/email/phone defaults
    onValue(ref(db, `users/${uid}/profile`), (snap) => {
      if (snap.exists()) {
        const p = snap.val();
        setSettings((prev) => ({
          ...prev,
          name: p.name || prev.name,
          email: p.email || prev.email,
          phone: p.phone || prev.phone,
        }));
      }
    });
  }, [uid]);

  // --------------------------------------------------------
  // UPDATE LOCAL STATE
  // --------------------------------------------------------
  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // --------------------------------------------------------
  // SAVE SETTINGS TO REALTIME DB
  // --------------------------------------------------------
  const handleSave = async () => {
    await set(ref(db, `users/${uid}/settings`), settings);

    // Also sync basic profile fields to profile node
    await update(ref(db, `users/${uid}/profile`), {
      name: settings.name,
      email: settings.email,
      phone: settings.phone,
    });

    alert("Settings saved successfully!");
  };

  // Dark mode toggle (UI effect)
  useEffect(() => {
    const root = document.documentElement;
    if (settings.darkMode) {
      root.classList.add("dark-mode");
    } else {
      root.classList.remove("dark-mode");
    }
  }, [settings.darkMode]);

  // --------------------------------------------------------
  // TAB RENDER
  // --------------------------------------------------------
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
              Adds an extra layer of account security.
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
              Instant dark UI theme.
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
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
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
