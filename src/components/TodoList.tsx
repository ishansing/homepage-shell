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
            className="group flex items-center justify-between bg-slate-900/50 p-3 rounded-none border border-slate-900 hover:bg-slate-900 hover:border-slate-800 transition-colors"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodoById(todo.id)}
                className="w-5 h-5 rounded border-slate-500 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span
                className={`truncate ${todo.completed ? "line-through text-slate-500" : "text-slate-200"}`}
              >
                {todo.text}
              </span>
            </div>

            <button
              onClick={() => removeTodoById(todo.id)}
              className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity px-2"
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
