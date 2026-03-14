// ============================================================
//  NEXCHAT — useNotification.js
//  Sound notification using Web Audio API — no files needed!
//  Author  : Hassan Javed
//  GitHub  : https://github.com/Hassanjaved17
//  Built   : March 2026
//  © 2026 Hassan Javed — All Rights Reserved
// ============================================================

import { useRef, useCallback } from "react";

const useNotification = () => {
  const audioCtxRef = useRef(null);

  // ── Get or create AudioContext ────────────────────────────
  const getCtx = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtxRef.current;
  };

  // ── Play soft "pop" notification sound ───────────────────
  // Telegram/iMessage style — clean, subtle, professional
  const playNotification = useCallback(() => {
    try {
      const ctx      = getCtx();
      const now      = ctx.currentTime;

      // ── Oscillator — sine wave for soft tone ─────────────
      const osc      = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Frequency: 880Hz → 660Hz (descending soft pop)
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.1);

      // Volume: soft fade in + quick fade out
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.15, now + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch (err) {
      // Silently fail — sound is not critical
      console.warn("Notification sound failed:", err);
    }
  }, []);

  // ── Play send sound — slightly different tone ─────────────
  const playSend = useCallback(() => {
    try {
      const ctx      = getCtx();
      const now      = ctx.currentTime;

      const osc      = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Higher pitch ascending — confirms message sent
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.08);

      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.1, now + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch (err) {
      console.warn("Send sound failed:", err);
    }
  }, []);

  return { playNotification, playSend };
};

export default useNotification;

// © 2026 Hassan Javed — All Rights Reserved