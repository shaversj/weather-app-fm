import { useQuery } from '@tanstack/react-query'

export interface Location {
  id: number
  name: string
  latitude: number
  longitude: number
  country: string
  admin1?: string
  timezone: string
}

interface GeocodingResponse {
  results?: Location[]
}

async function searchCities(query: string): Promise<Location[]> {
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
    queryKey: ['city-search', query],
    queryFn: () => searchCities(query),
    enabled: query.length >= 2,
    staleTime: 1000 * 60 * 5,
  })
}
