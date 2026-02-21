import { useState, useEffect } from "react";
import Bookmarks from "./components/Bookmarks";
import Clock from "./components/Clock";
import Pomodoro from "./components/Pomodoro";
import TodoList from "./components/TodoList";
import Weather from "./components/Weather";
import CmdPrompt from "./components/CmdPrompt";
import CalendarToast from "./components/CalendarToast";

function App() {
  const [pomoSettings, setPomoSettings] = useState<{ focus: number; break: number } | null>(null);
  const [calendarConfig, setCalendarConfig] = useState<{ month?: number; year?: number; fullYear?: boolean } | null>(null);

  useEffect(() => {
    const handlePomoStart = (event: CustomEvent<{ focus: number; break: number }>) => {
      setPomoSettings(event.detail);
    };
    const handlePomoEnd = () => {
      setPomoSettings(null);
    };
    const handleShowCalendar = (event: CustomEvent<{ month?: number; year?: number; fullYear?: boolean }>) => {
      setCalendarConfig(event.detail);
    };

    window.addEventListener("pomo-start", handlePomoStart as EventListener);
    window.addEventListener("pomo-end", handlePomoEnd);
    window.addEventListener("show-calendar", handleShowCalendar as EventListener);

    return () => {
      window.removeEventListener("pomo-start", handlePomoStart as EventListener);
      window.removeEventListener("pomo-end", handlePomoEnd);
      window.removeEventListener("show-calendar", handleShowCalendar as EventListener);
    };
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-slate-100 p-8">
      {calendarConfig && (
        <CalendarToast 
          {...calendarConfig} 
          onClose={() => setCalendarConfig(null)} 
        />
      )}
      {/* Grid Container */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Time & Weather */}
        <div className="space-y-8">
          <div className="p-6 bg-neutral-950 rounded-xl  ">
            {pomoSettings ? (
              <Pomodoro 
                key={`${pomoSettings.focus}-${pomoSettings.break}`}
                focusMinutes={pomoSettings.focus} 
                breakMinutes={pomoSettings.break} 
              />
            ) : (
              <Clock />
            )}
          </div>

          <div className="p-6 bg-neutral-950 rounded-xl  ">
            <Weather />
          </div>
        </div>

        {/* Right Column: Todos & Links */}
        <div className="space-y-8">
          <div className="p-6 bg-neutral-950 rounded-xl  ">
            <TodoList />
          </div>

          <div className="p-6 bg-neutral-950 rounded-xl  ">
            <Bookmarks />
          </div>
        </div>

        {/* Bottom Span: Command Prompt */}
        <div className="md:col-span-2 p-6 bg-neutral-950 rounded-xl">
          <div className="h-64">
            <CmdPrompt />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
