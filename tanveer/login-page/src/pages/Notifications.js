// src/pages/Notifications.js
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import "../styles/Notifications.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Set up a real-time listener for the current user's notifications.
   * - If user isn't logged in, stop immediately.
   * - Firestore onSnapshot gives live updates (create/update/delete).
   * - Normalize timestamp because Firestore timestamps & plain JS timestamps differ.
   */
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    // Reference to "notifications" collection, filtered by current user
    const ref = collection(db, "notifications");
    const q = query(ref, where("userId", "==", user.uid));

    // Live subscription to notifications
    const unsub = onSnapshot(
      q,
      (snap) => {
        // Transform each doc, normalize timestamp, sort latest → oldest
        const data = snap.docs
          .map((d) => {
            const raw = d.data();

            let createdAtMs = 0;       // Numeric timestamp for sorting
            let createdAtLabel = "Just now"; // Human-readable fallback

            // Firestore Timestamp object → JS Date
            if (raw.createdAt?.toDate) {
              const dObj = raw.createdAt.toDate();
              createdAtMs = dObj.getTime();
              createdAtLabel = dObj.toLocaleString();

            // Plain string/number date → JS Date
            } else if (raw.createdAt) {
              const dObj = new Date(raw.createdAt);
              createdAtMs = dObj.getTime();
              createdAtLabel = dObj.toLocaleString();
            }

            return {
              id: d.id,
              ...raw,
              _createdAtMs: createdAtMs,        // used only for sorting
              _createdAtLabel: createdAtLabel,  // used for UI display
            };
          })
          .sort((a, b) => b._createdAtMs - a._createdAtMs);

        setNotifications(data);
        setLoading(false);
      },
      (err) => {
        console.error("Error loading notifications:", err);
        setLoading(false);
      }
    );

    // Clean up Firestore listener when component unmounts
    return () => unsub();
  }, []);

  /**
   * Mark a single notification as read.
   * Does nothing if it's already marked.
   */
  const markAsRead = async (n) => {
    if (n.read) return; // Prevent redundant writes
    try {
      await updateDoc(doc(db, "notifications", n.id), { read: true });
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  /**
   * Mark ALL unread notifications as read.
   * Uses Promise.all for parallel writes — faster than sequential.
   */
  const markAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.read);
    try {
      await Promise.all(
        unread.map((n) =>
          updateDoc(doc(db, "notifications", n.id), { read: true })
        )
      );
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  return (
    <div className="notifications-page">
      <div className="notifications-container">
        <div className="notifications-header">

          {/* Header + "Mark all as read" button */}
          <div>
            <h1 className="notifications-title">Notifications</h1>
            <p className="notifications-subtitle">
              Stay informed with your latest booking updates.
            </p>
          </div>

          {notifications.length > 0 && (
            <button className="mark-all-btn" onClick={markAllAsRead}>
              Mark all as read
            </button>
          )}
        </div>

        {/* Handle loading, empty state, or show notifications list */}
        {loading ? (
          <p className="notifications-loading">Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <p className="notifications-empty">
            You have no notifications yet.
          </p>
        ) : (
          <div className="notifications-list">
            {notifications.map((n) => {
              // Use type (info/warning/error/etc.) to adjust UI color/style
              const type = n.type || "info";

              // Dynamic classes depending on read state + type
              const itemClass = [
                "notification-card",
                n.read ? "notification-read" : "notification-unread",
                `notification-${type}`,
              ].join(" ");

              return (
                <div
                  key={n.id}
                  className={itemClass}
                  onClick={() => markAsRead(n)} // Clicking entire card marks as read
                >
                  <div className="notification-main">
                    <h3 className="notification-title">{n.title}</h3>
                    <p className="notification-message">{n.message}</p>

                    {/* Readable timestamp */}
                    {n._createdAtLabel && (
                      <span className="notification-time">
                        {n._createdAtLabel}
                      </span>
                    )}
                  </div>

                  {/* Button to mark individual notification as read */}
                  {!n.read && (
                    <button
                      className="notification-read-btn"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering parent click
                        markAsRead(n);
                      }}
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Basic navigation: send user back to dashboard */}
        <button
          className="notifications-back-btn"
          onClick={() => (window.location.href = "/dashboard")}
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Notifications;
