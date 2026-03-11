// ============================================================
//  NEXCHAT — useMessages.js
//  Realtime Database hook for messages
//  Author  : Hassan Javed
//  GitHub  : https://github.com/Hassanjaved17
//  Built   : March 2026
//  © 2026 Hassan Javed — All Rights Reserved
// ============================================================

import { useState, useEffect }  from "react";
import { db }                   from "../firebase/firebase";
import {
  ref, push, remove, onValue, off, serverTimestamp,
} from "firebase/database";

const useMessages = (roomId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!roomId) return;
    setLoading(true);

    const messagesRef = ref(db, `rooms/${roomId}/messages`);

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const parsed = Object.entries(data).map(([id, msg]) => ({
          id,
          ...msg,
        }));
        // Sort by timestamp
        parsed.sort((a, b) => (a.timestamp ?? 0) - (b.timestamp ?? 0));
        setMessages(parsed);
      } else {
        setMessages([]);
      }
      setLoading(false);
    });

    return () => off(messagesRef, "value", unsubscribe);
  }, [roomId]);

  // ── Send message ──────────────────────────────────────────
  const sendMessage = async (text, user) => {
    if (!text.trim() || !roomId) return;
    const messagesRef = ref(db, `rooms/${roomId}/messages`);
    await push(messagesRef, {
      text:        text.trim(),
      uid:         user.uid,
      displayName: user.displayName || "Anonymous",
      timestamp:   serverTimestamp(),
    });
  };

  // ── Delete message ────────────────────────────────────────
  const deleteMessage = async (messageId) => {
    const msgRef = ref(db, `rooms/${roomId}/messages/${messageId}`);
    await remove(msgRef);
  };

  return { messages, loading, sendMessage, deleteMessage };
};

export default useMessages;

// © 2026 Hassan Javed — All Rights Reserved