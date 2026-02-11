import React, { useState, useRef, useEffect } from "react";

interface HistoryItem {
  type: "command" | "output" | "error";
  content: string;
}

const CmdPrompt: React.FC = () => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  /**
   * Auto-scroll to the bottom whenever the history updates
   */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (e: React.SubmitEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;

    // Add the command to history
    const newHistory: HistoryItem[] = [
      ...history,
      { type: "command", content: cmd },
    ];

    // Command Logic (Placeholder for future commands)
    switch (cmd.toLowerCase()) {
      case "help":
        newHistory.push({
          type: "output",
          content: "Available commands: help, clear, hello",
        });
        break;
      case "clear":
        setHistory([]);
        setInput("");
        return;
      case "hello":
        newHistory.push({
          type: "output",
          content: "Hello, user! Welcome to the dashboard shell.",
        });
        break;
      default:
        newHistory.push({
          type: "error",
          content: `Command not found: ${cmd}. Type 'help' for assistance.`,
        });
    }

    setHistory(newHistory);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 font-mono text-sm text-green-400 p-4 rounded-xl border border-slate-800 shadow-2xl">
      {/* Terminal History */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto mb-2 space-y-1 scrollbar-hide"
      >
        <div className="text-slate-500 mb-2">
          System initialized. Type 'help' to begin.
        </div>
        {history.map((item, index) => (
          <div key={index} className="break-all">
            {item.type === "command" ? (
              <div className="flex">
                <span className="text-blue-400 mr-2">zeref@dashboard:~$</span>
                <span className="text-slate-200">{item.content}</span>
              </div>
            ) : (
              <div
                className={`${item.type === "error" ? "text-red-400" : "text-green-500"} ml-4`}
              >
                {item.content}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Prompt Input */}
      <form onSubmit={handleCommand} className="flex items-center">
        <span className="text-blue-400 mr-2 shrink-0">zeref@dashboard:~$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
          className="flex-1 bg-transparent border-none outline-none text-slate-200"
          spellCheck={false}
          autoComplete="on"
        />
      </form>
    </div>
  );
};

export default CmdPrompt;

