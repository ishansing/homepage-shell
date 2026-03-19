import { useState, useEffect } from "react";

/**
 * COMPONENT: Clock
 * A high-visibility time and date display using Nothing Phone aesthetics.
 */
const Clock = () => {
  // Local state to track the current time, updated every tick.
  const [time, setTime] = useState(new Date());

  /**
   * ENGINE: The Ticker
   * Synchronizes the component with the system clock every 1 second.
   */
  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // CLEANUP: Stop the interval when the widget is swapped for Pomodoro
    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="text-center w-full overflow-hidden">
      {/* 
          TIME DISPLAY
          - Uses NDot55 font for the "Nothing" look.
          - 2-digit formatting for clean alignment.
      */}
      <div className="text-6xl font-normal tracking-tighter text-white font-ndot uppercase">
        {time.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>

      {/* 
          DATE DISPLAY
          - Uses Bebas font for secondary information.
          - High letter spacing (tracking) for a premium minimal feel.
      */}
      <div className="text-slate-500 mt-2 text-sm font-bebas tracking-[0.2em] uppercase truncate px-2">
        {time.toLocaleDateString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
        })}
      </div>
    </div>
  );
};

export default Clock;
