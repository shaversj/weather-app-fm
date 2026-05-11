import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";

import type { Location } from "../hooks/useCitySearch";

import { CurrentWeather } from "../components/CurrentWeather";
import { DailyForecast } from "../components/DailyForecast";
import { HourlyForecast } from "../components/HourlyForecast";
import { SearchSection } from "../components/SearchSection";
import { UnitsMenu } from "../components/UnitsMenu";
import { WeatherStats } from "../components/WeatherStats";
import { DEBOUNCE_DELAY_MS } from "../constants/weather";
import { weatherData as data } from "../data/mydata";
import { useCitySearch } from "../hooks/useCitySearch";
import { useDebounce } from "../hooks/useDebounce";
import { useWeatherForecast } from "../hooks/useWeatherForecast";

import logo from "/logo.svg";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const [selectedDay, setSelectedDay] = useState(new Date().toLocaleDateString("en-US", { weekday: "long" }));
  const [isImperial, setIsImperial] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const debouncedSearchInput = useDebounce(searchInput, DEBOUNCE_DELAY_MS);
  const { data: cityResults, error: searchError } = useCitySearch(debouncedSearchInput);
  const { data: weatherData, error: weatherError, isLoading: isLoadingWeather, refetch } = useWeatherForecast(selectedLocation?.latitude ?? null, selectedLocation?.longitude ?? null, isImperial ? "fahrenheit" : "celsius");

  const displayWeather = weatherData ?? data;
  const displayLocation = selectedLocation?.name ?? "Berlin, Germany";

  // Derived units from isImperial
  const tempUnit = isImperial ? "Fahrenheit" : "Celsius";
  const windUnit = isImperial ? "mph" : "km/h";
  const precipUnit = isImperial ? "inches" : "mm";

  // Event handlers
  const handleToggleUnits = useCallback(() => {
    setIsImperial((prev) => !prev);
    if (selectedLocation) refetch();
  }, [selectedLocation, refetch]);

  const handleSetTemperature = useCallback(
    (unit: "celsius" | "fahrenheit") => {
      const nowImperial = unit === "fahrenheit";
      setIsImperial(nowImperial);
      if (selectedLocation) refetch();
    },
    [selectedLocation, refetch],
  );

  const handleSetWindSpeed = useCallback(
    (unit: "km/h" | "mph") => {
      setIsImperial(unit === "mph");
      if (selectedLocation) refetch();
    },
    [selectedLocation, refetch],
  );

  const handleSetPrecipitation = useCallback(() => {
    if (selectedLocation) refetch();
  }, [selectedLocation, refetch]);

  const handleSelectLocation = useCallback((location: Location) => {
    setSelectedLocation(location);
  }, []);

  const handleSelectDay = useCallback((day: string) => {
    setSelectedDay(day);
  }, []);

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

        <div className="flex flex-col gap-x-8 pt-12 lg:flex-row lg:justify-center">
          <section>
            <CurrentWeather location={displayLocation} temperatureUnit={tempUnit} weather={displayWeather.current} />
            <WeatherStats isImperial={isImperial} weather={displayWeather.current} />
            <DailyForecast daily={displayWeather.daily} isImperial={isImperial} />
          </section>

          <HourlyForecast daily={displayWeather.daily} hourly={displayWeather.hourly} isImperial={isImperial} onSelectDay={handleSelectDay} selectedDay={selectedDay} />
        </div>
      </main>
    </div>
  );
}
