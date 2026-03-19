import { useDashboard } from "../context/DashboardContext";

const Bookmarks = () => {
  const { bookmarks, removeBookmark } = useDashboard();

  const getRemixIconClass = (name: string, url: string) => {
    const lowerName = name.toLowerCase().trim();
    const lowerUrl = url.toLowerCase();

    // Mapping for common sites
    const mappings: Record<string, string> = {
      github: "ri-github-line",
      google: "ri-google-line",
      youtube: "ri-youtube-line",
      spotify: "ri-spotify-line",
      discord: "ri-discord-line",
      notion: "ri-notion-line",
      figma: "ri-figma-line",
      gmail: "ri-mail-line",
      mail: "ri-mail-line",
      outlook: "ri-mail-line",
      firefox: "ri-firefox-line",
      chrome: "ri-chrome-line",
      vsc: "ri-code-line",
      vscode: "ri-code-line",
      code: "ri-code-line",
      reddit: "ri-reddit-line",
      linkedin: "ri-linkedin-line",
      twitter: "ri-twitter-x-line",
      x: "ri-twitter-x-line",
      telegram: "ri-telegram-line",
      facebook: "ri-facebook-line",
      instagram: "ri-instagram-line",
      messenger: "ri-messenger-line",
      whatsapp: "ri-whatsapp-line",
      twitch: "ri-twitch-line",
      steam: "ri-steam-line",
      epic: "ri-gamepad-line",
      games: "ri-gamepad-line",
      weather: "ri-sun-cloudy-line",
      calendar: "ri-calendar-line",
      settings: "ri-settings-line",
      search: "ri-search-line",
      docs: "ri-file-text-line",
      drive: "ri-drive-line",
      cloud: "ri-cloud-line",
      music: "ri-music-2-line",
      video: "ri-video-line",
      camera: "ri-camera-line",
      note: "ri-sticky-note-line",
      todo: "ri-task-line",
      cmd: "ri-terminal-box-line",
      terminal: "ri-terminal-line",
    };

    // Check name match
    for (const [key, iconClass] of Object.entries(mappings)) {
      if (lowerName.includes(key)) return iconClass;
    }

    // Check url match
    for (const [key, iconClass] of Object.entries(mappings)) {
      if (lowerUrl.includes(key)) return iconClass;
    }

    return "ri-global-line"; // Fallback globe
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto pr-2">
        {bookmarks.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-slate-900/50 rounded-none">
            <p className="text-slate-600 text-[10px] uppercase tracking-widest font-ndot">No bookmarks yet.</p>
            <p className="text-slate-700 text-[10px] mt-2 font-mono italic whitespace-nowrap overflow-hidden text-ellipsis">Use 'bm add &lt;url&gt; &lt;name&gt;'</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {bookmarks.map((link) => {
              const formattedUrl = link.url.includes("://") ? link.url : `https://${link.url}`;
              const iconClass = getRemixIconClass(link.name, link.url);
              
              return (
                <div key={link.name} className="relative group/bm">
                  <a
                    href={formattedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center p-4 bg-slate-900/10 hover:bg-accent/5 rounded-none transition-all border border-transparent hover:border-accent/20 hover:shadow-xl hover:-translate-y-1"
                  >
                    <div className="w-12 h-12 flex items-center justify-center mb-2">
                      <i className={`${iconClass} text-3xl text-slate-500 group-hover/bm:text-accent group-hover/bm:scale-110 transition-all duration-300 opacity-70 group-hover/bm:opacity-100`}></i>
                    </div>
                    <span className="text-[10px] text-slate-500 text-center group-hover/bm:text-slate-200 font-ndot uppercase tracking-widest truncate w-full px-1">
                      {link.name}
                    </span>
                  </a>
                  <button
                    onClick={() => removeBookmark(link.name)}
                    className="absolute top-1 right-1 opacity-0 group-hover/bm:opacity-100 bg-red-900/50 text-white rounded-none w-4 h-4 flex items-center justify-center text-[10px] hover:bg-red-800 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
