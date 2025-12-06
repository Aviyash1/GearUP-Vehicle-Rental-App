import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../styles/MyProfile.css";

const MyProfile = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      const ref = doc(db, "users", user.uid);
      const snapshot = await getDoc(ref);

      if (snapshot.exists()) {
        const data = snapshot.data();
        setName(data.name || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setAddress(data.address || "");
      }
    };

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    const ref = doc(db, "users", user.uid);
    await updateDoc(ref, {
      name,
      phone,
      address,
    });

    alert("Profile updated successfully!");
  };

  return (
    <div className="profile-bg">
      <div className="profile-container">
        <h2 className="profile-title">My Profile</h2>

        <label className="profile-label">Full Name</label>
        <input
          className="profile-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="profile-label">Email</label>
        <input className="profile-input" value={email} disabled />

        <label className="profile-label">Phone</label>
        <input
          className="profile-input"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <label className="profile-label">Address</label>
        <input
          className="profile-input"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <button className="save-btn" onClick={handleSave}>
          Save Changes
        </button>

        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default MyProfile;
