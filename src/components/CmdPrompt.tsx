import React, { useState, useEffect, useRef } from "react";
import { useBookmarks } from "../hooks/useBookmarks";
import { useTodos } from "../hooks/useTodos";

const CmdPrompt: React.FC = () => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>(["System initialized. Type 'help' for commands."]);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { bookmarks, addBookmark, removeBookmark } = useBookmarks();
  const { addTodo, removeTodo, toggleTodo } = useTodos();

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    const handleGlobalClick = () => {
      inputRef.current?.focus();
    };
    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, []);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmdInput = input.trim();
    if (!cmdInput) return;

    setHistory((prev) => [...prev, `> ${cmdInput}`]);

    const parts = cmdInput.split(" ");
    const commandName = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Check if it's a built-in command
    switch (commandName) {
      case "help": {
        setHistory((prev) => [
          ...prev,
          "Commands:",
          "  todo add <task>     - Add a todo item",
          "  todo rm <task>      - Remove a todo item",
          "  todo done <task>    - Mark todo as done/undone",
          "  bm add <url> <name> - Add bookmark",
          "  bm rm <name>        - Remove bookmark",
          "  weather <city>      - Set weather location",
          "  ls                  - List bookmarks",
          "  g <query>           - Search Google",
          "  p <query>           - Search Perplexity",
          "  clear               - Clear terminal",
          "  <bookmark_name>     - Open a bookmark directly"
        ]);
        break;
      }
      case "ls": {
        if (bookmarks.length > 0) {
          setHistory((prev) => [...prev, "Bookmarks:", ...bookmarks.map(b => `  - ${b.name} (${b.url})`)]);
        } else {
          setHistory((prev) => [...prev, "No bookmarks found."]);
        }
        break;
      }
      case "t":
      case "todo": {
        const subTodoCmd = args[0]?.toLowerCase();
        const todoText = args.slice(1).join(" ");
        
        if (subTodoCmd === "add") {
          if (todoText) {
            addTodo(todoText);
            setHistory((prev) => [...prev, `[Success] Added todo: ${todoText}`]);
          } else {
            setHistory((prev) => [...prev, "[Error] Usage: todo add <task>"]);
          }
        } else if (subTodoCmd === "rm" || subTodoCmd === "remove") {
          if (todoText) {
            removeTodo(todoText);
            setHistory((prev) => [...prev, `[Success] Removed todo: ${todoText}`]);
          } else {
            setHistory((prev) => [...prev, "[Error] Usage: todo rm <task>"]);
          }
        } else if (subTodoCmd === "done" || subTodoCmd === "check" || subTodoCmd === "do") {
          if (todoText) {
            toggleTodo(todoText);
            setHistory((prev) => [...prev, `[Success] Toggled todo: ${todoText}`]);
          } else {
            setHistory((prev) => [...prev, "[Error] Usage: todo done <task>"]);
          }
        } else {
          setHistory((prev) => [...prev, "[Error] Usage: todo <add|rm|done> <task>"]);
        }
        break;
      }
      case "b":
      case "bm":
      case "bookmark": {
        const subBmCmd = args[0]?.toLowerCase();
        if (subBmCmd === "add") {
          if (args.length >= 3) {
            const url = args[1];
            const name = args.slice(2).join(" ");
            addBookmark(name, url);
            setHistory((prev) => [...prev, `[Success] Added bookmark: ${name}`]);
          } else {
            setHistory((prev) => [...prev, "[Error] Usage: bm add <url> <name>"]);
          }
        } else if (subBmCmd === "rm" || subBmCmd === "remove") {
          const name = args.slice(1).join(" ");
          if (name) {
            removeBookmark(name);
            setHistory((prev) => [...prev, `[Success] Removed bookmark: ${name}`]);
          } else {
            setHistory((prev) => [...prev, "[Error] Usage: bm rm <name>"]);
          }
        } else {
          setHistory((prev) => [...prev, "[Error] Usage: bm <add|rm> ..."]);
        }
        break;
      }
      case "w":
      case "weather": {
        const city = args.join(" ");
        if (city) {
          window.dispatchEvent(new CustomEvent("set-weather-location", { detail: city }));
          setHistory((prev) => [...prev, `Setting weather location to: ${city}`]);
        } else {
          setHistory((prev) => [...prev, "[Error] Usage: weather <city>"]);
        }
        break;
      }
      case "g":
      case "google": {
        const gQuery = args.join(" ");
        if (gQuery) {
          window.open(`https://www.google.com/search?q=${encodeURIComponent(gQuery)}`, "_blank");
          setHistory((prev) => [...prev, `Searching Google for: ${gQuery}`]);
        } else {
          setHistory((prev) => [...prev, "[Error] Usage: g <query>"]);
        }
        break;
      }
      case "p":
      case "perplexity": {
        const pQuery = args.join(" ");
        if (pQuery) {
          window.open(`https://www.perplexity.ai/search?q=${encodeURIComponent(pQuery)}`, "_blank");
          setHistory((prev) => [...prev, `Searching Perplexity for: ${pQuery}`]);
        } else {
          setHistory((prev) => [...prev, "[Error] Usage: p <query>"]);
        }
        break;
      }
      case "clear": {
        setHistory([]);
        break;
      }
      default: {
        // Check if commandName matches a bookmark
        const bookmark = bookmarks.find(b => b.name.toLowerCase() === commandName);
        if (bookmark) {
          window.open(bookmark.url, "_blank");
          setHistory((prev) => [...prev, `Opening: ${bookmark.name}...`]);
        } else {
          setHistory((prev) => [...prev, `[Error] Unknown command: ${commandName}`]);
        }
      }
    }

    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 font-mono text-xs text-green-400 p-4 rounded-xl border border-slate-800 shadow-2xl">
      {/* Terminal Output Area */}
      <div 
        ref={outputRef}
        className="flex-1 overflow-y-auto mb-2 space-y-1 scrollbar-hide"
      >
        {history.map((line, i) => (
          <div key={i} className={line.startsWith(">") ? "text-slate-200" : line.startsWith("[Error]") ? "text-red-400" : "text-slate-500"}>
            {line}
          </div>
        ))}
      </div>

      {/* Prompt Input */}
      <form onSubmit={handleCommand} className="flex items-center">
        <span className="text-blue-400 mr-2 shrink-0">zeref@dashboard:~$</span>
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
    </div>
  );
};

export default CmdPrompt;
