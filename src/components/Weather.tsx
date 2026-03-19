import { useState, useEffect } from "react";

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
  if (aqi <= 300) return { text: "Very Unhealthy", color: "text-purple-600/50" };
  return { text: "Hazardous", color: "text-rose-800/50" };
};

interface CurrentWeather {
  temperature: number;
  weathercode: number;
  is_day: number;
  time: string;
}

const Weather = () => {
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [aqi, setAqi] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationName, setLocationName] = useState<string | null>(null);

  const fetchWeather = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    try {
      const [weatherRes, aqiRes] = await Promise.all([
        fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`,
        ),
        fetch(
          `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi`,
        ),
      ]);

      if (!weatherRes.ok || !aqiRes.ok) throw new Error("Fetch failed");

      const weatherData = await weatherRes.json();
      const aqiData = await aqiRes.json();

      setWeather(weatherData.current_weather);
      setAqi(aqiData.current?.us_aqi ?? null);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("last_weather_location");
    if (saved) {
      const { lat, lon, name } = JSON.parse(saved);
      setLocationName(name);
      fetchWeather(lat, lon);
    }
  }, []);

  useEffect(() => {
    const handleSetLocation = async (event: CustomEvent<string>) => {
      const cityName = event.detail;
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            cityName,
          )}&count=1&language=en&format=json`,
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
          await fetchWeather(loc.latitude, loc.longitude);
        } else {
          setError("City not found");
        }
      } catch {
        setError("Failed to fetch location");
      } finally {
        setLoading(false);
      }
    };

    window.addEventListener(
      "set-weather-location",
      handleSetLocation as unknown as EventListener,
    );
    return () => {
      window.removeEventListener(
        "set-weather-location",
        handleSetLocation as unknown as EventListener,
      );
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4 w-full overflow-hidden">
      {error && (
        <p className="text-red-900/80 text-[10px] font-mono uppercase mb-4 truncate w-full">{error}</p>
      )}

      {loading && (
        <p className="text-slate-600 animate-pulse text-[10px] font-mono uppercase tracking-widest">Fetching...</p>
      )}

      {weather && !loading && (
        <div className="w-full">
          <div className="text-slate-500 text-[10px] mb-1 font-mono uppercase tracking-tight truncate px-4">{locationName}</div>
          <div className="text-5xl font-bold text-white mb-2 font-mono tracking-tighter">
            {Math.round(weather.temperature)}
            <span className="text-2xl text-slate-500 align-top ml-1">°</span>
          </div>
          <div className="text-slate-400 text-sm uppercase tracking-[0.2em] font-medium truncate px-4">
            {getWeatherDescription(weather.weathercode)}
          </div>
          {aqi !== null && (
            <div className="text-slate-600 text-[10px] mt-4 uppercase tracking-[0.1em] font-mono flex items-center justify-center gap-2">
              <span>AQI</span>
              <span className={`px-1.5 py-0.5 ${getAqiDescription(aqi).color} border border-current/10 font-bold`}>{aqi}</span>
              <span className="opacity-30">—</span>
              <span className="opacity-60">{getAqiDescription(aqi).text}</span>
            </div>
          )}
        </div>
      )}

      {!weather && !loading && !error && (
        <p className="text-slate-700 text-[10px] uppercase tracking-widest font-mono italic">
          Set location via prompt
        </p>
      )}
    </div>
  );
};

export default Weather;
