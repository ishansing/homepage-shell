import React, { useState, useEffect, useRef } from "react";
import { executeCommand, type CommandContext } from "../utils/commandHandler";
import CalendarView from "./CalendarToast";
import { useDashboard } from "../context/DashboardContext";

/**
 * COMPONENT: Command Prompt
 * The primary interface for controlling the dashboard via typed commands.
 */
const CmdPrompt: React.FC = () => {
  // --- Local UI State ---
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([
    "System initialized. Type 'help' for commands.",
  ]);

  // --- Dashboard Context ---
  // Pulling all shared actions and data to provide to the command handler.
  const {
    bookmarks, addBookmark, removeBookmark,
    todos, addTodo, removeTodo, toggleTodo,
    notes, addNote, clearNotes, removeNoteByText,
    setPomoSettings, setCalendarConfig, calendarConfig
  } = useDashboard();

  // --- Refs ---
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * AUTO-SCROLL
   * Ensures the terminal output is always scrolled to the bottom.
   */
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history, calendarConfig]);

  /**
   * FOCUS MANAGEMENT
   * Forcibly focuses the input when clicking anywhere, UNLESS text is being selected.
   */
  useEffect(() => {
    const handleGlobalClick = () => {
      // Don't steal focus if user is selecting text for copying
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0) return;
      
      inputRef.current?.focus();
    };

    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, []);

  /**
   * HANDLER: Form Submission
   * Routes the input to the command engine.
   */
  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmdInput = input.trim();
    if (!cmdInput) return;

    // Reset history if starting a new interaction
    let newHistory: string[] = [`> ${cmdInput}`];

    // Build context object for the engine
    const context: CommandContext = {
      bookmarks,
      addBookmark,
      removeBookmark,
      todos,
      addTodo,
      removeTodo,
      toggleTodo,
      notes,
      addNote,
      clearNotes,
      removeNoteByText,
      setPomoSettings,
      setCalendarConfig,
    };

    // Execute logic
    const result = executeCommand(cmdInput, context);

    // Update local history based on execution result
    if (result.clear) {
      newHistory = [];
      setCalendarConfig(null);
    } else if (result.output) {
      newHistory.push(...result.output);
    }

    setHistory(newHistory);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full font-mono text-xs p-4 rounded-none shadow-none bg-black relative">
      {/* --- Terminal Header / Input --- */}
      <form onSubmit={handleCommand} className="flex items-center mb-2 shrink-0">
        <span className="text-accent mr-2 shrink-0 font-ndot uppercase tracking-widest">zeref@dashboard:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
          className="flex-1 bg-transparent border-none outline-none text-slate-200"
          spellCheck={false}
          autoComplete="off"
        />
      </form>

      {/* --- Terminal Scrollable Body --- */}
      <div
        ref={outputRef}
        className="flex-1 overflow-y-auto space-y-2 scrollbar-hide"
      >
        {/* Render Calendar inline if configured */}
        {calendarConfig && (
          <div className="mb-4">
            <CalendarView
              {...calendarConfig}
              onClose={() => setCalendarConfig(null)}
            />
          </div>
        )}

        {/* Render Output History */}
        {history.map((line, i) => (
          <div
            key={i}
            className={
              line.startsWith(">")
                ? "text-slate-200"
                : line.startsWith("[Error]")
                  ? "text-red-900/80"
                  : "text-slate-500"
            }
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CmdPrompt;
