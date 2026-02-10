import Bookmarks from "./components/Bookmarks";
import Clock from "./components/Clock";
import TodoList from "./components/TodoList";
import Weather from "./components/Weather";

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      {/* Grid Container */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Time & Weather */}
        <div className="space-y-8">
          <div className="p-6 bg-slate-800 rounded-xl shadow-lg border border-slate-700">
            <Clock />
          </div>

          <div className="p-6 bg-slate-800 rounded-xl shadow-lg border border-slate-700">
            <Weather />
          </div>
        </div>

        {/* Right Column: Todos & Links */}
        <div className="space-y-8">
          <div className="p-6 bg-slate-800 rounded-xl shadow-lg border border-slate-700">
            <TodoList />
          </div>

          <div className="p-6 bg-slate-800 rounded-xl shadow-lg border border-slate-700">
            <Bookmarks />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
