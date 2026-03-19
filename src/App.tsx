import Bookmarks from "./components/Bookmarks";
import Clock from "./components/Clock";
import Pomodoro from "./components/Pomodoro";
import TodoList from "./components/TodoList";
import Weather from "./components/Weather";
import Notes from "./components/Notes";
import CmdPrompt from "./components/CmdPrompt";
import HackerNews from "./components/HackerNews";
import { useDashboard } from "./context/DashboardContext";

/**
 * COMPONENT: Dashboard App
 * The main layout container for the entire dashboard.
 * Uses a complex CSS Grid to arrange widgets based on screen size.
 */
function App() {
  // We only pull pomoSettings here to determine whether to show the Clock or the Pomodoro timer.
  const { pomoSettings } = useDashboard();

  return (
    <div className="min-h-screen bg-black text-slate-100 p-2 overflow-hidden font-mono">
      {/* 
          GRID CONTAINER
          - 12 columns on desktop for fine-grained control.
          - 3 rows to separate top, middle, and bottom content.
          - gap-2 for minimal "Nothing" style spacing.
      */}
      <div className="h-[calc(100vh-1rem)] grid grid-cols-1 md:grid-cols-12 md:grid-rows-3 gap-2">
        
        {/* LEFT COLUMN: Time & Environmental info */}
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
          <span className="absolute bottom-1 right-1 px-1 bg-black text-[10px] text-slate-500 font-ndot uppercase border border-slate-900 group-hover:text-accent group-hover:border-accent/30 transition-colors">
            {pomoSettings ? "pomodoro" : "clock"}
          </span>
        </div>

        {/* CENTER COLUMN: The Command Engine (Primary Interaction) */}
        <div className="md:col-span-6 md:row-span-2 p-4 bg-black border border-slate-900 hover:border-accent/40 rounded-none relative overflow-hidden group transition-colors">
          <CmdPrompt />
          <span className="absolute bottom-1 right-1 px-1 bg-black text-[10px] text-slate-500 font-ndot uppercase border border-slate-900 group-hover:text-accent group-hover:border-accent/30 transition-colors">
            cmd
          </span>
        </div>

        {/* RIGHT COLUMN: Productivity / Tasks */}
        <div className="md:col-span-3 md:row-span-2 p-4 bg-black border border-slate-900 hover:border-accent/40 rounded-none relative overflow-hidden group transition-colors">
          <TodoList />
          <span className="absolute bottom-1 right-1 px-1 bg-black text-[10px] text-slate-500 font-ndot uppercase border border-slate-900 group-hover:text-accent group-hover:border-accent/30 transition-colors">
            tasks
          </span>
        </div>

        {/* LEFT COLUMN (Row 2): Weather Widget */}
        <div className="md:col-span-3 md:row-span-1 p-4 bg-black border border-slate-900 hover:border-accent/40 rounded-none relative flex items-center justify-center group transition-colors">
          <Weather />
          <span className="absolute bottom-1 right-1 px-1 bg-black text-[10px] text-slate-500 font-ndot uppercase border border-slate-900 group-hover:text-accent group-hover:border-accent/30 transition-colors">
            weather
          </span>
        </div>

        {/* BOTTOM ROW: Notes (Personal Storage) */}
        <div className="md:col-span-3 md:row-span-1 p-4 bg-black border border-slate-900 hover:border-accent/40 rounded-none relative overflow-hidden group transition-colors">
          <Notes />
          <span className="absolute bottom-1 right-1 px-1 bg-black text-[10px] text-slate-500 font-ndot uppercase border border-slate-900 group-hover:text-accent group-hover:border-accent/30 transition-colors">
            notes
          </span>
        </div>

        {/* BOTTOM ROW: Hacker News (Live Feed) */}
        <div className="md:col-span-6 md:row-span-1 p-4 bg-black border border-slate-900 hover:border-accent/40 rounded-none relative overflow-hidden group transition-colors">
          <HackerNews />
          <span className="absolute bottom-1 right-1 px-1 bg-black text-[10px] text-slate-500 font-ndot uppercase border border-slate-900 group-hover:text-accent group-hover:border-accent/30 transition-colors">
            hackernews
          </span>
        </div>

        {/* BOTTOM ROW: Bookmarks (Speed Dial) */}
        <div className="md:col-span-3 md:row-span-1 p-4 bg-black border border-slate-900 hover:border-accent/40 rounded-none relative overflow-hidden group transition-colors">
          <Bookmarks />
          <span className="absolute bottom-1 right-1 px-1 bg-black text-[10px] text-slate-500 font-ndot uppercase border border-slate-900 group-hover:text-accent group-hover:border-accent/30 transition-colors">
            bookmarks
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;
