// ============================================================
//  NEXCHAT — MessageBubble.jsx
//  Author  : Hassan Javed
//  GitHub  : https://github.com/Hassanjaved17
//  Built   : March 2026
//  © 2026 Hassan Javed — All Rights Reserved
// ============================================================

import { useState } from "react";
import { Trash2 }   from "lucide-react";

// ── Avatar color based on name ────────────────────────────────
const AVATAR_COLORS = [
  "bg-violet-500", "bg-blue-500", "bg-emerald-500",
  "bg-pink-500",   "bg-amber-500", "bg-cyan-500",
];

const getAvatarColor = (name = "") => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
};

const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

// ── Format timestamp ──────────────────────────────────────────
const formatTime = (timestamp) => {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleTimeString("en-PK", {
    hour:   "2-digit",
    minute: "2-digit",
  });
};

const MessageBubble = ({ message, isOwn, onDelete }) => {
  const [hovered, setHovered] = useState(false);

  const initials    = getInitials(message.displayName);
  const avatarColor = getAvatarColor(message.displayName);

  return (
    <div
      className={`flex items-end gap-2.5 group ${isOwn ? "flex-row-reverse" : "flex-row"}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Avatar — other users only */}
      {!isOwn && (
        <div className={`w-7 h-7 rounded-full ${avatarColor} flex items-center justify-center flex-shrink-0 mb-0.5`}>
          <span className="text-white text-xs font-bold">{initials}</span>
        </div>
      )}

      {/* Bubble */}
      <div className={`flex flex-col gap-1 max-w-[70%] ${isOwn ? "items-end" : "items-start"}`}>

        {/* Name — other users only */}
        {!isOwn && (
          <span className="text-gray-500 text-xs px-1">{message.displayName}</span>
        )}

        <div className="flex items-end gap-2">

          {/* Delete button — own messages only, on hover */}
          {isOwn && hovered && (
            <button
              onClick={() => onDelete(message.id)}
              className="w-6 h-6 rounded-md flex items-center justify-center text-gray-700 hover:text-red-400 hover:bg-red-500/10 transition-all mb-1"
            >
              <Trash2 size={11} />
            </button>
          )}

          {/* Message text */}
          <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
            isOwn
              ? "bg-violet-600 text-white rounded-br-sm"
              : "bg-[#1a1226] border border-violet-900/30 text-gray-200 rounded-bl-sm"
          }`}>
            {message.text}
          </div>

        </div>

        {/* Timestamp */}
        <span className="text-gray-700 text-xs px-1">
          {formatTime(message.timestamp)}
        </span>

      </div>
    </div>
  );
};

export default MessageBubble;

// © 2026 Hassan Javed — All Rights Reserved