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

  // Real-time subscription to current user's notifications
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    const ref = collection(db, "notifications");
    const q = query(ref, where("userId", "==", user.uid));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs
          .map((d) => {
            const raw = d.data();
            let createdAtMs = 0;
            let createdAtLabel = "Just now";

            if (raw.createdAt?.toDate) {
              const dObj = raw.createdAt.toDate();
              createdAtMs = dObj.getTime();
              createdAtLabel = dObj.toLocaleString();
            } else if (raw.createdAt) {
              const dObj = new Date(raw.createdAt);
              createdAtMs = dObj.getTime();
              createdAtLabel = dObj.toLocaleString();
            }

            return {
              id: d.id,
              ...raw,
              _createdAtMs: createdAtMs,
              _createdAtLabel: createdAtLabel,
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

    return () => unsub();
  }, []);

  const markAsRead = async (n) => {
    if (n.read) return;
    try {
      await updateDoc(doc(db, "notifications", n.id), { read: true });
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

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

        {loading ? (
          <p className="notifications-loading">Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <p className="notifications-empty">
            You have no notifications yet.
          </p>
        ) : (
          <div className="notifications-list">
            {notifications.map((n) => {
              const type = n.type || "info";
              const itemClass = [
                "notification-card",
                n.read ? "notification-read" : "notification-unread",
                `notification-${type}`,
              ].join(" ");

              return (
                <div
                  key={n.id}
                  className={itemClass}
                  onClick={() => markAsRead(n)}
                >
                  <div className="notification-main">
                    <h3 className="notification-title">{n.title}</h3>
                    <p className="notification-message">{n.message}</p>
                    {n._createdAtLabel && (
                      <span className="notification-time">
                        {n._createdAtLabel}
                      </span>
                    )}
                  </div>

                  {!n.read && (
                    <button
                      className="notification-read-btn"
                      onClick={(e) => {
                        e.stopPropagation();
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
