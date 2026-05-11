import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import clsx from "clsx";

import type { WeatherData } from "../types/weather";

import { HOURLY_FORECAST_HOURS } from "../constants/weather";
import { WeatherIcon } from "./WeatherIcon";

interface HourlyForecastProps {
  daily: WeatherData["daily"];
  hourly: WeatherData["hourly"];
  onSelectDay: (day: string) => void;
  selectedDay: string;
}

export function HourlyForecast({ daily, hourly, onSelectDay, selectedDay }: HourlyForecastProps) {
  const convertTemp = (temp: number) => Math.round(temp);

  const currentHour = new Date().getHours();
  const hourlyItems = hourly.time
    .map((time, index) => ({
      day: new Date(time).toLocaleDateString("en-US", { weekday: "long" }),
      hour: new Date(time).getHours(),
      index,
      time,
    }))
    .filter((item) => {
      const dayMatches = item.day === selectedDay;
      const withinRange = item.hour >= currentHour && item.hour < currentHour + HOURLY_FORECAST_HOURS;
      return dayMatches && withinRange;
    });

  return (
    <section className="z-0 mt-8 min-w-[384px] rounded-xl bg-neutral-800 px-6 lg:mt-0">
      <div className="flex items-center justify-between pt-6">
        <h2 className="text-preset-5 text-neutral-200">Hourly Forecast</h2>

        <div className="w-40">
          <Listbox onChange={(day) => onSelectDay(new Date(day).toLocaleDateString("en-US", { weekday: "long" }))} value={selectedDay}>
            <ListboxButton
              className={clsx("relative block w-full rounded-lg bg-white/5 py-1.5 pr-8 pl-3 text-left text-sm/6 text-white", "focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25")}
            >
              {selectedDay}
            </ListboxButton>
            <ListboxOptions anchor="bottom" className="w-(--button-width) rounded-xl border border-white/5 bg-white/5 p-1 [--anchor-gap:--spacing(1)] focus:outline-none" transition>
              {daily.time.map((time, index) => (
                <ListboxOption className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-white/10" key={index} value={time}>
                  <div className="text-sm/6 text-white">{new Date(time).toLocaleDateString("en-US", { weekday: "long" })}</div>
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Listbox>
        </div>
      </div>
      <section className="space-y-4 pt-4">
        {hourlyItems.map(({ index, time }) => (
          <div className="flex h-[60px] items-center rounded-lg bg-neutral-600 pr-4 pl-3" key={time}>
            <WeatherIcon className="size-10" code={hourly.weather_code[index]} />
            <p className="text-preset-5 text-neutral-0 pl-2">{new Date(time).toLocaleTimeString("en-US", { hour: "numeric", hour12: true })}</p>
            <p className="text-preset-7 text-neutral-0 ml-auto">{convertTemp(hourly.temperature_2m[index])}°</p>
          </div>
        ))}
      </section>
    </section>
  );
}
