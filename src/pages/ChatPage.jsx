// ============================================================
//  NEXCHAT — ChatPage.jsx
//  Main chat layout — wires unread + presence
//  Author  : Hassan Javed
//  GitHub  : https://github.com/Hassanjaved17
//  Built   : March 2026
//  © 2026 Hassan Javed — All Rights Reserved
// ============================================================

import { useState }     from "react";
import { useAuth }      from "../context/AuthContext";
import { useNavigate }  from "react-router-dom";
import useRooms, { GLOBAL_ROOM } from "../hooks/useRooms";
import useUnread        from "../hooks/useUnread";
import Sidebar          from "../components/chat/Sidebar";
import ChatWindow       from "../components/chat/ChatWindow";

const ChatPage = () => {
  const { user, logout }            = useAuth();
  const navigate                    = useNavigate();
  const [activeRoom, setActiveRoom] = useState(GLOBAL_ROOM);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { rooms, createRoom, joinRoom } = useRooms(user);
  const { unreadCounts }                = useUnread(rooms, activeRoom?.id);

  // ── Logout ────────────────────────────────────────────────
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // ── Create room ───────────────────────────────────────────
  const handleCreateRoom = async (name) => {
    const id = await createRoom(name);
    if (id) setActiveRoom({ id, name, isGlobal: false });
  };

  // ── Join room ─────────────────────────────────────────────
  const handleJoinRoom = async (code) => {
    const room = await joinRoom(code);
    if (room) {
      setActiveRoom(room);
      return room;
    }
    return null;
  };

  return (
    <div className="h-screen flex bg-[#0a0812] overflow-hidden">

      <Sidebar
        user={user}
        rooms={rooms}
        activeRoom={activeRoom}
        onSelectRoom={setActiveRoom}
        onCreateRoom={handleCreateRoom}
        onJoinRoom={handleJoinRoom}
        onLogout={handleLogout}
        isMobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        unreadCounts={unreadCounts}
      />

      <ChatWindow
        room={activeRoom}
        user={user}
        onMenuOpen={() => setMobileOpen(true)}
      />

    </div>
  );
};

export default ChatPage;

// © 2026 Hassan Javed — All Rights Reserved