import React, { useState, useEffect, useRef } from "react";

interface PomodoroProps {
  focusMinutes: number;
  breakMinutes: number;
}

/**
 * COMPONENT: Pomodoro
 * A productivity timer that toggles between Focus and Break sessions.
 */
const Pomodoro: React.FC<PomodoroProps> = ({ focusMinutes, breakMinutes }) => {
  // --- Timer State ---
  // Atomic state object to keep timer values synchronized
  const [session, setSession] = useState({
    isFocus: true,               // Current mode: Focus (true) or Break (false)
    timeLeft: focusMinutes * 60, // Remaining seconds in current session
    totalFocusSeconds: 0,        // Running tally of total focus time today
  });

  /**
   * ENGINE: The Ticker
   * Runs every 1 second to decrement time and handle session transitions.
   */
  useEffect(() => {
    const timerId = window.setInterval(() => {
      setSession((prev) => {
        // 1. If session is still active, decrement time
        if (prev.timeLeft > 0) {
          return {
            ...prev,
            timeLeft: prev.timeLeft - 1,
            // Only increment tally during focus sessions
            totalFocusSeconds: prev.isFocus
              ? prev.totalFocusSeconds + 1
              : prev.totalFocusSeconds,
          };
        }

        // 2. If timer hits zero, switch modes
        const nextIsFocus = !prev.isFocus;
        return {
          ...prev,
          isFocus: nextIsFocus,
          // Reset timer to next mode's duration
          timeLeft: (nextIsFocus ? focusMinutes : breakMinutes) * 60,
        };
      });
    }, 1000);

    // CLEANUP: Always clear interval on unmount to prevent memory leaks/zombie timers
    return () => clearInterval(timerId);
  }, [focusMinutes, breakMinutes]);

  /**
   * SIDE EFFECT: Browser Notifications
   * Alerts the user when a session switches.
   */
  const lastIsFocus = useRef(session.isFocus);
  useEffect(() => {
    // Only notify if the session type actually changed
    if (lastIsFocus.current !== session.isFocus) {
      if (Notification.permission === "granted") {
        new Notification(session.isFocus ? "Focus Time!" : "Break Time!", {
          body: session.isFocus
            ? "Time to get back to work."
            : "Take a short break.",
        });
      }
      lastIsFocus.current = session.isFocus;
    }
  }, [session.isFocus]);

  /**
   * ON MOUNT: Request Notification permissions
   */
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  /**
   * FORMATTER: MM:SS
   */
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  /**
   * FORMATTER: Human readable accumulation (e.g. 1h 20m)
   */
  const formatTotalTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const parts = [];
    if (hrs > 0) parts.push(`${hrs}h`);
    if (mins > 0 || hrs > 0) parts.push(`${mins}m`);
    return parts.length > 0 ? parts.join(" ") : "0m";
  };

  return (
    <div className="text-center w-full overflow-hidden">
      {/* Primary Display */}
      <div className="text-6xl font-normal tracking-tighter text-white font-ndot uppercase">
        {formatTime(session.timeLeft)}
      </div>
      
      {/* Session Label */}
      <div
        className={`mt-2 text-sm font-normal tracking-[0.2em] uppercase font-bebas ${session.isFocus ? "text-accent" : "text-slate-500"}`}
      >
        {session.isFocus ? "Focus Session" : "Break Time"}
      </div>
      
      {/* Productivity Stats */}
      <div className="text-slate-600 text-[10px] mt-2 font-bebas uppercase tracking-widest truncate px-2">
        Total focus: {formatTotalTime(session.totalFocusSeconds)}
      </div>
    </div>
  );
};

export default Pomodoro;
