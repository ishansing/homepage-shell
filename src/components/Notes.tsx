import React from "react";
import { useDashboard } from "../context/DashboardContext";

/**
 * COMPONENT: Notes
 * Displays quick snippets of text saved by the user.
 */
const Notes: React.FC = () => {
  const { notes, removeNoteByText } = useDashboard();

  /**
   * FORMATTER: Timestamp
   * Converts epoch time to a concise 2-digit format.
   */
  const formatTime = (time: number) => {
    return new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Empty State Instructions */}
      {notes.length === 0 ? (
        <p className="text-slate-700 italic text-[10px] uppercase tracking-widest font-ndot mt-4">
          No notes. Type 'note &lt;text&gt;' to add.
        </p>
      ) : (
        /* Note List with internal scroll */
        <ul className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
          {notes.map((note) => (
            <li
              key={note.id}
              className="group bg-neutral-900/10 p-3 rounded-none border border-transparent hover:border-accent/20 transition-all"
            >
              <div className="flex justify-between items-start gap-3">
                {/* Note Body: Handles long words and multiline text */}
                <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-wrap break-words flex-1 font-poppins">
                  {note.text}
                </p>
                
                {/* Remove button: Triggered by the exact text string */}
                <button
                  onClick={() => removeNoteByText(note.text)}
                  className="text-slate-700 hover:text-red-900/80 opacity-0 group-hover:opacity-100 transition-all text-[10px] font-bebas uppercase"
                  title="Remove note"
                >
                  Clear
                </button>
              </div>
              
              {/* Note Metadata */}
              <div className="mt-2 text-[10px] text-slate-600 font-bebas uppercase tracking-widest">
                Added at {formatTime(note.time)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notes;
