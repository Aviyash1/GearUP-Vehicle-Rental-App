import React from "react";
import "../styles/CarModal.css";

export default function ConfirmDeleteModal({ open, onClose, onConfirm }) {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box small">

        <h3>Delete Vehicle?</h3>
        <p>This action cannot be undone.</p>

        <div className="modal-actions">
          <button className="modal-cancel" onClick={onClose}>Cancel</button>
          <button className="modal-delete" onClick={onConfirm}>Delete</button>
        </div>

      </div>
    </div>
  );
}
