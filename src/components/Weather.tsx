import { useState, useEffect, useRef, useCallback } from "react";
import { useDashboard } from "../context/DashboardContext";

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

const getAqiDescription = (aqi: number): { text: string; color: string } => {
  if (aqi <= 50) return { text: "Good", color: "text-green-600/50" };
  if (aqi <= 100) return { text: "Moderate", color: "text-yellow-600/50" };
  if (aqi <= 150) return { text: "Sensitive", color: "text-orange-600/50" };
  if (aqi <= 200) return { text: "Unhealthy", color: "text-red-600/50" };
  if (aqi <= 300)
    return { text: "Very Unhealthy", color: "text-purple-600/50" };
  return { text: "Hazardous", color: "text-rose-800/50" };
};

interface CurrentWeather {
  temperature: number;
  weathercode: number;
  is_day: number;
  time: string;
}

const Weather = () => {
  const { locationName, setLocationName } = useDashboard();
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [aqi, setAqi] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchWeather = useCallback(async (lat: number, lon: number, signal: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const [weatherRes, aqiRes] = await Promise.all([
        fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`,
          { signal }
        ),
        fetch(
          `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi`,
          { signal }
        ),
      ]);

      if (!weatherRes.ok || !aqiRes.ok) throw new Error("Fetch failed");

      const weatherData = await weatherRes.json();
      const aqiData = await aqiRes.json();

      setWeather(weatherData.current_weather);
      setAqi(aqiData.current?.us_aqi ?? null);
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSetLocation = useCallback(async (cityName: string) => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          cityName,
        )}&count=1&language=en&format=json`,
        { signal }
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const loc = data.results[0];
        const fullName = `${loc.name}${loc.admin1 ? `, ${loc.admin1}` : ""}, ${loc.country}`;
        setLocationName(fullName);
        localStorage.setItem(
          "last_weather_location",
          JSON.stringify({
            lat: loc.latitude,
            lon: loc.longitude,
            name: fullName,
          }),
        );
        await fetchWeather(loc.latitude, loc.longitude, signal);
      } else {
        setError("City not found");
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setError("Failed to fetch location");
    } finally {
      setLoading(false);
    }
  }, [setLocationName, fetchWeather]);

  const getWeatherIcon = (code: number) => {
    if (code === 0) return "/Images/Nothing/32.png";
    if (code >= 1 && code <= 3) return "/Images/Nothing/30.png";
    if (code >= 45 && code <= 48) return "/Images/Nothing/20.png";
    if (code >= 51 && code <= 67) return "/Images/Nothing/12.png";
    if (code >= 71 && code <= 77) return "/Images/Nothing/16.png";
    if (code >= 80 && code <= 82) return "/Images/Nothing/11.png";
    if (code >= 95 && code <= 99) return "/Images/Nothing/4.png";
    return "/Images/Nothing/26.png"; // Default Cloudy
  };

  useEffect(() => {
    const saved = localStorage.getItem("last_weather_location");
    if (saved) {
      try {
        const { lat, lon, name } = JSON.parse(saved);
        setLocationName(name);
        const controller = new AbortController();
        fetchWeather(lat, lon, controller.signal);
        return () => controller.abort();
      } catch (e) {
        console.error("Failed to parse weather location", e);
      }
    }
  }, [setLocationName, fetchWeather]);

  useEffect(() => {
    const onSetLocation = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      handleSetLocation(customEvent.detail);
    };
    window.addEventListener("set-weather-location", onSetLocation);
    return () => {
      window.removeEventListener("set-weather-location", onSetLocation);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [handleSetLocation]);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4 w-full overflow-hidden">
      {error && (
        <p className="text-red-900/80 text-[13px] font-ndot uppercase mb-4 truncate w-full">
          {error}
        </p>
      )}

      {loading && (
        <p className="text-slate-600 animate-pulse text-[13px] font-ndot uppercase tracking-widest">
          Fetching...
        </p>
      )}

      {weather && !loading && (
        <div className="w-full flex flex-col items-center">
          <div className="text-slate-500 text-[13px] mb-1 font-bebas uppercase tracking-widest truncate px-4 w-full">
            {locationName}
          </div>

          <div className="flex items-center justify-center gap-4 mb-2">
            <img
              src={getWeatherIcon(weather.weathercode)}
              alt="weather icon"
              className="w-16 h-16 object-contain filter brightness-150 grayscale-[0.8]"
            />
            <div className="text-6xl font-normal text-white font-ndot tracking-tighter">
              {Math.round(weather.temperature)}
              <span className="text-2xl text-slate-500 align-top ml-1">°</span>
            </div>
          </div>

          <div className="text-slate-400 text-s font-bebas uppercase tracking-[0.3em] font-medium truncate px-4 w-full">
            {getWeatherDescription(weather.weathercode)}
          </div>

          {aqi !== null && (
            <div className="text-slate-600 text-[13px] mt-4 uppercase tracking-[0.1em] font-ndot flex items-center justify-center gap-2">
              <span>AQI</span>
              <span
                className={`px-1.5 py-0.5 ${getAqiDescription(aqi).color} border border-current/10 font-bold`}
              >
                {aqi}
              </span>
              <span className="opacity-30">—</span>
              <span className="opacity-60">{getAqiDescription(aqi).text}</span>
            </div>
          )}
        </div>
      )}

      {!weather && !loading && !error && (
        <p className="text-slate-700 text-[10px] uppercase tracking-widest font-ndot italic">
          Set location via prompt
        </p>
      )}
    </div>
  );
};

export default Weather;
