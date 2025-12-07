// Component to display notification list
import React from "react";
import "../styles/Notifications.css";

function Notifications({ notifications, onMarkRead, onDelete }) {
  return (
    <div className="content-box fade-in">
      <h2>Notifications</h2>

      {/* List of notifications */}
      <ul className="notification-list">
        {notifications.map((note) => (
          <li
            key={note.id}
            className={`notification-item ${note.read ? "read" : "unread"}`} // Style based on read state
          >
            <p>{note.message}</p>
            <small>{note.date}</small>

            {/* Button to mark notification as read */}
            {!note.read && (
              <button onClick={() => onMarkRead(note.id)}>Mark as Read</button>
            )}

            {/* Button to delete notification */}
            <button onClick={() => onDelete(note.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Notifications;
