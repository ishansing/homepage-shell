import { useState, useEffect } from "react";

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem("dashboard_todos");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error("Failed to parse todos from localStorage", e);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("dashboard_todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    const handleAddTodo = (event: CustomEvent<string>) => {
      const text = event.detail;
      setTodos((prev) => [...prev, { id: Date.now(), text, completed: false }]);
    };

    const handleRemoveTodo = (event: CustomEvent<string>) => {
      const text = event.detail.toLowerCase();
      setTodos((prev) => prev.filter((t) => t.text.toLowerCase() !== text));
    };

    const handleToggleTodo = (event: CustomEvent<string>) => {
      const text = event.detail.toLowerCase();
      setTodos((prev) =>
        prev.map((t) =>
          t.text.toLowerCase() === text ? { ...t, completed: !t.completed } : t
        )
      );
    };

    window.addEventListener("add-todo", handleAddTodo as EventListener);
    window.addEventListener("remove-todo", handleRemoveTodo as EventListener);
    window.addEventListener("toggle-todo", handleToggleTodo as EventListener);

    return () => {
      window.removeEventListener("add-todo", handleAddTodo as EventListener);
      window.removeEventListener("remove-todo", handleRemoveTodo as EventListener);
      window.removeEventListener("toggle-todo", handleToggleTodo as EventListener);
    };
  }, []);

  const addTodo = (text: string) => {
    window.dispatchEvent(new CustomEvent("add-todo", { detail: text }));
  };

  const removeTodo = (text: string) => {
    window.dispatchEvent(new CustomEvent("remove-todo", { detail: text }));
  };

  const toggleTodo = (text: string) => {
    window.dispatchEvent(new CustomEvent("toggle-todo", { detail: text }));
  };

  const toggleTodoById = (id: number) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const removeTodoById = (id: number) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  return { todos, addTodo, removeTodo, toggleTodo, toggleTodoById, removeTodoById };
};
