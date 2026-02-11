import { useState, useEffect } from "react";

/**
 * Interface representing a single bookmark link
 */
interface Link {
  name: string;
  url: string;
  icon?: string;
}

/**
 * Interface representing a folder that contains multiple bookmarks
 */
interface Folder {
  id: number;
  title: string;
  links: Link[];
}

const DEFAULT_FOLDERS: Folder[] = [];

/**
 * Helper to extract the domain from a URL (e.g., "https://www.google.com/search" -> "google.com")
 */
const extractDomain = (url: string): string => {
  try {
    // Ensure the URL has a protocol, otherwise the URL constructor throws
    const formattedUrl = url.includes("://") ? url : `https://${url}`;
    const hostname = new URL(formattedUrl).hostname;
    return hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};

const Bookmarks = () => {
  /**
   * State for managing the list of bookmark folders.
   * Uses "Lazy Initialization" to read from localStorage only on the initial mount.
   */
  const [folders, setFolders] = useState<Folder[]>(() => {
    const saved = localStorage.getItem("bookmarks");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Basic validation: ensure the parsed data is an array
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error("Failed to parse bookmarks from localStorage", e);
      }
    }
    return DEFAULT_FOLDERS;
  });

  // UI state for managing forms and visibility
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [addingToFolderId, setAddingToFolderId] = useState<number | null>(null);
  const [newLink, setNewLink] = useState({ name: "", url: "" });

  /**
   * Persistence Effect: Automatically save the 'folders' state to localStorage
   * whenever it changes.
   */
  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(folders));
  }, [folders]);

  /**
   * Creates a new folder with a unique ID based on the current timestamp.
   */
  const addFolder = () => {
    if (!newFolderName.trim()) return;
    const newFolder: Folder = {
      id: Date.now(),
      title: newFolderName,
      links: [],
    };
    setFolders([...folders, newFolder]);
    setNewFolderName("");
    setIsAddingFolder(false);
  };

  /**
   * Removes a folder by its unique ID after confirmation.
   */
  const removeFolder = (id: number) => {
    if (confirm("Are you sure you want to delete this folder?")) {
      setFolders(folders.filter((f) => f.id !== id));
    }
  };

  /**
   * Adds a new link to a specific folder.
   * Uses .map() to create a new array with the updated folder data (Immutable update pattern).
   */
  const addLink = (folderId: number) => {
    if (!newLink.name.trim() || !newLink.url.trim()) return;
    
    // Automatically determine the icon name from the domain
    const domain = extractDomain(newLink.url);

    setFolders(
      folders.map((f) => {
        if (f.id === folderId) {
          return { ...f, links: [...f.links, { ...newLink, icon: domain }] };
        }
        return f;
      })
    );
    // Reset form state
    setNewLink({ name: "", url: "" });
    setAddingToFolderId(null);
  };

  /**
   * Removes a link from a specific folder by its name.
   */
  const removeLink = (folderId: number, linkName: string) => {
    setFolders(
      folders.map((f) => {
        if (f.id === folderId) {
          return { ...f, links: f.links.filter((l) => l.name !== linkName) };
        }
        return f;
      })
    );
  };

  /**
   * Helper to resolve the icon URL.
   * If an icon name is provided, it tries to find the matching SVG in /public/icons/
   */
  const getIconUrl = (iconName?: string) => {
    if (iconName) {
      return `/icons/${iconName}.svg`;
    }
    return "/icons/default.svg";
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* --- Component Header --- */}
      <div className="flex justify-between items-center">
        <div className="text-left">
          <h2 className="text-xl font-bold text-slate-200">Bookmarks</h2>
        </div>
        <button
          onClick={() => setIsAddingFolder(true)}
          className="px-3 py-1 text-xs bg-indigo-600 hover:bg-indigo-500 text-white rounded transition-colors"
        >
          + Folder
        </button>
      </div>

      {/* --- New Folder Input Form --- */}
      {isAddingFolder && (
        <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 flex gap-2">
          <input
            type="text"
            placeholder="Folder Name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            className="flex-1 bg-slate-900 text-slate-200 px-2 py-1 rounded border border-slate-600 focus:outline-none focus:border-indigo-500 text-sm"
          />
          <button
            onClick={addFolder}
            className="bg-indigo-600 text-white px-3 py-1 rounded text-xs"
          >
            Add
          </button>
          <button
            onClick={() => setIsAddingFolder(false)}
            className="text-slate-400 text-xs px-2"
          >
            Cancel
          </button>
        </div>
      )}

      {/* --- Folders List --- */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-6">
        {folders.length === 0 ? (
          /* Empty State */
          <div className="text-center py-8 border-2 border-dashed border-slate-700 rounded-xl">
            <p className="text-slate-500 text-sm">No bookmarks yet.</p>
            <p className="text-slate-600 text-xs mt-1">Click "+ Folder" to get started.</p>
          </div>
        ) : (
          /* Render Each Folder */
          folders.map((folder) => (
            <div key={folder.id} className="space-y-3">
              {/* Folder Header & Actions */}
            <div className="bg-slate-700/50 px-4 py-2 rounded-lg flex justify-between items-center group">
              <h3 className="font-semibold text-slate-200">
                {folder.title} <span className="text-slate-500 text-xs font-normal">({folder.links.length})</span>
              </h3>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setAddingToFolderId(folder.id)}
                  className="text-indigo-400 hover:text-indigo-300 text-xs"
                >
                  + Link
                </button>
                <button
                  onClick={() => removeFolder(folder.id)}
                  className="text-red-400 hover:text-red-300 text-xs"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* --- Add New Link Form (Inline in Folder) --- */}
            {addingToFolderId === folder.id && (
              <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 space-y-2">
                <input
                  type="text"
                  placeholder="Name"
                  value={newLink.name}
                  onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
                  className="w-full bg-slate-900 text-slate-200 px-2 py-1 rounded border border-slate-600 focus:outline-none text-sm"
                />
                <input
                  type="text"
                  placeholder="URL (https://...)"
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  className="w-full bg-slate-900 text-slate-200 px-2 py-1 rounded border border-slate-600 focus:outline-none text-sm"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => addLink(folder.id)}
                    className="flex-1 bg-indigo-600 text-white py-1 rounded text-xs"
                  >
                    Add Link
                  </button>
                  <button
                    onClick={() => setAddingToFolderId(null)}
                    className="px-3 py-1 text-slate-400 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* --- Links Grid (Bookmarks within the Folder) --- */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {folder.links.map((link) => (
                <div key={link.name} className="relative group">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center p-3 bg-slate-700/30 hover:bg-slate-600/50 rounded-lg transition-all border border-transparent hover:border-slate-500 hover:shadow-lg hover:-translate-y-1"
                  >
                    {/* Bookmark Icon with automatic fallback */}
                    <img
                      src={getIconUrl(link.icon)}
                      alt={link.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/icons/default.svg";
                      }}
                      className="w-8 h-8 rounded mb-2 group-hover:scale-110 transition-transform filter brightness-110"
                    />

                    {/* Bookmark Label */}
                    <span className="text-xs text-slate-300 text-center group-hover:text-white font-medium truncate w-full">
                      {link.name}
                    </span>
                  </a>
                  {/* Delete Button for individual Link */}
                  <button
                    onClick={() => removeLink(folder.id, link.name)}
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-red-500/80 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] hover:bg-red-600 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
      </div>
    </div>
  );
};

export default Bookmarks;