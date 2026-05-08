import { useQuery } from '@tanstack/react-query'

export interface WeatherResponse {
  latitude: number
  longitude: number
  current: {
    time: string
    temperature_2m: number
    relative_humidity_2m: number
    weather_code: number
    wind_speed_10m: number
    precipitation: number
  }
  hourly: {
    time: string[]
    temperature_2m: number[]
    weather_code: number[]
  }
  daily: {
    time: string[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    weather_code: number[]
    precipitation_probability_max: number[]
  }
}

interface OpenMeteoResponse {
  latitude: number
  longitude: number
  current: WeatherResponse['current']
  hourly: WeatherResponse['hourly']
  daily: WeatherResponse['daily']
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherResponse> {
  const url = new URL('https://api.open-meteo.com/v1/forecast')
  url.searchParams.set('latitude', lat.toString())
  url.searchParams.set('longitude', lon.toString())
  url.searchParams.set('current', 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation')
  url.searchParams.set('hourly', 'temperature_2m,weather_code')
  url.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max')
  url.searchParams.set('timezone', 'auto')
  url.searchParams.set('forecast_days', '7')

  const response = await fetch(url.toString())
  if (!response.ok) throw new Error('Weather fetch failed')

  const data: OpenMeteoResponse = await response.json()
  return data as WeatherResponse
}

export function useWeatherForecast(latitude: number | null, longitude: number | null) {
  return useQuery({
    queryKey: ['weather', latitude, longitude],
    queryFn: () => fetchWeather(latitude!, longitude!),
    enabled: latitude !== null && longitude !== null,
    staleTime: 1000 * 60 * 10,
  })
}