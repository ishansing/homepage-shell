import React from "react";
import { useNotes } from "../hooks/useNotes";

const Notes: React.FC = () => {
  const { notes, removeNoteByText } = useNotes();

  const formatTime = (time: number) => {
    return new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-full">
      {notes.length === 0 ? (
        <p className="text-slate-500 italic text-sm">No notes yet. Type 'note &lt;text&gt;' to add one.</p>
      ) : (
        <ul className="space-y-3 overflow-y-auto pr-2 scrollbar-hide">
          {notes.map((note) => (
            <li
              key={note.id}
              className="group bg-neutral-900/30 p-3 rounded-none border border-transparent hover:border-accent/30 transition-colors"
            >
              <div className="flex justify-between items-start gap-3">
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap break-words flex-1">
                  {note.text}
                </p>
                <button
                  onClick={() => removeNoteByText(note.text)}
                  className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all text-xs"
                  title="Remove note"
                >
                  ✕
                </button>
              </div>
              <div className="mt-2 text-[10px] text-slate-600 font-mono">
                {formatTime(note.time)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notes;
