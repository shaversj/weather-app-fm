import type { WeatherData } from "../types/weather";

import { WeatherIcon } from "./WeatherIcon";

interface DailyForecastProps {
  daily: WeatherData["daily"];
}

export function DailyForecast({ daily }: DailyForecastProps) {
  const convertTemp = (temp: number) => Math.round(temp);

  return (
    <>
      <h2 className="text-preset-4 pt-12 text-neutral-200">Daily Forecast</h2>
      <div className="flex flex-wrap gap-4 pt-5">
        {daily.time.map((time, index) => (
          <div className="max-w-[103px] flex-1 space-y-4 rounded-xl bg-neutral-800 py-4 md:max-w-[89px] lg:max-w-[100.5px]" key={time}>
            <h3 className="text-preset-6 text-center text-neutral-200">{new Date(time).toLocaleDateString("en-US", { weekday: "short" })}</h3>
            <WeatherIcon className="mx-auto size-[60px]" code={daily.weather_code[index]} />
            <div className="text-preset-7 flex justify-between px-2.5 text-neutral-200">
              <p>{convertTemp(daily.temperature_2m_max[index])}°</p>
              <p>{convertTemp(daily.temperature_2m_min[index])}°</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
