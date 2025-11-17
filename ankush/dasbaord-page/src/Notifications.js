import React from "react";
import "./Notifications.css";

function Notifications({ notifications, onMarkRead, onDelete }) {
  return (
    <div className="content-box fade-in">
      <h2>Notifications</h2>
      <ul className="notification-list">
        {notifications.map((note) => (
          <li key={note.id} className={`notification-item ${note.read ? "read" : "unread"}`}>
            <p>{note.message}</p>
            <small>{note.date}</small>
            {!note.read && <button onClick={() => onMarkRead(note.id)}>Mark as Read</button>}
            <button onClick={() => onDelete(note.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Notifications;
