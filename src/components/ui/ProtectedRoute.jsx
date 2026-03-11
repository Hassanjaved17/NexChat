// ============================================================
//  NEXCHAT — ProtectedRoute.jsx
//  Author  : Hassan Javed
//  GitHub  : https://github.com/Hassanjaved17
//  Built   : March 2026
//  © 2026 Hassan Javed — All Rights Reserved
// ============================================================

import { Navigate }  from "react-router-dom";
import { useAuth }   from "../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

// © 2026 Hassan Javed — All Rights Reserved