import { useState, useEffect } from "react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const TodoList = () => {
  // -----------------------------------------------------------------
  // 1. STATE
  // -----------------------------------------------------------------
  // 'text' tracks what the user is currently typing in the input box
  const [text, setText] = useState("");

  // 'todos' is our list of objects.
  // We initialize it from localStorage if it exists.
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem("dashboard_todos");
    return saved ? JSON.parse(saved) : [];
  });

  // -----------------------------------------------------------------
  // 2. EFFECTS
  // -----------------------------------------------------------------
  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("dashboard_todos", JSON.stringify(todos));
  }, [todos]);

  // -----------------------------------------------------------------
  // 3. ACTIONS (The Logic)
  // -----------------------------------------------------------------

  // ADD A NEW TASK
  const addTodo = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault(); // Stop form from refreshing the page
    if (!text.trim()) return; // Prevent adding empty blank tasks

    const newTodo: Todo = {
      id: Date.now(), // Simple unique ID based on timestamp
      text: text,
      completed: false,
    };

    // Create a NEW array with the old items + the new item
    setTodos([...todos, newTodo]);

    setText(""); // Clear the input field
  };

  // TOGGLE COMPLETE (Check/Uncheck)
  const toggleTodo = (id: number) => {
    // We map through the array. If the ID matches, we flip 'completed'.
    // If it doesn't match, we leave the item alone.
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  // DELETE TASK
  const deleteTodo = (id: number) => {
    // Filter out the item with this specific ID.
    // Keep everything where todo.id is NOT equal to the id we want to delete.
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // -----------------------------------------------------------------
  // 3. RENDER (The UI)
  // -----------------------------------------------------------------
  return (
    <div className="h-full flex flex-col">
      {/* INPUT FORM */}
      <form onSubmit={addTodo} className="flex gap-2 mb-4">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a new task..."
          className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {/* <button */}
        {/*   type="submit" */}
        {/*   className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded font-medium transition-colors" */}
        {/* > */}
        {/*   Add */}
        {/* </button> */}
      </form>

      {/* TODO LIST */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-2">
        {/* Empty State Message */}
        {todos.length === 0 && (
          <p className="text-slate-500 text-center italic mt-4">
            No tasks for today!
          </p>
        )}

        {/* Map through todos to display them */}
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="group flex items-center justify-between bg-slate-700/50 p-3 rounded hover:bg-slate-700 transition-colors"
          >
            {/* Left side: Checkbox + Text */}
            <div className="flex items-center gap-3 overflow-hidden">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="w-5 h-5 rounded border-slate-500 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span
                className={`truncate ${todo.completed ? "line-through text-slate-500" : "text-slate-200"}`}
              >
                {todo.text}
              </span>
            </div>

            {/* Right side: Delete Button (Only shows on hover thanks to 'group-hover') */}
            <button
              onClick={() => deleteTodo(todo.id)}
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
