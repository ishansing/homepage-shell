import React, { useState, useEffect, useRef } from "react";
import { useBookmarks } from "../hooks/useBookmarks";
import { useTodos } from "../hooks/useTodos";
import { useNotes } from "../hooks/useNotes";
import { executeCommand, type CommandContext } from "../utils/commandHandler";
import CalendarView from "./CalendarToast";

const CmdPrompt: React.FC = () => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([
    "System initialized. Type 'help' for commands.",
  ]);
  const [calendarConfig, setCalendarConfig] = useState<{
    month?: number;
    year?: number;
    fullYear?: boolean;
  } | null>(null);

  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { bookmarks, addBookmark, removeBookmark } = useBookmarks();
  const { addTodo, removeTodo, toggleTodo } = useTodos();
  const { addNote, clearNotes } = useNotes();

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history, calendarConfig]);

  useEffect(() => {
    const handleGlobalClick = () => {
      inputRef.current?.focus();
    };
    const handleShowCalendar = (
      event: CustomEvent<{ month?: number; year?: number; fullYear?: boolean }>,
    ) => {
      setCalendarConfig(event.detail);
    };

    window.addEventListener("click", handleGlobalClick);
    window.addEventListener(
      "show-calendar",
      handleShowCalendar as EventListener,
    );

    return () => {
      window.removeEventListener("click", handleGlobalClick);
      window.removeEventListener(
        "show-calendar",
        handleShowCalendar as EventListener,
      );
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
      addTodo,
      removeTodo,
      toggleTodo,
      addNote,
      clearNotes,
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
    <div className="flex flex-col h-full font-mono text-xs p-4 rounded-none shadow-none bg-black relative">
      {/* Prompt Input */}
      <form onSubmit={handleCommand} className="flex items-center mb-2 shrink-0">
        <span className="text-accent mr-2 shrink-0">zeref@dashboard:~$</span>
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
