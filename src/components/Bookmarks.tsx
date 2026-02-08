import { useState } from "react";

const Bookmarks = () => {
  // -----------------------------------------------------------------
  // 1. STATE (Hardcoded for now)
  // -----------------------------------------------------------------
  const [folders, setFolders] = useState([
    {
      id: 1,
      title: "Daily",
      links: [
        { name: "Gmail", url: "https://mail.google.com" },
        { name: "Calendar", url: "https://calendar.google.com" },
        { name: "GitHub", url: "https://github.com" },
      ],
    },
    {
      id: 2,
      title: "News",
      links: [
        { name: "Hacker News", url: "https://news.ycombinator.com" },
        { name: "BBC", url: "https://bbc.com" },
      ],
    },
    {
      id: 3,
      title: "Social",
      links: [
        { name: "WhatsApp", url: "https://web.whatsapp.com" },
        { name: "Twitter", url: "https://x.com" },
      ],
    },
  ]);

  // -----------------------------------------------------------------
  // 2. HELPER: Generates favicon URL from any website
  // -----------------------------------------------------------------
  const getFaviconUrl = (domain) => {
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  };

  // -----------------------------------------------------------------
  // 3. RENDER: Nested Mapping
  // -----------------------------------------------------------------
  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-200 mb-1">Bookmarks</h2>
        <p className="text-sm text-slate-500">Click to open in new tab</p>
      </div>

      {/* Folders */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {folders.map((folder) => (
          <div key={folder.id} className="space-y-3">
            {/* Folder Header */}
            <div className="bg-slate-700 px-4 py-2 rounded-lg">
              <h3 className="font-semibold text-slate-200">
                {folder.title} ({folder.links.length})
              </h3>
            </div>

            {/* Links Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {folder.links.map((link) => {
                // Extract domain for favicon (e.g., "github.com" from "https://github.com")
                const domain = link.url
                  .replace("https://", "")
                  .replace("http://", "")
                  .replace(/\/.*$/, "");

                return (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center p-3 bg-slate-700/50 hover:bg-slate-600 rounded-lg transition-all border border-transparent hover:border-slate-500 hover:shadow-lg hover:-translate-y-1"
                  >
                    {/* Favicon */}
                    <img
                      src={getFaviconUrl(domain)}
                      alt={link.name}
                      className="w-10 h-10 rounded-lg mb-2 group-hover:scale-110 transition-transform"
                      onError={(e) => {
                        e.target.style.display = "none"; // Hide broken favicons
                      }}
                    />

                    {/* Link Name */}
                    <span className="text-sm text-slate-200 text-center group-hover:text-white font-medium truncate">
                      {link.name}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bookmarks;
