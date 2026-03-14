// ============================================================
//  NEXCHAT — ChatWindow.jsx
//  Message list + typing indicator + sound notifications
//  Author  : Hassan Javed
//  GitHub  : https://github.com/Hassanjaved17
//  Built   : March 2026
//  © 2026 Hassan Javed — All Rights Reserved
// ============================================================

import { useState, useEffect, useRef, useCallback } from "react";
import {
    Send, Hash, Globe, Loader2,
    Copy, Check, Menu, Users,
} from "lucide-react";
import MessageBubble from "./MessageBubble";
import useMessages from "../../hooks/useMessages";
import usePresence from "../../hooks/usePresence";
import useTyping from "../../hooks/useTyping";
import useNotification from "../../hooks/useNotification";

// ── Typing dots animation ─────────────────────────────────────
const TypingDots = () => (
    <div className="flex items-center gap-1 px-1">
        {[0, 1, 2].map((i) => (
            <span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
            />
        ))}
    </div>
);

const ChatWindow = ({ room, user, onMenuOpen }) => {
    const { messages, loading, sendMessage, deleteMessage, toggleReaction } = useMessages(room?.id);
    const { onlineCount, onlineUsers } = usePresence(user, room?.id);
    const { setTyping, stopTyping, getTypingText } = useTyping(user, room?.id);
    const { playNotification, playSend } = useNotification();

    const [text, setText] = useState("");
    const [sending, setSending] = useState(false);
    const [copied, setCopied] = useState(false);
    const bottomRef = useRef(null);
    const prevMsgCountRef = useRef(0);
    const prevMsgIdsRef = useRef(new Set());

    // ── Auto scroll to bottom ─────────────────────────────────
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // ── Play notification on new messages from others ─────────
    useEffect(() => {
        if (loading || messages.length === 0) return;

        const currentIds = new Set(messages.map((m) => m.id));

        // Find new messages
        const newMessages = messages.filter(
            (m) => !prevMsgIdsRef.current.has(m.id) && m.uid !== user?.uid
        );

        if (prevMsgIdsRef.current.size > 0 && newMessages.length > 0) {
            playNotification();
        }

        prevMsgIdsRef.current = currentIds;
        prevMsgCountRef.current = messages.length;
    }, [messages, loading]);

    // ── Send message ──────────────────────────────────────────
    const handleSend = async (e) => {
        e.preventDefault();
        if (!text.trim() || sending) return;
        setSending(true);
        await stopTyping();
        await sendMessage(text, user);
        playSend();
        setText("");
        setSending(false);
    };

    // ── Handle input change + typing indicator ────────────────
    const handleInput = useCallback((e) => {
        setText(e.target.value);
        if (e.target.value.trim()) {
            setTyping();
        }
    }, [setTyping]);

    // ── Send on Enter ─────────────────────────────────────────
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend(e);
        }
    };

    // ── Copy room code ────────────────────────────────────────
    const copyRoomCode = () => {
        navigator.clipboard.writeText(room.id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const typingText = getTypingText();

    if (!room) return (
        <div className="flex-1 flex items-center justify-center bg-[#0a0812]">
            <p className="text-gray-700 text-sm">Select a room to start chatting</p>
        </div>
    );

    return (
        <div className="flex-1 flex flex-col bg-[#0a0812] min-w-0">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-violet-900/30 bg-[#0d0917]">
                <div className="flex items-center gap-3">

                    <button
                        onClick={onMenuOpen}
                        className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-violet-500/10 transition-all"
                    >
                        <Menu size={16} />
                    </button>

                    <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                        {room.isGlobal
                            ? <Globe size={15} className="text-violet-400" />
                            : <Hash size={15} className="text-violet-400" />
                        }
                    </div>
                    <div>
                        <h2 className="text-white font-semibold text-sm">{room.name}</h2>
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                            <p className="text-gray-500 text-xs">{onlineCount} online</p>
                            {onlineCount > 1 && (
                                <>
                                    <span className="text-gray-700 text-xs">·</span>
                                    <div className="flex items-center gap-1">
                                        <Users size={10} className="text-gray-600" />
                                        <span className="text-gray-600 text-xs">
                                            {onlineUsers.map((u) => u.displayName).join(", ")}
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {!room.isGlobal && (
                    <button
                        onClick={copyRoomCode}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-violet-900/40 text-gray-500 hover:text-violet-400 hover:border-violet-700/40 text-xs transition-all duration-200"
                    >
                        {copied
                            ? <Check size={12} className="text-emerald-400" />
                            : <Copy size={12} />
                        }
                        {copied ? "Copied!" : "Copy Code"}
                    </button>
                )}
            </div>

            {/* Messages */}
            <div className="messages-scroll flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-4">
                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <Loader2 size={20} className="animate-spin text-violet-500" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-2 py-20">
                        <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                            {room.isGlobal
                                ? <Globe size={20} className="text-violet-700" />
                                : <Hash size={20} className="text-violet-700" />
                            }
                        </div>
                        <p className="text-gray-600 text-sm">No messages yet. Say hello!</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <MessageBubble
                            key={msg.id}
                            message={msg}
                            isOwn={msg.uid === user.uid}
                            userId={user.uid}
                            onDelete={deleteMessage}
                            onReact={toggleReaction}
                        />
                    ))
                )}
                <div ref={bottomRef} />
            </div>

            {/* Typing indicator */}
            <div className="px-6 h-6 flex items-center">
                {typingText && (
                    <div className="flex items-center gap-2">
                        <TypingDots />
                        <span className="text-gray-500 text-xs">{typingText}</span>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="px-5 py-4 border-t border-violet-900/30 bg-[#0d0917]">
                <form onSubmit={handleSend} className="flex items-end gap-3">
                    <textarea
                        value={text}
                        onChange={handleInput}
                        onKeyDown={handleKeyDown}
                        placeholder={`Message ${room.name}…`}
                        rows={1}
                        maxLength={500}
                        className="flex-1 bg-[#1a1226] border border-violet-900/40 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 outline-none focus:border-violet-500/70 focus:ring-1 focus:ring-violet-500/20 transition-all resize-none max-h-32 overflow-y-auto"
                        style={{ minHeight: "46px" }}
                    />
                    <button
                        type="submit"
                        disabled={!text.trim() || sending}
                        className="w-11 h-11 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:bg-violet-900 disabled:text-violet-700 text-white transition-all duration-300 flex items-center justify-center shrink-0 shadow-lg shadow-violet-500/20"
                    >
                        {sending
                            ? <Loader2 size={16} className="animate-spin" />
                            : <Send size={16} />
                        }
                    </button>
                </form>
                <p className="text-gray-700 text-xs mt-2 px-1">
                    Press Enter to send · Shift+Enter for new line
                </p>
            </div>

        </div>
    );
};

export default ChatWindow;

// © 2026 Hassan Javed — All Rights Reserved