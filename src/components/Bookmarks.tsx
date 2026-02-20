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
    <div className="h-full flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-200">Bookmarks</h2>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        {bookmarks.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-slate-700 rounded-xl">
            <p className="text-slate-500 text-sm">No bookmarks yet.</p>
            <p className="text-slate-600 text-xs mt-1">Use 'bm add &lt;url&gt; &lt;name&gt;' in the prompt.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {bookmarks.map((link) => (
              <div key={link.name} className="relative group">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center p-3 bg-slate-700/30 hover:bg-slate-600/50 rounded-lg transition-all border border-transparent hover:border-slate-500 hover:shadow-lg hover:-translate-y-1"
                >
                  <img
                    src={getIconUrl(link.icon)}
                    alt={link.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/icons/default.svg";
                    }}
                    className="w-8 h-8 rounded mb-2 group-hover:scale-110 transition-transform filter brightness-110"
                  />
                  <span className="text-xs text-slate-300 text-center group-hover:text-white font-medium truncate w-full">
                    {link.name}
                  </span>
                </a>
                <button
                  onClick={() => removeBookmark(link.name)}
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-red-500/80 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] hover:bg-red-600 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
