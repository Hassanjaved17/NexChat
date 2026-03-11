// ============================================================
//  NEXCHAT — useUnread.js
//  Unread message count per room
//  Author  : Hassan Javed
//  GitHub  : https://github.com/Hassanjaved17
//  Built   : March 2026
//  © 2026 Hassan Javed — All Rights Reserved
// ============================================================

import { useEffect, useState, useRef } from "react";
import { db } from "../firebase/firebase";
import { ref, onValue, off } from "firebase/database";

const useUnread = (rooms, activeRoomId) => {
    const [unreadCounts, setUnreadCounts] = useState({});
    const lastSeenTimestamps = useRef({});
    const messageCountsRef = useRef({});

    const updateUnread = (roomId, currentActiveRoomId) => {
        // Don't count unread for active room
        if (roomId === currentActiveRoomId) {
            setUnreadCounts((prev) => ({ ...prev, [roomId]: 0 }));
            return;
        }

        const messages = messageCountsRef.current[roomId] || [];
        const lastSeen = lastSeenTimestamps.current[roomId] ?? 0;
        const unread = messages.filter(
            (m) => (m.timestamp ?? 0) > lastSeen
        ).length;

        setUnreadCounts((prev) => ({ ...prev, [roomId]: unread }));
    };

    useEffect(() => {
        if (!rooms || rooms.length === 0) return;

        const unsubscribers = [];

        rooms.forEach((room) => {
            const messagesRef = ref(db, `rooms/${room.id}/messages`);

            const unsubscribe = onValue(messagesRef, (snapshot) => {
                const data = snapshot.val();
                if (!data) {
                    messageCountsRef.current[room.id] = [];
                    updateUnread(room.id, activeRoomId);
                    return;
                }

                const messages = Object.values(data);
                messageCountsRef.current[room.id] = messages;
                updateUnread(room.id, activeRoomId);
            });

            unsubscribers.push(() => off(messagesRef, "value", unsubscribe));
        });

        return () => unsubscribers.forEach((unsub) => unsub());
    }, [rooms, activeRoomId]);

    // ── Recalculate when active room changes ──────────────────
    useEffect(() => {
        if (!activeRoomId) return;

        // Mark current room as seen — store latest timestamp
        const messages = messageCountsRef.current[activeRoomId] || [];
        const latest = messages.reduce((max, m) => Math.max(max, m.timestamp ?? 0), 0);
        lastSeenTimestamps.current[activeRoomId] = latest;

        // Clear unread for active room
        setUnreadCounts((prev) => ({ ...prev, [activeRoomId]: 0 }));
    }, [activeRoomId]);



    return { unreadCounts };
};

export default useUnread;

// © 2026 Hassan Javed — All Rights Reserved