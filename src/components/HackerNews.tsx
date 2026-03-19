import React, { useState, useEffect } from "react";

export interface HNStory {
  id: number;
  title: string;
  url?: string;
  text?: string;
  score: number;
  by: string;
  time: number;
  descendants?: number;
}

/**
 * COMPONENT: Hacker News
 * A live feed of the top 10 stories from the HN API.
 */
const HackerNews: React.FC = () => {
  // --- Local UI State ---
  const [stories, setStories] = useState<HNStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * DATA FETCHING: HN Stories
   * Uses a two-step process: fetch top IDs, then fetch details for the top 10.
   */
  useEffect(() => {
    // Controller to cancel pending fetches if the user navigates or widget unmounts
    const controller = new AbortController();
    
    const fetchTopStories = async () => {
      try {
        setLoading(true);
        
        // 1. Get the list of the current top story IDs
        const res = await fetch(
          "https://hacker-news.firebaseio.com/v0/topstories.json",
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error("Failed to reach HN API");
        const storyIds: number[] = await res.json();

        // 2. We only care about the first 10 for the dashboard layout
        const top10Ids = storyIds.slice(0, 10);

        // 3. Parallel fetch story details for speed
        const storyPromises = top10Ids.map(async (id) => {
          const detailRes = await fetch(
            `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
            { signal: controller.signal }
          );
          if (!detailRes.ok) throw new Error(`Fetch failed for story ${id}`);
          return await detailRes.json();
        });

        const storyDetails = await Promise.all(storyPromises);
        setStories(storyDetails);
      } catch (err: any) {
        if (err.name === "AbortError") return; // Expected behavior
        setError(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchTopStories();
    
    // CLEANUP: Abort any pending network activity
    return () => controller.abort();
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* State Indicators */}
      {loading && <p className="text-slate-700 animate-pulse font-bebas uppercase tracking-widest text-xs">Loading Live Feed...</p>}
      {error && <p className="text-red-900/80 font-ndot text-[10px] uppercase">{error}</p>}

      {/* Render Stories List */}
      {!loading && !error && (
        <ul className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
          {stories.map((story, index) => {
            // Determine if it's an external link or a self-post
            const targetUrl = story.url || `https://news.ycombinator.com/item?id=${story.id}`;
            
            return (
              <li key={story.id} className="group">
                <a
                  href={targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block transition-colors duration-200 cursor-pointer"
                >
                  <div className="flex items-start">
                    {/* Indexing */}
                    <span className="text-slate-700 mr-2 font-bebas text-[10px]">{index + 1}.</span>
                    <div className="flex-1 overflow-hidden">
                      {/* Story Headline */}
                      <h3 className="text-sm font-normal text-slate-400 group-hover:text-accent line-clamp-2 transition-colors duration-300 font-poppins">
                        {story.title}
                      </h3>
                      {/* Story Metadata */}
                      <div className="text-[10px] text-slate-700 mt-1 flex gap-2 font-bebas uppercase tracking-widest">
                        <span>{story.score} PTS</span>
                        <span className="opacity-30">/</span>
                        <span>BY {story.by.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default HackerNews;
