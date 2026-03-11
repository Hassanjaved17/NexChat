// ============================================================
//  NEXCHAT — useRooms.js
//  Realtime Database hook for rooms
//  Author  : Hassan Javed
//  GitHub  : https://github.com/Hassanjaved17
//  Built   : March 2026
//  © 2026 Hassan Javed — All Rights Reserved
// ============================================================

import { useState, useEffect }  from "react";
import { db }                   from "../firebase/firebase";
import {
  ref, push, onValue, off, serverTimestamp, get,
} from "firebase/database";

// ── Global room always exists ─────────────────────────────────
export const GLOBAL_ROOM = {
  id:   "global",
  name: "Global",
  isGlobal: true,
};

const useRooms = (user) => {
  const [rooms, setRooms]       = useState([GLOBAL_ROOM]);
  const [loading]   = useState(false);

  // ── Listen to all rooms ───────────────────────────────────
  useEffect(() => {
    if (!user) return;
    const roomsRef = ref(db, "rooms");

    const unsubscribe = onValue(roomsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const parsed = Object.entries(data)
          .filter(([id]) => id !== "global")
          .map(([id, room]) => ({ id, ...room }));
        setRooms([GLOBAL_ROOM, ...parsed]);
      } else {
        setRooms([GLOBAL_ROOM]);
      }
    });

    return () => off(roomsRef, "value", unsubscribe);
  }, [user]);

  // ── Create private room ───────────────────────────────────
  const createRoom = async (name) => {
    if (!name.trim()) return null;
    const roomsRef  = ref(db, "rooms");
    const newRoom   = await push(roomsRef, {
      name:      name.trim(),
      createdBy: user.uid,
      createdAt: serverTimestamp(),
      isGlobal:  false,
    });
    return newRoom.key;
  };

  // ── Join room by id ───────────────────────────────────────
  const joinRoom = async (roomId) => {
    const roomRef  = ref(db, `rooms/${roomId}`);
    const snapshot = await get(roomRef);
    if (snapshot.exists()) {
      return { id: roomId, ...snapshot.val() };
    }
    return null;
  };

  return { rooms, loading, createRoom, joinRoom };
};

export default useRooms;

// © 2026 Hassan Javed — All Rights Reserved