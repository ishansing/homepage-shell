import React, { useState, useEffect, useRef } from "react";

interface PomodoroProps {
  focusMinutes: number;
  breakMinutes: number;
}

const Pomodoro: React.FC<PomodoroProps> = ({ focusMinutes, breakMinutes }) => {
  // Use a single state object for atomic updates
  const [session, setSession] = useState({
    isFocus: true,
    timeLeft: focusMinutes * 60,
    totalFocusSeconds: 0,
  });

  // Timer logic: runs every second to update session time and statistics.
  useEffect(() => {
    const timerId = window.setInterval(() => {
      setSession((prev) => {
        // While current session still has time left
        if (prev.timeLeft > 0) {
          return {
            ...prev,
            timeLeft: prev.timeLeft - 1,
            // Only increment total focus time if we are in a focus session
            totalFocusSeconds: prev.isFocus
              ? prev.totalFocusSeconds + 1
              : prev.totalFocusSeconds,
          };
        }

        // Transition to next mode when timer hits zero
        const nextIsFocus = !prev.isFocus;
        return {
          ...prev,
          isFocus: nextIsFocus,
          timeLeft: (nextIsFocus ? focusMinutes : breakMinutes) * 60,
        };
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [focusMinutes, breakMinutes]);

  // Handle side-effects like notifications separately
  const lastIsFocus = useRef(session.isFocus);
  useEffect(() => {
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

  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatTotalTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    // const secs = seconds % 60;
    const parts = [];
    if (hrs > 0) parts.push(`${hrs}h`);
    if (mins > 0 || hrs > 0) parts.push(`${mins}m`);
    // parts.push(`${secs}s`);
    return parts.join(" ");
  };

  return (
    <div className="text-center w-full overflow-hidden">
      <div className="text-5xl font-bold tracking-tighter text-white font-mono">
        {formatTime(session.timeLeft)}
      </div>
      <div
        className={`mt-2 text-sm font-bold tracking-[0.2em] uppercase ${session.isFocus ? "text-accent" : "text-slate-500"}`}
      >
        {session.isFocus ? "Focus" : "Break"}
      </div>
      <div className="text-slate-600 text-[10px] mt-2 font-mono uppercase tracking-tight truncate px-2">
        Total focus: {formatTotalTime(session.totalFocusSeconds)}
      </div>
    </div>
  );
};

export default Pomodoro;
