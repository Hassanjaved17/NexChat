// ============================================================
//  NEXCHAT — useTyping.js
//  Real-time typing indicator using Firebase Realtime DB
//  Author  : Hassan Javed
//  GitHub  : https://github.com/Hassanjaved17
//  Built   : March 2026
//  © 2026 Hassan Javed — All Rights Reserved
// ============================================================

import { useEffect, useState, useRef, useCallback } from "react";
import { db }                from "../firebase/firebase";
import {
  ref, set, remove, onValue, off, serverTimestamp,
} from "firebase/database";

const useTyping = (user, roomId) => {
  const [typingUsers, setTypingUsers] = useState([]);
  const typingTimeoutRef              = useRef(null);
  const isTypingRef                   = useRef(false);

  // ── Listen to typing users in room ────────────────────────
  useEffect(() => {
    if (!user || !roomId) return;

    const typingRef = ref(db, `typing/${roomId}`);

    const unsubscribe = onValue(typingRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Filter out current user
        const others = Object.values(data).filter(
          (t) => t.uid !== user.uid
        );
        setTypingUsers(others);
      } else {
        setTypingUsers([]);
      }
    });

    return () => {
      off(typingRef, "value", unsubscribe);
      // Clean up own typing on unmount
      const myTypingRef = ref(db, `typing/${roomId}/${user.uid}`);
      remove(myTypingRef);
    };
  }, [user, roomId]);

  // ── Set typing status ─────────────────────────────────────
  const setTyping = useCallback(async () => {
    if (!user || !roomId) return;

    const myTypingRef = ref(db, `typing/${roomId}/${user.uid}`);

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      await set(myTypingRef, {
        uid:         user.uid,
        displayName: user.displayName || "Anonymous",
        timestamp:   serverTimestamp(),
      });
    }

    // ── Auto stop typing after 2.5s of no input ──────────
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(async () => {
      isTypingRef.current = false;
      await remove(myTypingRef);
    }, 2500);
  }, [user, roomId]);

  // ── Stop typing immediately (on send) ────────────────────
  const stopTyping = useCallback(async () => {
    if (!user || !roomId) return;
    clearTimeout(typingTimeoutRef.current);
    isTypingRef.current = false;
    const myTypingRef = ref(db, `typing/${roomId}/${user.uid}`);
    await remove(myTypingRef);
  }, [user, roomId]);

  // ── Format typing text ────────────────────────────────────
  const getTypingText = () => {
    if (typingUsers.length === 0) return null;
    if (typingUsers.length === 1)
      return `${typingUsers[0].displayName} is typing…`;
    if (typingUsers.length === 2)
      return `${typingUsers[0].displayName} and ${typingUsers[1].displayName} are typing…`;
    return "Several people are typing…";
  };

  return { typingUsers, setTyping, stopTyping, getTypingText };
};

export default useTyping;

// © 2026 Hassan Javed — All Rights Reserved