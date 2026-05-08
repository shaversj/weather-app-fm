import { useQuery } from '@tanstack/react-query'

export interface WeatherResponse {
  current: {
    precipitation: number
    relative_humidity_2m: number
    temperature_2m: number
    time: string
    weather_code: number
    wind_speed_10m: number
  }
  daily: {
    precipitation_probability_max: number[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    time: string[]
    weather_code: number[]
  }
  hourly: {
    temperature_2m: number[]
    time: string[]
    weather_code: number[]
  }
  latitude: number
  longitude: number
}

interface OpenMeteoResponse {
  current: WeatherResponse['current']
  daily: WeatherResponse['daily']
  hourly: WeatherResponse['hourly']
  latitude: number
  longitude: number
}

export async function fetchWeather(lat: number, lon: number, temperatureUnit: 'celsius' | 'fahrenheit' = 'celsius'): Promise<WeatherResponse> {
  const url = new URL('https://api.open-meteo.com/v1/forecast')
  url.searchParams.set('latitude', lat.toString())
  url.searchParams.set('longitude', lon.toString())
  url.searchParams.set('current', 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation')
  url.searchParams.set('hourly', 'temperature_2m,weather_code')
  url.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max')
  url.searchParams.set('temperature_unit', temperatureUnit)
  url.searchParams.set('wind_speed_unit', temperatureUnit === 'fahrenheit' ? 'mph' : 'kmh')
  url.searchParams.set('precipitation_unit', temperatureUnit === 'fahrenheit' ? 'inch' : 'mm')
  url.searchParams.set('timezone', 'auto')
  url.searchParams.set('forecast_days', '7')

  const response = await fetch(url.toString())
  if (!response.ok) throw new Error('Weather fetch failed')

  const data: OpenMeteoResponse = await response.json()
  return data as WeatherResponse
}

export function useWeatherForecast(latitude: null | number, longitude: null | number, temperatureUnit: 'celsius' | 'fahrenheit' = 'celsius') {
  return useQuery({
    enabled: latitude !== null && longitude !== null,
    queryFn: () => fetchWeather(latitude!, longitude!, temperatureUnit),
    queryKey: ['weather', latitude, longitude, temperatureUnit],
    staleTime: 1000 * 60 * 10,
  })
}