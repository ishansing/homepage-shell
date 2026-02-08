import { useState, useEffect, useRef } from "react";

// HELPER: Open-Meteo returns a numeric "weathercode".
// This function translates that number into a human-readable string.
// Reference: https://open-meteo.com/en/docs
const getWeatherDescription = (code: number): string => {
  if (code === 0) return "Clear sky";
  if (code >= 1 && code <= 3) return "Partly cloudy";
  if (code >= 45 && code <= 48) return "Foggy";
  if (code >= 51 && code <= 67) return "Rain";
  if (code >= 71 && code <= 77) return "Snow";
  if (code >= 80 && code <= 82) return "Showers";
  if (code >= 95 && code <= 99) return "Thunderstorm";
  return "Unknown";
};

interface CurrentWeather {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  is_day: number;
  time: string;
}

interface LocationSuggestion {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  admin1?: string;
  country: string;
}

const Weather = () => {
  // -----------------------------------------------------------------
  // 1. STATE MANAGEMENT
  // -----------------------------------------------------------------
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const suggestionRef = useRef<HTMLDivElement>(null);

  // -----------------------------------------------------------------
  // 2. INITIALIZATION & PERSISTENCE
  // -----------------------------------------------------------------
  // Fetch weather for coordinates
  const fetchWeather = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      );
      if (!response.ok) throw new Error("Weather fetch failed");
      const data = await response.json();
      setWeather(data.current_weather);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to fetch weather");
    } finally {
      setLoading(false);
    }
  };

  // On mount: check localStorage for saved location
  useEffect(() => {
    const saved = localStorage.getItem("last_weather_location");
    if (saved) {
      const { lat, lon, name } = JSON.parse(saved);
      setLocationName(name);
      fetchWeather(lat, lon);
    }
  }, []);

  // -----------------------------------------------------------------
  // 3. SUGGESTIONS FETCHING (with debounce)
  // -----------------------------------------------------------------
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (city.length < 3) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            city
          )}&count=5&language=en&format=json`
        );
        const data = await response.json();
        setSuggestions(data.results || []);
      } catch (err) {
        console.error("Failed to fetch suggestions:", err);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [city]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // -----------------------------------------------------------------
  // 4. SELECTION LOGIC
  // -----------------------------------------------------------------
  const selectLocation = async (loc: LocationSuggestion) => {
    const fullName = `${loc.name}${loc.admin1 ? `, ${loc.admin1}` : ""}, ${loc.country}`;
    setCity(loc.name);
    setShowSuggestions(false);
    setLocationName(fullName);

    // Save to localStorage
    localStorage.setItem(
      "last_weather_location",
      JSON.stringify({ lat: loc.latitude, lon: loc.longitude, name: fullName })
    );

    await fetchWeather(loc.latitude, loc.longitude);
  };

  // -----------------------------------------------------------------
  // 4. RENDER (The View)
  // -----------------------------------------------------------------
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <div className="relative mb-6 w-full max-w-sm" ref={suggestionRef}>
        <input
          type="text"
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Search city..."
          className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden">
            {suggestions.map((s) => (
              <button
                key={s.id}
                onClick={() => selectLocation(s)}
                className="w-full text-left px-4 py-2 hover:bg-slate-700 text-slate-200 transition-colors border-b border-slate-700 last:border-0"
              >
                <div className="font-medium">{s.name}</div>
                <div className="text-xs text-slate-400">
                  {s.admin1 ? `${s.admin1}, ` : ""}{s.country}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ERROR STATE */}
      {error && <p className="text-red-400 text-sm font-medium mb-4">{error}</p>}

      {/* LOADING STATE */}
      {loading && (
        <p className="text-slate-400 animate-pulse">Fetching Weather...</p>
      )}

      {/* SUCCESS STATE */}
      {weather && !loading && (
        <>
          <div className="text-slate-400 text-sm mb-1">{locationName}</div>
          <div className="text-5xl font-bold text-white mb-2">
            {Math.round(weather.temperature)}
            <span className="text-2xl text-slate-400 align-top ml-1">°C</span>
          </div>
          <div className="text-slate-300 text-lg font-medium">
            {getWeatherDescription(weather.weathercode)}
          </div>
          <div className="text-slate-500 text-sm mt-1">
            Wind: {weather.windspeed} km/h
          </div>
        </>
      )}

      {!weather && !loading && !error && (
        <p className="text-slate-500 italic">Type to find a city</p>
      )}
    </div>
  );
};

export default Weather;
