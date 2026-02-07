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
    <div className="text-center">
      {/* 
         Display Time 
         We use `toLocaleTimeString` for automatic locale formatting.
         options: removes seconds for a cleaner, modern look.
      */}
      <div className="text-5xl font-bold tracking-tight text-white">
        {time.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </div>

      {/* 
         Display Date 
         Using `undefined` as the first argument uses the user's browser language.
      */}
      <div className="text-slate-400 mt-2 text-lg">
        {time.toLocaleDateString(undefined, {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
      </div>
    </div>
  );
};

export default Clock;
