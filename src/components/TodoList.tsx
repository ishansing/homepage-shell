import { useDashboard } from "../context/DashboardContext";

/**
 * COMPONENT: TodoList
 * Manages personal tasks with a custom-styled "Nothing" checkbox system.
 */
const TodoList = () => {
  // Access global todo state and actions from centralized context
  const { todos, toggleTodoById, removeTodoById } = useDashboard();

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
        {/* Empty State */}
        {todos.length === 0 && (
          <p className="text-slate-700 text-center italic mt-8 font-poppins text-sm">
            No tasks for today.
          </p>
        )}

        {/* Task List */}
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="group flex items-center justify-between bg-neutral-900/10 p-3 rounded-none border border-transparent hover:border-accent/20 transition-all"
          >
            <div className="flex items-center gap-4 overflow-hidden flex-1">
              {/* CUSTOM CHECKBOX DESIGN */}
              <label className="relative flex items-center justify-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodoById(todo.id)}
                  className="peer sr-only" // Hide real checkbox
                />
                {/* The "Nothing" Square Frame */}
                <div className="w-4 h-4 border border-slate-700 bg-black peer-checked:border-accent transition-colors"></div>
                {/* The "Nothing" Dot indicator */}
                <div className="absolute w-1.5 h-1.5 bg-accent opacity-0 peer-checked:opacity-100 transition-opacity"></div>
              </label>

              {/* Task Text with line-through logic */}
              <span
                className={`text-sm break-words flex-1 font-poppins transition-colors ${
                  todo.completed ? "line-through text-slate-700" : "text-slate-300"
                }`}
              >
                {todo.text}
              </span>
            </div>

            {/* Quick Delete Action - Only visible on hover */}
            <button
              onClick={() => removeTodoById(todo.id)}
              className="text-slate-700 hover:text-red-900/80 opacity-0 group-hover:opacity-100 transition-all px-2 text-[10px] font-bebas uppercase tracking-widest"
              title="Delete task"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoList;
