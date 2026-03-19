import { useDashboard } from "../context/DashboardContext";

const TodoList = () => {
  const { todos, toggleTodoById, removeTodoById } = useDashboard();

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto pr-2 space-y-2">
        {todos.length === 0 && (
          <p className="text-slate-500 text-center italic mt-4">
            No tasks for today!
          </p>
        )}

        {todos.map((todo) => (
          <div
            key={todo.id}
            className="group flex items-center justify-between bg-neutral-900/10 p-3 rounded-none border border-transparent hover:border-accent/20 transition-all"
          >
            <div className="flex items-center gap-4 overflow-hidden flex-1">
              <label className="relative flex items-center justify-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodoById(todo.id)}
                  className="peer sr-only"
                />
                <div className="w-4 h-4 border border-slate-700 bg-black peer-checked:border-accent transition-colors"></div>
                <div className="absolute w-1.5 h-1.5 bg-accent opacity-0 peer-checked:opacity-100 transition-opacity"></div>
              </label>
              <span
                className={`text-sm break-words flex-1 font-poppins transition-colors ${todo.completed ? "line-through text-slate-700" : "text-slate-300"}`}
              >
                {todo.text}
              </span>
            </div>

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
