import React, { useState, useEffect, useRef } from "react";
import { executeCommand, type CommandContext } from "../utils/commandHandler";
import CalendarView from "./CalendarToast";
import { useDashboard } from "../context/DashboardContext";

const CmdPrompt: React.FC = () => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([
    "System initialized. Type 'help' for commands.",
  ]);

  const {
    bookmarks, addBookmark, removeBookmark,
    todos, addTodo, removeTodo, toggleTodo,
    notes, addNote, clearNotes, removeNoteByText,
    setPomoSettings, setCalendarConfig, calendarConfig
  } = useDashboard();

  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history, calendarConfig]);

  useEffect(() => {
    const handleGlobalClick = () => {
      // Fix: Don't steal focus if user is selecting text
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0) return;
      
      inputRef.current?.focus();
    };

    window.addEventListener("click", handleGlobalClick);

    return () => {
      window.removeEventListener("click", handleGlobalClick);
    };
  }, []);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmdInput = input.trim();
    if (!cmdInput) return;

    let newHistory: string[] = [`> ${cmdInput}`];

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

    const result = executeCommand(cmdInput, context);

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
    <div className="flex flex-col h-full font-mono text-s p-4 rounded-none shadow-none bg-black relative">
      {/* Prompt Input */}
      <form
        onSubmit={handleCommand}
        className="flex items-center mb-2 shrink-0"
      >
        <span className="text-accent mr-2 shrink-0 font-ndot uppercase tracking-widest">
          zeref@dashboard:~$
        </span>
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

      {/* Terminal Output Area */}
      <div
        ref={outputRef}
        className="flex-1 overflow-y-auto space-y-2 scrollbar-hide"
      >
        {calendarConfig && (
          <div className="mb-4">
            <CalendarView
              {...calendarConfig}
              onClose={() => setCalendarConfig(null)}
            />
          </div>
        )}

        {history.map((line, i) => (
          <div
            key={i}
            className={
              line.startsWith(">")
                ? "text-slate-200"
                : line.startsWith("[Error]")
                  ? "text-red-400"
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
