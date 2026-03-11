// ============================================================
//  NEXCHAT — usePresence.js
//  Firebase Realtime DB presence system
//  Author  : Hassan Javed
//  GitHub  : https://github.com/Hassanjaved17
//  Built   : March 2026
//  © 2026 Hassan Javed — All Rights Reserved
// ============================================================

import { useEffect, useState }  from "react";
import { db }                   from "../firebase/firebase";
import {
  ref, onValue, off, onDisconnect, set, remove, serverTimestamp,
} from "firebase/database";

const usePresence = (user, roomId) => {
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!user || !roomId) return;

    // ── Write presence when user joins room ───────────────
    const presenceRef = ref(db, `presence/${roomId}/${user.uid}`);

    set(presenceRef, {
      displayName: user.displayName || "Anonymous",
      uid:         user.uid,
      joinedAt:    serverTimestamp(),
    });

    // ── Auto remove on disconnect ─────────────────────────
    onDisconnect(presenceRef).remove();

    // ── Listen to all online users in room ────────────────
    const roomPresenceRef = ref(db, `presence/${roomId}`);

    const unsubscribe = onValue(roomPresenceRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const users = Object.values(data);
        setOnlineUsers(users);
      } else {
        setOnlineUsers([]);
      }
    });

    // ── Cleanup — remove presence + listener on unmount ──
    return () => {
      remove(presenceRef);
      off(roomPresenceRef, "value", unsubscribe);
    };
  }, [user, roomId]);

  return { onlineUsers, onlineCount: onlineUsers.length };
};

export default usePresence;

// © 2026 Hassan Javed — All Rights Reserved