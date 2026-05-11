import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import type { Location } from "../hooks/useCitySearch";

import { CurrentWeather } from "../components/CurrentWeather";
import { DailyForecast } from "../components/DailyForecast";
import { HourlyForecast } from "../components/HourlyForecast";
import { SearchSection } from "../components/SearchSection";
import { UnitsMenu } from "../components/UnitsMenu";
import { WeatherStats } from "../components/WeatherStats";
import { DEBOUNCE_DELAY_MS } from "../constants/weather";
import { useCitySearch } from "../hooks/useCitySearch";
import { useDebounce } from "../hooks/useDebounce";
import { useWeatherForecast } from "../hooks/useWeatherForecast";

import logo from "/logo.svg";

const BERLIN_LAT = 52.5244;
const BERLIN_LON = 13.4105;

async function reverseGeocode(lat: number, lon: number): Promise<string> {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("latitude", lat.toString());
  url.searchParams.set("longitude", lon.toString());
  url.searchParams.set("count", "1");
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");

  const response = await fetch(url.toString());
  if (!response.ok) return "Current Location";

  const data = await response.json();
  if (data.results && data.results.length > 0) {
    const result = data.results[0];
    return result.admin1 ? `${result.name}, ${result.admin1}` : `${result.name}, ${result.country}`;
  }
  return "Current Location";
}

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const [selectedDay, setSelectedDay] = useState(new Date().toLocaleDateString("en-US", { weekday: "long" }));
  const [isImperial, setIsImperial] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [defaultLocation, setDefaultLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [defaultLocationName, setDefaultLocationName] = useState<string>("Loading...");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setDefaultLocation({ lat: latitude, lon: longitude });
          const name = await reverseGeocode(latitude, longitude);
          setDefaultLocationName(name);
        },
        () => {
          setDefaultLocation({ lat: BERLIN_LAT, lon: BERLIN_LON });
          setDefaultLocationName("Berlin, Germany");
        },
      );
    } else {
      setDefaultLocation({ lat: BERLIN_LAT, lon: BERLIN_LON });
      setDefaultLocationName("Berlin, Germany");
    }
  }, []);

  const debouncedSearchInput = useDebounce(searchInput, DEBOUNCE_DELAY_MS);
  const { data: cityResults, error: searchError } = useCitySearch(debouncedSearchInput);

  const lat = selectedLocation?.latitude ?? defaultLocation?.lat ?? null;
  const lon = selectedLocation?.longitude ?? defaultLocation?.lon ?? null;

  const { data: weatherData, error: weatherError, isLoading: isLoadingWeather, refetch } = useWeatherForecast(lat, lon, isImperial ? "fahrenheit" : "celsius");

  const displayLocation = selectedLocation?.name ?? defaultLocationName;

  const tempUnit = isImperial ? "Fahrenheit" : "Celsius";
  const windUnit = isImperial ? "mph" : "km/h";
  const precipUnit = isImperial ? "inches" : "mm";

  const handleToggleUnits = () => {
    setIsImperial((prev) => !prev);
    if (selectedLocation) refetch();
  };

  const handleSetTemperature = (unit: "celsius" | "fahrenheit") => {
    setIsImperial(unit === "fahrenheit");
    if (selectedLocation) refetch();
  };

  const handleSetWindSpeed = (unit: "km/h" | "mph") => {
    setIsImperial(unit === "mph");
    if (selectedLocation) refetch();
  };

  const handleSetPrecipitation = () => {
    if (selectedLocation) refetch();
  };

  const handleSelectLocation = (location: Location) => {
    setSelectedLocation(location);
  };

  if (!defaultLocation) {
    return (
      <div className="min-h-screen bg-neutral-900 px-[clamp(1rem,2vw+0.5rem,7rem)] pt-[clamp(1rem,1.5vw+0.5rem,3rem)] antialiased lg:pb-20">
        <header className="flex justify-between">
          <img alt="Logo" src={logo} />
        </header>
        <main className="flex flex-col items-center justify-center min-h-[60vh]">
          <p className="text-preset-5 text-white">Loading...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 px-[clamp(1rem,2vw+0.5rem,7rem)] pt-[clamp(1rem,1.5vw+0.5rem,3rem)] antialiased lg:pb-20">
      <header className="flex justify-between">
        <img alt="Logo" src={logo} />
        <UnitsMenu
          isImperial={isImperial}
          onSetPrecipitation={handleSetPrecipitation}
          onSetTemperature={handleSetTemperature}
          onSetWindSpeed={handleSetWindSpeed}
          onToggleUnits={handleToggleUnits}
          precipUnit={precipUnit}
          tempUnit={tempUnit}
          windUnit={windUnit}
        />
      </header>
      <main>
        <div className="flex flex-col items-center">
          <h1 className="text-preset-2 mt-16 text-white">How&apos;s the sky looking today?</h1>
          <SearchSection cityResults={cityResults} isLoadingWeather={isLoadingWeather} onSearchInputChange={setSearchInput} onSelectLocation={handleSelectLocation} searchError={searchError} selectedLocation={selectedLocation} />
          {weatherError && <p className="text-preset-7 mt-2 text-red-400">Couldn&apos;t load weather data. Please try again.</p>}
        </div>

        {weatherData && (
          <div className="flex flex-col gap-x-8 pt-12 lg:flex-row lg:justify-center">
            <section>
              <CurrentWeather location={displayLocation} weather={weatherData.current} />
              <WeatherStats isImperial={isImperial} weather={weatherData.current} />
              <DailyForecast daily={weatherData.daily} />
            </section>

            <HourlyForecast daily={weatherData.daily} hourly={weatherData.hourly} onSelectDay={setSelectedDay} selectedDay={selectedDay} />
          </div>
        )}
      </main>
    </div>
  );
}