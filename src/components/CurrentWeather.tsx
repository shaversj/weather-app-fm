import type { WeatherData } from "../types/weather";

import { WeatherIcon } from "./WeatherIcon";
import loadingIcon from "/icon-loading.svg";

interface CurrentWeatherProps {
  location: string;
  weather?: WeatherData["current"];
  isLoadingWeather: boolean;
}

export function CurrentWeather({ location, weather, isLoadingWeather }: CurrentWeatherProps) {
  if (isLoadingWeather || !weather) {
    return (
      <div className={"bg-accent-500 grid h-[286px] min-w-[800px] place-items-center"}>
        <div className={"flex flex-col items-center"}>
          <img alt="Loading" src={loadingIcon} />
          <p className="text-preset-6 text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={"bg-accent-500 grid h-[286px] min-w-[800px] place-items-center"}>
      <div className="h-[286px] w-full rounded-4xl bg-[url(/bg-today-large.svg)] bg-no-repeat p-6 py-[41px] md:py-0 lg:min-w-[800px]">
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
    </div>
  );
}
