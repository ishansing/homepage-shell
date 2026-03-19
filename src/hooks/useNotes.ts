import { useState, useEffect } from "react";

export interface Note {
  id: number;
  text: string;
  time: number;
}

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem("dashboard_notes");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error("Failed to parse notes from localStorage", e);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("dashboard_notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    const handleAddNote = (event: CustomEvent<string>) => {
      const text = event.detail;
      setNotes((prev) => [...prev, { id: Date.now(), text, time: Date.now() }]);
    };

    const handleClearNotes = () => {
      setNotes([]);
    };

    const handleRemoveNoteByText = (event: CustomEvent<string>) => {
      const text = event.detail.toLowerCase();
      setNotes((prev) => prev.filter((n) => !n.text.toLowerCase().includes(text)));
    };

    window.addEventListener("add-note", handleAddNote as EventListener);
    window.addEventListener("clear-notes", handleClearNotes as EventListener);
    window.addEventListener("remove-note-by-text", handleRemoveNoteByText as EventListener);

    return () => {
      window.removeEventListener("add-note", handleAddNote as EventListener);
      window.removeEventListener("clear-notes", handleClearNotes as EventListener);
      window.removeEventListener("remove-note-by-text", handleRemoveNoteByText as EventListener);
    };
  }, []);

  const addNote = (text: string) => {
    window.dispatchEvent(new CustomEvent("add-note", { detail: text }));
  };

  const clearNotes = () => {
    window.dispatchEvent(new CustomEvent("clear-notes"));
  };

  const removeNoteByText = (text: string) => {
    window.dispatchEvent(new CustomEvent("remove-note-by-text", { detail: text }));
  };

  return { notes, addNote, clearNotes, removeNoteByText };
};
