import { useState, useEffect } from "react";

const Clock = () => {
  // -----------------------------------------------------------------
  // 1. STATE: The "Memory"
  // -----------------------------------------------------------------
  // We use `useState` because when this variable changes, we want React
  // to automatically re-paint the screen.
  // We initialize it with `new Date()` so it shows the time immediately
  // and doesn't wait for the first tick.
  const [time, setTime] = useState(new Date());

  // -----------------------------------------------------------------
  // 2. EFFECT: The "Engine"
  // -----------------------------------------------------------------
  // `useEffect` lets us run code that isn't just calculating UI (like timers).
  useEffect(() => {
    // Create an interval that runs every 1000 milliseconds (1 second)
    const timerId = setInterval(() => {
      // Every tick, we create a fresh Date object.
      // Calling `setTime` triggers React to re-render this component.
      setTime(new Date());
    }, 1000);

    // CLEANUP FUNCTION
    // This is crucial. If the user navigates away or this component is removed
    // from the screen, this function runs. It kills the timer.
    // Without this, the timer would keep running in the background (Memory Leak).
    return () => clearInterval(timerId);
  }, []);
  // The empty dependency array [] tells React:
  // "Only start this timer ONCE when the component first mounts."
  // If we omitted this, it might try to create a new timer on every single render!

  // -----------------------------------------------------------------
  // 3. RENDER: The "View"
  // -----------------------------------------------------------------
  return (
    <div className="text-center w-full overflow-hidden">
      <div className="text-7xl font-normal tracking-tighter text-white font-ndot uppercase">
        {time.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
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
