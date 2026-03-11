// ============================================================
//  NEXCHAT — Sidebar.jsx
//  Rooms list + unread badges + user info
//  Author  : Hassan Javed
//  GitHub  : https://github.com/Hassanjaved17
//  Built   : March 2026
//  © 2026 Hassan Javed — All Rights Reserved
// ============================================================

import { useState } from "react";
import {
  MessageSquare, Plus, Hash, Globe,
  LogOut, X, Loader2, Search,
} from "lucide-react";

// ── Avatar helpers ────────────────────────────────────────────
const AVATAR_COLORS = [
  "bg-violet-500", "bg-blue-500", "bg-emerald-500",
  "bg-pink-500", "bg-amber-500", "bg-cyan-500",
];

const getAvatarColor = (name = "") => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
};

const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

// ── Create Room Modal ─────────────────────────────────────────
const CreateRoomModal = ({ onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    await onCreate(name.trim());
    setLoading(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm bg-[#110d1a] border border-violet-900/40 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-violet-900/30">
          <h3 className="text-white font-semibold text-sm">Create Room</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-violet-900/30 transition-all">
            <X size={14} />
          </button>
        </div>
        <form onSubmit={handleCreate} className="px-5 py-5 flex flex-col gap-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Room name…"
            autoFocus
            maxLength={30}
            className="w-full bg-[#0a0812] border border-violet-900/40 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 outline-none focus:border-violet-500/70 focus:ring-1 focus:ring-violet-500/20 transition-all"
          />
          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:bg-violet-900 disabled:text-violet-700 text-white text-sm font-semibold transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            {loading ? "Creating…" : "Create Room"}
          </button>
        </form>
      </div>
    </div>
  );
};

// ── Join Room Modal ───────────────────────────────────────────
const JoinRoomModal = ({ onClose, onJoin }) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setError("");
    const room = await onJoin(code.trim());
    if (room) {
      onClose();
    } else {
      setError("Room not found. Check the code and try again.");
    }
    setLoading(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm bg-[#110d1a] border border-violet-900/40 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-violet-900/30">
          <h3 className="text-white font-semibold text-sm">Join Room</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-violet-900/30 transition-all">
            <X size={14} />
          </button>
        </div>
        <form onSubmit={handleJoin} className="px-5 py-5 flex flex-col gap-4">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste room code…"
            autoFocus
            className="w-full bg-[#0a0812] border border-violet-900/40 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 outline-none focus:border-violet-500/70 focus:ring-1 focus:ring-violet-500/20 transition-all font-mono"
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={loading || !code.trim()}
            className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:bg-violet-900 disabled:text-violet-700 text-white text-sm font-semibold transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            {loading ? "Joining…" : "Join Room"}
          </button>
        </form>
      </div>
    </div>
  );
};

// ── Sidebar ───────────────────────────────────────────────────
const Sidebar = ({
  user, rooms, activeRoom, onSelectRoom,
  onCreateRoom, onJoinRoom, onLogout,
  isMobileOpen, onMobileClose, unreadCounts,
}) => {
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);

  const initials = getInitials(user?.displayName || user?.email || "U");
  const avatarColor = getAvatarColor(user?.displayName || user?.email || "U");

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full z-30 w-72 bg-[#0d0917] border-r border-violet-900/30
        flex flex-col transition-transform duration-300
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:relative lg:translate-x-0 lg:z-auto
      `}>

        {/* Brand */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-violet-900/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/30 flex items-center justify-center">
              <MessageSquare size={16} className="text-violet-400" />
            </div>
            <span className="text-white font-bold text-base tracking-tight">NexChat</span>
          </div>
          <button
            onClick={onMobileClose}
            className="lg:hidden w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-white transition-all"
          >
            <X size={14} />
          </button>
        </div>

        {/* Rooms list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">

          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-gray-600 text-xs font-medium uppercase tracking-wider">Rooms</span>
            <div className="flex gap-1">
              <button
                onClick={() => setShowJoin(true)}
                title="Join Room"
                className="w-6 h-6 rounded-md flex items-center justify-center text-gray-600 hover:text-violet-400 hover:bg-violet-500/10 transition-all"
              >
                <Search size={12} />
              </button>
              <button
                onClick={() => setShowCreate(true)}
                title="Create Room"
                className="w-6 h-6 rounded-md flex items-center justify-center text-gray-600 hover:text-violet-400 hover:bg-violet-500/10 transition-all"
              >
                <Plus size={12} />
              </button>
            </div>
          </div>

          {rooms.map((room) => {
            const unread = unreadCounts?.[room.id] ?? 0;
            return (
              <button
                key={room.id}
                onClick={() => { onSelectRoom(room); onMobileClose(); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 text-left ${activeRoom?.id === room.id
                    ? "bg-violet-500/15 text-violet-300 border border-violet-500/20"
                    : "text-gray-400 hover:bg-violet-500/5 hover:text-gray-200"
                  }`}
              >
                {room.isGlobal
                  ? <Globe size={15} className="flex-shrink-0" />
                  : <Hash size={15} className="flex-shrink-0" />
                }
                <span className="truncate flex-1">{room.name}</span>

                {/* Unread badge */}
                {unread > 0 && activeRoom?.id !== room.id && (
                  <span className="flex-shrink-0 min-w-[18px] h-[18px] px-1 rounded-full bg-violet-500 text-white text-xs font-bold flex items-center justify-center">
                    {unread > 99 ? "99+" : unread}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* User info + logout */}
        <div className="px-3 py-4 border-t border-violet-900/30">
          <div className="flex items-center gap-3 px-2">
            <div className="relative">
              <div className={`w-8 h-8 rounded-full ${avatarColor} flex items-center justify-center flex-shrink-0`}>
                <span className="text-white text-xs font-bold">{initials}</span>
              </div>
              {/* Online green dot */}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0d0917]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">
                {user?.displayName || "Anonymous"}
              </p>
              <p className="text-gray-600 text-xs truncate">{user?.email}</p>
            </div>
            <button
              onClick={onLogout}
              title="Logout"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>

      </aside>

      {/* Modals */}
      {showCreate && (
        <CreateRoomModal
          onClose={() => setShowCreate(false)}
          onCreate={onCreateRoom}
        />
      )}
      {showJoin && (
        <JoinRoomModal
          onClose={() => setShowJoin(false)}
          onJoin={onJoinRoom}
        />
      )}
    </>
  );
};

export default Sidebar;

// © 2026 Hassan Javed — All Rights Reserved