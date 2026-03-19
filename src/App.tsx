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
        {/* Row 1 & 2: CMD */}
        <div className="md:col-span-6 md:row-span-2 p-4 bg-black border border-slate-700 rounded-none relative overflow-hidden group">
          <CmdPrompt />
          <span className="absolute bottom-1 right-1 px-1 bg-black text-[10px] text-slate-500 font-mono uppercase border border-slate-800 group-hover:text-blue-400 group-hover:border-blue-900 transition-colors">cmd</span>
        </div>

        {/* Row 1: Clock / Pomodoro */}
        <div className="md:col-span-3 md:row-span-1 p-4 bg-black border border-slate-700 rounded-none relative flex items-center justify-center group">
          {pomoSettings ? (
            <Pomodoro
              key={`${pomoSettings.focus}-${pomoSettings.break}`}
              focusMinutes={pomoSettings.focus}
              breakMinutes={pomoSettings.break}
            />
          ) : (
            <Clock />
          )}
          <span className="absolute bottom-1 right-1 px-1 bg-black text-[10px] text-slate-500 font-mono uppercase border border-slate-800 group-hover:text-blue-400 group-hover:border-blue-900 transition-colors">{pomoSettings ? "pomodoro" : "clock"}</span>
        </div>

        {/* Row 1 & 2: Todo List */}
        <div className="md:col-span-3 md:row-span-2 p-4 bg-black border border-slate-700 rounded-none relative overflow-hidden group">
          <TodoList />
          <span className="absolute bottom-1 right-1 px-1 bg-black text-[10px] text-slate-500 font-mono uppercase border border-slate-800 group-hover:text-blue-400 group-hover:border-blue-900 transition-colors">tasks</span>
        </div>

        {/* Row 2: Weather */}
        <div className="md:col-span-3 md:row-span-1 p-4 bg-black border border-slate-700 rounded-none relative flex items-center justify-center group">
          <Weather />
          <span className="absolute bottom-1 right-1 px-1 bg-black text-[10px] text-slate-500 font-mono uppercase border border-slate-800 group-hover:text-blue-400 group-hover:border-blue-900 transition-colors">weather</span>
        </div>

        {/* Row 3: Hacker News */}
        <div className="md:col-span-6 md:row-span-1 p-4 bg-black border border-slate-700 rounded-none relative overflow-hidden group">
          <HackerNews />
          <span className="absolute bottom-1 right-1 px-1 bg-black text-[10px] text-slate-500 font-mono uppercase border border-slate-800 group-hover:text-blue-400 group-hover:border-blue-900 transition-colors">hackernews</span>
        </div>

        {/* Row 3: Notes */}
        <div className="md:col-span-3 md:row-span-1 p-4 bg-black border border-slate-700 rounded-none relative overflow-hidden group">
          <Notes />
          <span className="absolute bottom-1 right-1 px-1 bg-black text-[10px] text-slate-500 font-mono uppercase border border-slate-800 group-hover:text-blue-400 group-hover:border-blue-900 transition-colors">notes</span>
        </div>

        {/* Row 3: Bookmarks */}
        <div className="md:col-span-3 md:row-span-1 p-4 bg-black border border-slate-700 rounded-none relative overflow-hidden group">
          <Bookmarks />
          <span className="absolute bottom-1 right-1 px-1 bg-black text-[10px] text-slate-500 font-mono uppercase border border-slate-800 group-hover:text-blue-400 group-hover:border-blue-900 transition-colors">bookmarks</span>
        </div>
      </div>
    </div>
  );
}

export default App;
