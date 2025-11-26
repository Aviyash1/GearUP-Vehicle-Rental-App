// Documentation.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "./firebaseConfig";

import {
  ref,
  onValue,
  update,
  remove,
  set,
} from "firebase/database";

import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import "./Documentation.css";

function Documentation() {
  const navigate = useNavigate();
  const uid = auth.currentUser?.uid;

  const [docs, setDocs] = useState({
    insurance: { fileUrl: null, status: "Missing", fileName: null },
    wof: { fileUrl: null, status: "Missing", fileName: null },
    registration: { fileUrl: null, status: "Missing", fileName: null },
    ownership: { fileUrl: null, status: "Missing", fileName: null },
  });

  // --------------------------------------------------------
  // LOAD EXISTING DOCUMENTS IN REALTIME
  // --------------------------------------------------------
  useEffect(() => {
    if (!uid) return;

    onValue(ref(db, `users/${uid}/documents`), (snap) => {
      if (!snap.exists()) return;

      const stored = snap.val();
      const updated = { ...docs };

      for (const key in stored) {
        updated[key] = {
          fileUrl: stored[key].fileUrl,
          fileName: stored[key].fileName,
          status: "Uploaded",
        };
      }

      setDocs(updated);
    });
  }, [uid]);

  // --------------------------------------------------------
  // UPLOAD FILE
  // --------------------------------------------------------
  const handleFileUpload = async (e, docType) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const fileRef = storageRef(storage, `documents/${uid}/${docType}_${file.name}`);

      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);

      await set(ref(db, `users/${uid}/documents/${docType}`), {
        fileUrl: url,
        fileName: file.name,
        uploadedAt: Date.now(),
      });

      alert(`${docType.toUpperCase()} uploaded`);
    } catch (err) {
      alert("Upload failed: " + err.message);
    }
  };

  // --------------------------------------------------------
  // REMOVE FILE
  // --------------------------------------------------------
  const handleRemove = async (docType) => {
    await remove(ref(db, `users/${uid}/documents/${docType}`));

    setDocs((prev) => ({
      ...prev,
      [docType]: { fileUrl: null, status: "Missing", fileName: null },
    }));

    alert(`${docType.toUpperCase()} removed`);
  };

  // --------------------------------------------------------
  // SUBMIT ALL DOCUMENTS CHECK
  // --------------------------------------------------------
  const handleSubmit = () => {
    const missing = Object.entries(docs).filter(
      ([, val]) => !val.fileUrl
    );

    if (missing.length > 0) {
      alert(
        `Missing documents: ${missing
          .map(([key]) => key.toUpperCase())
          .join(", ")}`
      );
      return;
    }

    alert("All documents uploaded successfully!");
  };

  return (
    <div className="doc-container fade-in">
      <div className="doc-header">
        <h2 className="doc-title">Car Documentation</h2>
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          ← Back to Dashboard
        </button>
      </div>

      <p className="doc-subtitle">
        Upload and manage required compliance documents for your vehicle.
      </p>

      <div className="doc-grid">
        {Object.keys(docs).map((key) => {
          const item = docs[key];
          const displayName =
            key.charAt(0).toUpperCase() + key.slice(1);

          return (
            <div key={key} className="doc-card hover-lift">
              <h3>{displayName}</h3>

              <p className="doc-status">
                Status:{" "}
                <span
                  className={
                    item.status === "Uploaded"
                      ? "status-ok"
                      : "status-missing"
                  }
                >
                  {item.status}
                </span>
              </p>

              {item.fileUrl ? (
                <>
                  <p className="file-name">{item.fileName}</p>

                  <div className="doc-actions">
                    <button
                      className="btn secondary"
                      onClick={() => window.open(item.fileUrl)}
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
          ✅ Save All Documents
        </button>
      </div>
    </div>
  );
}

export default Documentation;
