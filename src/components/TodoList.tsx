import { useTodos } from "../hooks/useTodos";

const TodoList = () => {
  const { todos, toggleTodoById, removeTodoById } = useTodos();

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
            className="group flex items-center justify-between bg-neutral-900/30 p-3 rounded-none border border-transparent hover:border-accent/30 transition-colors"
          >
            <div className="flex items-center gap-3 overflow-hidden flex-1">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodoById(todo.id)}
                className="w-4 h-4 rounded-none border-slate-700 bg-black text-accent focus:ring-accent/50 cursor-pointer transition-colors"
              />
              <span
                className={`text-sm break-words flex-1 ${todo.completed ? "line-through text-slate-600" : "text-slate-300"}`}
              >
                {todo.text}
              </span>
            </div>

            <button
              onClick={() => removeTodoById(todo.id)}
              className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all px-2 text-xs"
              title="Delete task"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoList;
