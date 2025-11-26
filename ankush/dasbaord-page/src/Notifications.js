// Notifications.js
import React, { useEffect, useState } from "react";
import { auth, db } from "./firebaseConfig";

import { ref, onValue, update, remove } from "firebase/database";

import "./Notifications.css";

function Notifications() {
  const uid = auth.currentUser?.uid;

  const [notifications, setNotifications] = useState([]);

  // --------------------------------------------------------
  // LOAD USER NOTIFICATIONS IN REALTIME
  // --------------------------------------------------------
  useEffect(() => {
    if (!uid) return;

    onValue(ref(db, `users/${uid}/notifications`), (snap) => {
      if (!snap.exists()) return setNotifications([]);

      const data = snap.val();
      const list = Object.keys(data).map((id) => ({
        id,
        ...data[id],
      }));

      // Sort newest → oldest
      list.sort((a, b) => (b.date || 0) - (a.date || 0));

      setNotifications(list);
    });
  }, [uid]);

  // --------------------------------------------------------
  // MARK AS READ
  // --------------------------------------------------------
  const handleMarkRead = async (notifId) => {
    await update(ref(db, `users/${uid}/notifications/${notifId}`), {
      read: true,
    });
  };

  // --------------------------------------------------------
  // DELETE NOTIFICATION
  // --------------------------------------------------------
  const handleDelete = async (notifId) => {
    await remove(ref(db, `users/${uid}/notifications/${notifId}`));
  };

  return (
    <div className="content-box fade-in">
      <h2>Notifications</h2>

      <ul className="notification-list">
        {notifications.length === 0 ? (
          <p>No notifications yet.</p>
        ) : (
          notifications.map((note) => (
            <li
              key={note.id}
              className={`notification-item ${
                note.read ? "read" : "unread"
              }`}
            >
              <p>{note.message}</p>
              <small>
                {note.date
                  ? new Date(note.date).toLocaleString()
                  : "No date"}
              </small>

              <div style={{ marginTop: "8px" }}>
                {!note.read && (
                  <button
                    className="btn primary"
                    onClick={() => handleMarkRead(note.id)}
                    style={{ marginRight: "8px" }}
                  >
                    Mark as Read
                  </button>
                )}

                <button
                  className="btn cancel"
                  onClick={() => handleDelete(note.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default Notifications;
