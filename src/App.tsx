import { useState, useEffect } from "react";
import Bookmarks from "./components/Bookmarks";
import Clock from "./components/Clock";
import Pomodoro from "./components/Pomodoro";
import TodoList from "./components/TodoList";
import Weather from "./components/Weather";
import Notes from "./components/Notes";
import CmdPrompt from "./components/CmdPrompt";
import HackerNews from "./components/HackerNews";

function App() {
  const [pomoSettings, setPomoSettings] = useState<{
    focus: number;
    break: number;
  } | null>(null);

  useEffect(() => {
    const handlePomoStart = (
      event: CustomEvent<{ focus: number; break: number }>,
    ) => {
      setPomoSettings(event.detail);
    };
    const handlePomoEnd = () => {
      setPomoSettings(null);
    };

    window.addEventListener("pomo-start", handlePomoStart as EventListener);
    window.addEventListener("pomo-end", handlePomoEnd);

    return () => {
      window.removeEventListener(
        "pomo-start",
        handlePomoStart as EventListener,
      );
      window.removeEventListener("pomo-end", handlePomoEnd);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-slate-100 p-2 overflow-hidden font-mono">
      {/* Grid Container */}
      <div className="h-[calc(100vh-1rem)] grid grid-cols-1 md:grid-cols-12 md:grid-rows-3 gap-2">
        
        {/* Column 1: Left (Clock & Weather) */}
        <div className="md:col-span-3 md:row-span-1 p-4 bg-black border border-slate-900 hover:border-accent/40 rounded-none relative flex items-center justify-center group transition-colors">
          {pomoSettings ? (
            <Pomodoro
              key={`${pomoSettings.focus}-${pomoSettings.break}`}
              focusMinutes={pomoSettings.focus}
              breakMinutes={pomoSettings.break}
            />
          ) : (
            <Clock />
          )}
          <span className="absolute bottom-1 right-1 px-1 bg-black text-[10px] text-slate-500 font-mono uppercase border border-slate-900 group-hover:text-accent group-hover:border-accent/30 transition-colors">{pomoSettings ? "pomodoro" : "clock"}</span>
        </div>

        {/* Column 2: Center (CMD Prompt - Row 1 & 2) */}
        <div className="md:col-span-6 md:row-span-2 p-4 bg-black border border-slate-900 hover:border-accent/40 rounded-none relative overflow-hidden group transition-colors">
          <CmdPrompt />
          <span className="absolute bottom-1 right-1 px-1 bg-black text-[10px] text-slate-500 font-mono uppercase border border-slate-900 group-hover:text-accent group-hover:border-accent/30 transition-colors">cmd</span>
        </div>

        {/* Column 3: Right (Todo List - Row 1 & 2) */}
        <div className="md:col-span-3 md:row-span-2 p-4 bg-black border border-slate-900 hover:border-accent/40 rounded-none relative overflow-hidden group transition-colors">
          <TodoList />
          <span className="absolute bottom-1 right-1 px-1 bg-black text-[10px] text-slate-500 font-mono uppercase border border-slate-900 group-hover:text-accent group-hover:border-accent/30 transition-colors">tasks</span>
        </div>

        {/* Column 1: Left (Weather - Row 2) */}
        <div className="md:col-span-3 md:row-span-1 p-4 bg-black border border-slate-900 hover:border-accent/40 rounded-none relative flex items-center justify-center group transition-colors">
          <Weather />
          <span className="absolute bottom-1 right-1 px-1 bg-black text-[10px] text-slate-500 font-mono uppercase border border-slate-900 group-hover:text-accent group-hover:border-accent/30 transition-colors">weather</span>
        </div>

        {/* Row 3: Left (Notes) */}
        <div className="md:col-span-3 md:row-span-1 p-4 bg-black border border-slate-900 hover:border-accent/40 rounded-none relative overflow-hidden group transition-colors">
          <Notes />
          <span className="absolute bottom-1 right-1 px-1 bg-black text-[10px] text-slate-500 font-mono uppercase border border-slate-900 group-hover:text-accent group-hover:border-accent/30 transition-colors">notes</span>
        </div>

        {/* Row 3: Center (Hacker News) */}
        <div className="md:col-span-6 md:row-span-1 p-4 bg-black border border-slate-900 hover:border-accent/40 rounded-none relative overflow-hidden group transition-colors">
          <HackerNews />
          <span className="absolute bottom-1 right-1 px-1 bg-black text-[10px] text-slate-500 font-mono uppercase border border-slate-900 group-hover:text-accent group-hover:border-accent/30 transition-colors">hackernews</span>
        </div>

        {/* Row 3: Right (Bookmarks) */}
        <div className="md:col-span-3 md:row-span-1 p-4 bg-black border border-slate-900 hover:border-accent/40 rounded-none relative overflow-hidden group transition-colors">
          <Bookmarks />
          <span className="absolute bottom-1 right-1 px-1 bg-black text-[10px] text-slate-500 font-mono uppercase border border-slate-900 group-hover:text-accent group-hover:border-accent/30 transition-colors">bookmarks</span>
        </div>
      </div>
    </div>
  );
}

export default App;
