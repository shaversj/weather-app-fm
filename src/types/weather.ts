export type PrecipUnit = "inch" | "mm";
export type TemperatureUnit = "celsius" | "fahrenheit";
export interface Units {
  isImperial: boolean;
  precipUnit: PrecipUnit;
  tempUnit: TemperatureUnit;
  windUnit: WindSpeedUnit;
}

export interface WeatherData {
  current: {
    precipitation: number;
    relative_humidity_2m: number;
    temperature_2m: number;
    time: string;
    weather_code: number;
    wind_speed_10m: number;
  };
  daily: {
    precipitation_probability_max: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    time: string[];
    weather_code: number[];
  };
  hourly: {
    temperature_2m: number[];
    time: string[];
    weather_code: number[];
  };
  latitude: number;
  longitude: number;
}

export type WindSpeedUnit = "km/h" | "mph";
