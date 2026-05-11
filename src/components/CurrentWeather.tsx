import type { WeatherData } from "../types/weather";

import { WeatherIcon } from "./WeatherIcon";

interface CurrentWeatherProps {
  location: string;
  weather: WeatherData["current"];
}

export function CurrentWeather({ location, weather }: CurrentWeatherProps) {
  return (
    <div className="h-[286px] rounded-4xl bg-[url(/bg-today-large.svg)] bg-no-repeat p-6 py-[41px] md:py-0 lg:min-w-[800px]">
      <div className="flex h-full w-full flex-col items-center md:flex-row">
        <div>
          <p className="text-preset-4 text-white">{location}</p>
          <p className="text-preset-6 pt-3 text-white opacity-80">
            {new Date(weather.time).toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center pr-3 md:ml-auto">
          <WeatherIcon className="size-[120px]" code={weather.weather_code} />
          <span className="text-preset-1 text-white">{Math.round(weather.temperature_2m)}°</span>
        </div>
      </div>
    </div>
  );
}
