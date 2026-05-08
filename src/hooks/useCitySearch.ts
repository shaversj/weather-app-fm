import { useQuery } from '@tanstack/react-query'

export interface Location {
  admin1?: string
  country: string
  id: number
  latitude: number
  longitude: number
  name: string
  timezone: string
}

interface GeocodingResponse {
  results?: Location[]
}

export async function searchCities(query: string): Promise<Location[]> {
  const url = new URL('https://geocoding-api.open-meteo.com/v1/search')
  url.searchParams.set('name', query)
  url.searchParams.set('count', '5')
  url.searchParams.set('language', 'en')
  url.searchParams.set('format', 'json')

  const response = await fetch(url.toString())
  if (!response.ok) throw new Error('Geocoding failed')

  const data: GeocodingResponse = await response.json()
  return data.results ?? []
}

export function useCitySearch(query: string) {
  return useQuery({
    enabled: query.length >= 2,
    queryFn: () => searchCities(query),
    queryKey: ['city-search', query],
    staleTime: 1000 * 60 * 5,
  })
}
