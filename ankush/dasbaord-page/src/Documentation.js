import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Documentation.css";

function Documentation() {
  const navigate = useNavigate();

  const [docs, setDocs] = useState({
    insurance: { file: null, status: "Missing" },
    wof: { file: null, status: "Missing" },
    registration: { file: null, status: "Missing" },
    ownership: { file: null, status: "Missing" },
  });

  const handleFileUpload = (e, docType) => {
    const file = e.target.files[0];
    if (!file) return;

    setDocs((prev) => ({
      ...prev,
      [docType]: {
        file,
        status: "Uploaded",
      },
    }));
  };

  const handleRemove = (docType) => {
    setDocs((prev) => ({
      ...prev,
      [docType]: { file: null, status: "Missing" },
    }));
  };

  const handleSubmit = () => {
    const missing = Object.entries(docs).filter(([_, val]) => !val.file);

    if (missing.length > 0) {
      alert(
        `Missing documents: ${missing
          .map(([key]) => key.toUpperCase())
          .join(", ")}`
      );
      return;
    }
    alert("All car documents uploaded successfully!");
  };

  return (
    <div className="doc-container fade-in">
      <div className="doc-header">
        <h2 className="doc-title">Car Documentation</h2>
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back to Dashboard
        </button>
      </div>

      <p className="doc-subtitle">
        Manage and upload required car documents to keep your vehicle compliant and active.
      </p>

      <div className="doc-grid">
        {Object.keys(docs).map((key) => {
          const item = docs[key];
          const displayName = key.charAt(0).toUpperCase() + key.slice(1);

          return (
            <div key={key} className="doc-card hover-lift">
              <h3>{displayName}</h3>

              <p className="doc-status">
                Status:{" "}
                <span className={item.status === "Uploaded" ? "status-ok" : "status-missing"}>
                  {item.status}
                </span>
              </p>

              {item.file ? (
                <>
                  <p className="file-name">{item.file.name}</p>

                  <div className="doc-actions">
                    <button
                      className="btn secondary"
                      onClick={() => window.open(URL.createObjectURL(item.file))}
                    >
                      View
                    </button>

                    <button
                      className="btn cancel"
                      onClick={() => handleRemove(key)}
                    >
                      Remove
                    </button>
                  </div>
                </>
              ) : (
                <div className="upload-box">
                  <input
                    type="file"
                    id={key}
                    accept="application/pdf,image/*"
                    onChange={(e) => handleFileUpload(e, key)}
                    style={{ display: "none" }}
                  />
                  <label htmlFor={key} className="upload-label">
                    📄 Upload {displayName}
                  </label>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="doc-actions-footer">
        <button className="btn primary" onClick={handleSubmit}>
          ✅ Save All Documents..
        </button>
      </div>
    </div>
  );
}

export default Documentation;
