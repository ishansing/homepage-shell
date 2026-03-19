import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";

/**
 * CORE DATA MODELS
 */

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

/**
 * CONTEXT DEFINITION
 * Centralized state for the entire dashboard application.
 */
interface DashboardContextType {
  // --- Todos ---
  todos: Todo[];
  addTodo: (text: string) => void;
  removeTodo: (text: string) => void;
  toggleTodo: (text: string) => void;
  toggleTodoById: (id: number) => void;
  removeTodoById: (id: number) => void;

  // --- Notes ---
  notes: Note[];
  addNote: (text: string) => void;
  clearNotes: () => void;
  removeNoteByText: (text: string) => void;

  // --- Bookmarks ---
  bookmarks: Link[];
  addBookmark: (name: string, url: string) => void;
  removeBookmark: (name: string) => void;

  // --- Shared UI States ---
  pomoSettings: PomodoroSettings | null;
  setPomoSettings: (settings: PomodoroSettings | null) => void;
  calendarConfig: CalendarConfig | null;
  setCalendarConfig: (config: CalendarConfig | null) => void;
  locationName: string | null;
  setLocationName: (name: string | null) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

/**
 * UTILITY: Safe JSON Parsing
 * Prevents the application from crashing if LocalStorage contains malformed data.
 */
const safelyParseJSON = <T,>(key: string, defaultValue: T): T => {
  const saved = localStorage.getItem(key);
  if (!saved) return defaultValue;
  try {
    return JSON.parse(saved) as T;
  } catch (e) {
    console.error(`[Storage] Failed to parse key "${key}":`, e);
    return defaultValue;
  }
};

/**
 * PROVIDER COMPONENT
 * Handles state initialization, LocalStorage synchronization, and shared actions.
 */
export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  
  // Initialize states from LocalStorage or defaults
  const [todos, setTodos] = useState<Todo[]>(() => safelyParseJSON("dashboard_todos", []));
  const [notes, setNotes] = useState<Note[]>(() => safelyParseJSON("dashboard_notes", []));
  const [bookmarks, setBookmarks] = useState<Link[]>(() => safelyParseJSON("bookmarks_flat", []));
  const [locationName, setLocationNameState] = useState<string | null>(null);

  // Persistence: Update LocalStorage whenever state changes
  useEffect(() => localStorage.setItem("dashboard_todos", JSON.stringify(todos)), [todos]);
  useEffect(() => localStorage.setItem("dashboard_notes", JSON.stringify(notes)), [notes]);
  useEffect(() => localStorage.setItem("bookmarks_flat", JSON.stringify(bookmarks)), [bookmarks]);

  // Load weather location on mount
  useEffect(() => {
    const saved = localStorage.getItem("last_weather_location");
    if (saved) {
      try {
        const { name } = JSON.parse(saved);
        setLocationNameState(name);
      } catch (e) {
        console.error("[Storage] Failed to parse weather location:", e);
      }
    }
  }, []);

  // Volatile UI states (not persisted across sessions)
  const [pomoSettings, setPomoSettings] = useState<PomodoroSettings | null>(null);
  const [calendarConfig, setCalendarConfig] = useState<CalendarConfig | null>(null);

  /**
   * SECURITY: URL Sanitization
   * Normalizes URLs and blocks 'javascript:' protocol to prevent XSS.
   */
  const sanitizeUrl = (url: string): string => {
    const trimmed = url.trim();
    if (trimmed.toLowerCase().startsWith("javascript:")) {
      console.warn("[Security] Blocked potential XSS in bookmark URL.");
      return "about:blank";
    }
    // Prepend https if protocol is missing
    return trimmed.includes("://") ? trimmed : `https://${trimmed}`;
  };

  // --- Action Implementations ---

  const addTodo = (text: string) => 
    setTodos(prev => [...prev, { id: Date.now(), text, completed: false }]);

  const removeTodo = (text: string) => 
    setTodos(prev => prev.filter(t => t.text.toLowerCase() !== text.toLowerCase()));

  const toggleTodo = (text: string) => 
    setTodos(prev => prev.map(t => t.text.toLowerCase() === text.toLowerCase() ? { ...t, completed: !t.completed } : t));

  const toggleTodoById = (id: number) => 
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));

  const removeTodoById = (id: number) => 
    setTodos(prev => prev.filter(t => t.id !== id));

  const addNote = (text: string) => 
    setNotes(prev => [...prev, { id: Date.now(), text, time: Date.now() }]);

  const clearNotes = () => setNotes([]);

  const removeNoteByText = (text: string) => 
    setNotes(prev => prev.filter(n => !n.text.toLowerCase().includes(text.toLowerCase())));

  const addBookmark = (name: string, url: string) => {
    const sanitizedUrl = sanitizeUrl(url);
    const domain = ((): string => {
      try {
        // Extract domain name for potential icon lookup
        return new URL(sanitizedUrl).hostname.replace(/^www\./, "");
      } catch {
        return "";
      }
    })();
    setBookmarks(prev => {
      // Avoid duplicate bookmark names
      if (prev.some(b => b.name.toLowerCase() === name.toLowerCase())) return prev;
      return [...prev, { name, url: sanitizedUrl, icon: domain }];
    });
  };

  const removeBookmark = (name: string) => 
    setBookmarks(prev => prev.filter(b => b.name.toLowerCase() !== name.toLowerCase()));

  const setLocationName = (name: string | null) => setLocationNameState(name);

  // Bundle the context value
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

/**
 * HOOK: useDashboard
 * Convenience hook for accessing the Dashboard state.
 */
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};
