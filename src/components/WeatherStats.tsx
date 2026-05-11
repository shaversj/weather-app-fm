import type { WeatherData } from "../types/weather";

interface WeatherStatsProps {
  isImperial: boolean;
  weather: WeatherData["current"];
}

export function WeatherStats({ isImperial, weather }: WeatherStatsProps) {
  const tempValue = isImperial ? Math.round((weather.temperature_2m * 9) / 5 + 32) : Math.round(weather.temperature_2m);
  const tempUnit = isImperial ? "°F" : "°C";
  const windValue = isImperial ? Math.round(weather.wind_speed_10m * 0.621371) : weather.wind_speed_10m;
  const windUnit = isImperial ? "mph" : "km/h";
  const precipValue = isImperial ? (weather.precipitation * 0.0393701).toFixed(1) : weather.precipitation.toFixed(1);
  const precipUnit = isImperial ? "in" : "mm";

  return (
    <div className="mt-8 flex w-full flex-wrap gap-x-6 gap-y-4 md:flex-nowrap">
      <div className="max-h-[118px] w-full max-w-[163.5px] space-y-6 rounded-xl bg-neutral-800 p-5 md:max-h-none md:max-w-none">
        <h3 className="text-preset-6 text-neutral-200">Feels Like</h3>
        <span className="text-preset-3 text-nowrap text-neutral-200">
          {tempValue}
          {tempUnit}
        </span>
      </div>
      <div className="max-h-[118px] w-full max-w-[163.5px] space-y-6 rounded-xl bg-neutral-800 p-5 md:max-h-none md:max-w-none">
        <h3 className="text-preset-6 text-neutral-200">Humidity</h3>
        <span className="text-preset-3 text-nowrap text-neutral-200">{weather.relative_humidity_2m}%</span>
      </div>
      <div className="max-h-[118px] w-full max-w-[163.5px] space-y-6 rounded-xl bg-neutral-800 p-5 md:max-h-none md:max-w-none">
        <h3 className="text-preset-6 text-neutral-200">Wind</h3>
        <span className="text-preset-3 text-nowrap text-neutral-200">
          {windValue} {windUnit}
        </span>
      </div>
      <div className="max-h-[118px] w-full max-w-[163.5px] space-y-6 rounded-xl bg-neutral-800 p-5 md:max-h-none md:max-w-none">
        <h3 className="text-preset-6 text-neutral-200">Precipitation</h3>
        <span className="text-preset-3 text-nowrap text-neutral-200">
          {precipValue} {precipUnit}
        </span>
      </div>
    </div>
  );
}
