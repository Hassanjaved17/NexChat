// ============================================================
//  NEXCHAT — MessageBubble.jsx
//  Message bubble with reactions + delete
//  Author  : Hassan Javed
//  GitHub  : https://github.com/Hassanjaved17
//  Built   : March 2026
//  © 2026 Hassan Javed — All Rights Reserved
// ============================================================

import { useState } from "react";
import { Trash2, SmilePlus } from "lucide-react";

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

// ── Format timestamp ──────────────────────────────────────────
const formatTime = (timestamp) => {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleTimeString("en-PK", {
    hour: "2-digit", minute: "2-digit",
  });
};

// ── Available reactions ───────────────────────────────────────
const REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🔥"];

// ── Reaction Picker ───────────────────────────────────────────
const ReactionPicker = ({ onSelect }) => (
  <div className="absolute bottom-full mb-1 left-0 z-50 flex items-center gap-1 bg-[#1a1226] border border-violet-900/40 rounded-xl px-2 py-1.5 shadow-xl">
    {REACTIONS.map((emoji) => (
      <button
        key={emoji}
        onClick={() => onSelect(emoji)}
        className="text-base hover:scale-125 transition-transform duration-150 px-0.5"
      >
        {emoji}
      </button>
    ))}
  </div>
);

// ── MessageBubble ─────────────────────────────────────────────
const MessageBubble = ({ message, isOwn, onDelete, onReact, userId }) => {
  const [hovered, setHovered] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const initials = getInitials(message.displayName);
  const avatarColor = getAvatarColor(message.displayName);

  // ── Parse reactions into display format ───────────────────
  const reactionSummary = Object.entries(message.reactions || {}).map(
    ([emoji, users]) => ({
      emoji,
      count: Object.keys(users).length,
      hasReacted: !!users[userId],
    })
  ).filter((r) => r.count > 0);

  const handleReact = (emoji) => {
    onReact(message.id, emoji, userId);
    setShowPicker(false);
  };

  return (
    <div
      className={`flex items-end gap-2.5 group ${isOwn ? "flex-row-reverse" : "flex-row"}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setShowPicker(false); }}
    >
      {/* Avatar — other users only */}
      {!isOwn && (
        <div className={`w-7 h-7 rounded-full ${avatarColor} flex items-center justify-center shrink-0 mb-0.5`}>
          <span className="text-white text-xs font-bold">{initials}</span>
        </div>
      )}

      {/* Bubble */}
      <div className={`flex flex-col gap-1 max-w-[70%] ${isOwn ? "items-end" : "items-start"}`}>

        {/* Name — other users only */}
        {!isOwn && (
          <span className="text-gray-500 text-xs px-1">{message.displayName}</span>
        )}

        <div className={`flex items-end gap-2 ${isOwn ? "flex-row" : "flex-row-reverse"}`}>

          {/* Action buttons — on hover */}
          {hovered && (
            <div className={`flex items-center gap-1 mb-1 ${isOwn ? "flex-row" : "flex-row-reverse"}`}>

              {/* React button */}
              <div className="relative">
                {showPicker && (
                  <ReactionPicker onSelect={handleReact} />
                )}
                <button
                  onClick={() => setShowPicker((p) => !p)}
                  className="w-6 h-6 rounded-md flex items-center justify-center text-gray-700 hover:text-violet-400 hover:bg-violet-500/10 transition-all"
                >
                  <SmilePlus size={12} />
                </button>
              </div>

              {/* Delete — own messages only */}
              {isOwn && (
                <button
                  onClick={() => onDelete(message.id)}
                  className="w-6 h-6 rounded-md flex items-center justify-center text-gray-700 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <Trash2 size={11} />
                </button>
              )}
            </div>
          )}

          {/* Message text */}
          <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isOwn
              ? "bg-violet-600 text-white rounded-br-sm"
              : "bg-[#1a1226] border border-violet-900/30 text-gray-200 rounded-bl-sm"
            }`}>
            {message.text}
          </div>

        </div>

        {/* Reactions display */}
        {reactionSummary.length > 0 && (
          <div className={`flex flex-wrap gap-1 px-1 ${isOwn ? "justify-end" : "justify-start"}`}>
            {reactionSummary.map(({ emoji, count, hasReacted }) => (
              <button
                key={emoji}
                onClick={() => handleReact(emoji)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-all duration-200 ${hasReacted
                    ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                    : "bg-[#1a1226] border-violet-900/30 text-gray-400 hover:border-violet-500/30"
                  }`}
              >
                <span className="text-sm">{emoji}</span>
                <span>{count}</span>
              </button>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <span className="text-gray-700 text-xs px-1">{formatTime(message.timestamp)}</span>

      </div>
    </div>
  );
};

export default MessageBubble;

// © 2026 Hassan Javed — All Rights Reserved