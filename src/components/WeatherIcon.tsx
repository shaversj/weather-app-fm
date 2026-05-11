import { WMO_CODES } from "../constants/weather";

import drizzle from "/icon-drizzle.webp";
import fog from "/icon-fog.webp";
import overcast from "/icon-overcast.webp";
import partlyCloudy from "/icon-partly-cloudy.webp";
import rain from "/icon-rain.webp";
import snow from "/icon-snow.webp";
import storm from "/icon-storm.webp";
import sunny from "/icon-sunny.webp";

type WeatherKey = keyof typeof WMO_CODES;

const iconMap: Record<WeatherKey, string> = {
  drizzle,
  fog,
  overcast,
  partlyCloudy,
  rain,
  snow,
  storm,
  sunny,
};

interface WeatherIconProps {
  className?: string;
  code: number;
}

export function WeatherIcon({ className, code }: WeatherIconProps) {
  const key = findWeatherKey(code);
  const src = iconMap[key];
  return <img alt="Weather Icon" className={className} src={src} />;
}

function findWeatherKey(code: number): WeatherKey {
  for (const [key, codes] of Object.entries(WMO_CODES)) {
    if (codes.includes(code)) {
      return key as WeatherKey;
    }
  }
  return "sunny";
}

export { drizzle, fog, overcast, partlyCloudy, rain, snow, storm, sunny };
export type { WeatherKey };
