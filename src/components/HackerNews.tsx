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

const HackerNews: React.FC = () => {
  const [stories, setStories] = useState<HNStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopStories = async () => {
      try {
        setLoading(true);
        // Fetch top story IDs
        const res = await fetch(
          "https://hacker-news.firebaseio.com/v0/topstories.json",
        );
        if (!res.ok) throw new Error("Failed to fetch top stories");
        const storyIds: number[] = await res.json();

        // Take top 10
        const top10Ids = storyIds.slice(0, 10);

        // Fetch details for each
        const storyPromises = top10Ids.map(async (id) => {
          const detailRes = await fetch(
            `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
          );
          if (!detailRes.ok) throw new Error(`Failed to fetch story ${id}`);
          return await detailRes.json();
        });

        const storyDetails = await Promise.all(storyPromises);
        setStories(storyDetails);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchTopStories();
  }, []);

  return (
    <div className="flex flex-col h-full">
      {loading && <p className="text-slate-400">Loading stories...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && !error && (
        <ul className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
          {stories.map((story, index) => {
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
                    <span className="text-slate-500 mr-2">{index + 1}.</span>
                    <div className="flex-1 overflow-hidden">
                      <h3 className="text-sm font-medium text-slate-200 group-hover:text-accent line-clamp-2 transition-colors duration-300">
                        {story.title}
                      </h3>
                      <div className="text-[10px] text-slate-500 mt-1 flex gap-2 font-mono uppercase tracking-tight">
                        <span>{story.score} pts</span>
                        <span>by {story.by}</span>
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
