// ============================================================
//  NEXCHAT — App.jsx
//  Routes setup
//  Author  : Hassan Javed
//  GitHub  : https://github.com/Hassanjaved17
//  Built   : March 2026
//  © 2026 Hassan Javed — All Rights Reserved
// ============================================================

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider }    from "./context/AuthContext";
import ProtectedRoute      from "./components/ui/ProtectedRoute";
import LoginPage           from "./pages/LoginPage";
import ChatPage            from "./pages/ChatPage";
import NotFound            from "./pages/NotFound";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected */}
          <Route path="/chat" element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          } />

          {/* Redirects */}
          <Route path="/"  element={<Navigate to="/chat" replace />} />
          <Route path="*"  element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;

// © 2026 Hassan Javed — All Rights Reserved