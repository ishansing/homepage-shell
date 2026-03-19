import { useState, useEffect } from "react";

export interface Link {
  name: string;
  url: string;
  icon?: string;
}

const extractDomain = (url: string): string => {
  try {
    const formattedUrl = url.includes("://") ? url : `https://${url}`;
    const hostname = new URL(formattedUrl).hostname;
    return hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Link[]>(() => {
    const saved = localStorage.getItem("bookmarks_flat");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error("Failed to parse bookmarks from localStorage", e);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("bookmarks_flat", JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    const handleAddBookmark = (event: CustomEvent<{ name: string, url: string }>) => {
      const { name, url } = event.detail;
      const formattedUrl = url.includes("://") ? url : `https://${url}`;
      const domain = extractDomain(formattedUrl);
      const newLink: Link = { name, url: formattedUrl, icon: domain };

      setBookmarks((prev) => {
        if (prev.some(b => b.name.toLowerCase() === name.toLowerCase())) return prev;
        return [...prev, newLink];
      });
    };

    const handleRemoveBookmark = (event: CustomEvent<string>) => {
      const name = event.detail;
      setBookmarks((prev) => prev.filter((b) => b.name !== name));
    };

    window.addEventListener("add-bookmark", handleAddBookmark as EventListener);
    window.addEventListener("remove-bookmark", handleRemoveBookmark as EventListener);
    
    return () => {
      window.removeEventListener("add-bookmark", handleAddBookmark as EventListener);
      window.removeEventListener("remove-bookmark", handleRemoveBookmark as EventListener);
    };
  }, []);

  const addBookmark = (name: string, url: string) => {
    window.dispatchEvent(new CustomEvent("add-bookmark", { detail: { name, url } }));
  };

  const removeBookmark = (name: string) => {
    window.dispatchEvent(new CustomEvent("remove-bookmark", { detail: name }));
  };

  return { bookmarks, addBookmark, removeBookmark };
};
