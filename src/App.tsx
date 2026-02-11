import Bookmarks from "./components/Bookmarks";
import Clock from "./components/Clock";
import TodoList from "./components/TodoList";
import Weather from "./components/Weather";
import CmdPrompt from "./components/CmdPrompt";

function App() {
  return (
    <div className="min-h-screen bg-neutral-950 text-slate-100 p-8">
      {/* Grid Container */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Time & Weather */}
        <div className="space-y-8">
          <div className="p-6 bg-neutral-950 rounded-xl  ">
            <Clock />
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
