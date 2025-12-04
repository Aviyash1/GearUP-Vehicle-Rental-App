import React, { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      setUser(currentUser);

      const snap = await getDoc(doc(db, "users", currentUser.uid));
      if (snap.exists()) {
        setRole(snap.data().role);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) return <p>Checking access...</p>;

  if (!user) return <Navigate to="/" />;

  if (!allowedRoles.includes(role)) return <Navigate to="/unauthorized" />;

  return children;
}
