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
  if (aqi <= 50) return { text: "Good", color: "text-green-400" };
  if (aqi <= 100) return { text: "Moderate", color: "text-yellow-400" };
  if (aqi <= 150) return { text: "Sensitive", color: "text-orange-400" };
  if (aqi <= 200) return { text: "Unhealthy", color: "text-red-400" };
  if (aqi <= 300) return { text: "Very Unhealthy", color: "text-purple-400" };
  return { text: "Hazardous", color: "text-rose-600" };
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
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      {error && (
        <p className="text-red-400 text-sm font-medium mb-4">{error}</p>
      )}

      {loading && (
        <p className="text-slate-400 animate-pulse">Fetching Weather...</p>
      )}

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
          {aqi !== null && (
            <div className="text-slate-500 text-xs mt-2 uppercase tracking-widest font-mono">
              AQI: <span className={getAqiDescription(aqi).color}>{aqi}</span> — {getAqiDescription(aqi).text}
            </div>
          )}
        </>
      )}

      {!weather && !loading && !error && (
        <p className="text-slate-500 italic">
          Use 'weather &lt;city&gt;' in the prompt
        </p>
      )}
    </div>
  );
};

export default Weather;
