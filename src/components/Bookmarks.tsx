import { useBookmarks } from "../hooks/useBookmarks";

const Bookmarks = () => {
  const { bookmarks, removeBookmark } = useBookmarks();

  const getIconUrl = (iconName?: string) => {
    if (iconName) {
      return `/icons/${iconName}.svg`;
    }
    return "/icons/default.svg";
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto pr-2">
        {bookmarks.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-slate-900/50 rounded-none">
            <p className="text-slate-600 text-[10px] uppercase tracking-widest">No bookmarks yet.</p>
            <p className="text-slate-700 text-[10px] mt-2 font-mono italic whitespace-nowrap overflow-hidden text-ellipsis">Use 'bm add &lt;url&gt; &lt;name&gt;'</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {bookmarks.map((link) => {
              const formattedUrl = link.url.includes("://") ? link.url : `https://${link.url}`;
              return (
                <div key={link.name} className="relative group">
                  <a
                    href={formattedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center p-3 bg-slate-900/20 hover:bg-accent/10 rounded-none transition-all border border-transparent hover:border-accent/20 hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <img
                      src={getIconUrl(link.icon)}
                      alt={link.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/icons/default.svg";
                      }}
                      className="w-6 h-6 rounded mb-2 group-hover:scale-110 transition-transform filter brightness-110 opacity-70 group-hover:opacity-100"
                    />
                    <span className="text-[10px] text-slate-500 text-center group-hover:text-slate-200 font-mono uppercase tracking-tight truncate w-full px-1">
                      {link.name}
                    </span>
                  </a>
                  <button
                    onClick={() => removeBookmark(link.name)}
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-red-900/50 text-white rounded-none w-3 h-3 flex items-center justify-center text-[8px] hover:bg-red-800 transition-opacity"
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
