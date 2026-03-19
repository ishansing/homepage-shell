import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";

// Types
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export interface Note {
  id: number;
  text: string;
  time: number;
}

export interface Link {
  name: string;
  url: string;
  icon?: string;
}

export interface PomodoroSettings {
  focus: number;
  break: number;
}

export interface CalendarConfig {
  month?: number;
  year?: number;
  fullYear?: boolean;
}

interface DashboardContextType {
  // Todos
  todos: Todo[];
  addTodo: (text: string) => void;
  removeTodo: (text: string) => void;
  toggleTodo: (text: string) => void;
  toggleTodoById: (id: number) => void;
  removeTodoById: (id: number) => void;

  // Notes
  notes: Note[];
  addNote: (text: string) => void;
  clearNotes: () => void;
  removeNoteByText: (text: string) => void;

  // Bookmarks
  bookmarks: Link[];
  addBookmark: (name: string, url: string) => void;
  removeBookmark: (name: string) => void;

  // Pomodoro
  pomoSettings: PomodoroSettings | null;
  setPomoSettings: (settings: PomodoroSettings | null) => void;

  // Calendar
  calendarConfig: CalendarConfig | null;
  setCalendarConfig: (config: CalendarConfig | null) => void;

  // Weather
  locationName: string | null;
  setLocationName: (name: string | null) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const safelyParseJSON = <T,>(key: string, defaultValue: T): T => {
  const saved = localStorage.getItem(key);
  if (!saved) return defaultValue;
  try {
    return JSON.parse(saved) as T;
  } catch (e) {
    console.error(`Failed to parse ${key} from localStorage`, e);
    return defaultValue;
  }
};

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Todos State
  const [todos, setTodos] = useState<Todo[]>(() => safelyParseJSON("dashboard_todos", []));
  useEffect(() => localStorage.setItem("dashboard_todos", JSON.stringify(todos)), [todos]);

  // Notes State
  const [notes, setNotes] = useState<Note[]>(() => safelyParseJSON("dashboard_notes", []));
  useEffect(() => localStorage.setItem("dashboard_notes", JSON.stringify(notes)), [notes]);

  // Bookmarks State
  const [bookmarks, setBookmarks] = useState<Link[]>(() => safelyParseJSON("bookmarks_flat", []));
  useEffect(() => localStorage.setItem("bookmarks_flat", JSON.stringify(bookmarks)), [bookmarks]);

  // Weather Location
  const [locationName, setLocationNameState] = useState<string | null>(null);
  useEffect(() => {
    const saved = localStorage.getItem("last_weather_location");
    if (saved) {
      try {
        const { name } = JSON.parse(saved);
        setLocationNameState(name);
      } catch (e) {
        console.error("Failed to parse last_weather_location", e);
      }
    }
  }, []);

  // Shared UI States
  const [pomoSettings, setPomoSettings] = useState<PomodoroSettings | null>(null);
  const [calendarConfig, setCalendarConfig] = useState<CalendarConfig | null>(null);

  // Helper for URL Sanitization
  const sanitizeUrl = (url: string): string => {
    const trimmed = url.trim();
    if (trimmed.toLowerCase().startsWith("javascript:")) {
      return "about:blank";
    }
    return trimmed.includes("://") ? trimmed : `https://${trimmed}`;
  };

  // Actions
  const addTodo = (text: string) => setTodos(prev => [...prev, { id: Date.now(), text, completed: false }]);
  const removeTodo = (text: string) => setTodos(prev => prev.filter(t => t.text.toLowerCase() !== text.toLowerCase()));
  const toggleTodo = (text: string) => setTodos(prev => prev.map(t => t.text.toLowerCase() === text.toLowerCase() ? { ...t, completed: !t.completed } : t));
  const toggleTodoById = (id: number) => setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  const removeTodoById = (id: number) => setTodos(prev => prev.filter(t => t.id !== id));

  const addNote = (text: string) => setNotes(prev => [...prev, { id: Date.now(), text, time: Date.now() }]);
  const clearNotes = () => setNotes([]);
  const removeNoteByText = (text: string) => setNotes(prev => prev.filter(n => !n.text.toLowerCase().includes(text.toLowerCase())));

  const addBookmark = (name: string, url: string) => {
    const sanitizedUrl = sanitizeUrl(url);
    const domain = ((): string => {
      try {
        return new URL(sanitizedUrl).hostname.replace(/^www\./, "");
      } catch {
        return "";
      }
    })();
    setBookmarks(prev => {
      if (prev.some(b => b.name.toLowerCase() === name.toLowerCase())) return prev;
      return [...prev, { name, url: sanitizedUrl, icon: domain }];
    });
  };
  const removeBookmark = (name: string) => setBookmarks(prev => prev.filter(b => b.name.toLowerCase() !== name.toLowerCase()));

  const setLocationName = (name: string | null) => setLocationNameState(name);

  const value = {
    todos, addTodo, removeTodo, toggleTodo, toggleTodoById, removeTodoById,
    notes, addNote, clearNotes, removeNoteByText,
    bookmarks, addBookmark, removeBookmark,
    pomoSettings, setPomoSettings,
    calendarConfig, setCalendarConfig,
    locationName, setLocationName
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};
