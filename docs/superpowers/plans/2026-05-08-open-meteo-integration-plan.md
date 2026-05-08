# Open-Meteo Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace static weather data with live Open-Meteo API calls using TanStack Query hooks.

**Architecture:** Two custom hooks (`useCitySearch`, `useWeatherForecast`) handle API calls. Components remain thin. TanStack Query provides caching and loading states. Existing static data preserved as fallback.

**Tech Stack:** TypeScript, TanStack Query, React Router (TanStack), CSS (existing)

---

## File Structure

```
src/
  hooks/
    useCitySearch.ts       # New - geocoding API hook
    useWeatherForecast.ts  # New - weather API hook
  routes/
    index.tsx              # Modify - connect hooks to UI
  data/
    mydata.ts             # Keep as fallback
    location.ts           # Keep as fallback
```

---

## Tasks

### Task 1: `useCitySearch` Hook

**Files:**
- Create: `src/hooks/useCitySearch.ts`
- Test: `src/hooks/__tests__/useCitySearch.test.ts`

- [ ] **Step 1: Create hooks directory**

```bash
mkdir -p src/hooks/__tests__
```

- [ ] **Step 2: Write the hook**

```typescript
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
```

- [ ] **Step 3: Write tests**

```typescript
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useCitySearch } from '../useCitySearch'

const createWrapper = () => {
  const queryClient = new QueryClient()
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useCitySearch', () => {
  it('returns empty when query < 2 chars', async () => {
    const { result } = renderHook(() => useCitySearch('a'), { wrapper: createWrapper() })
    expect(result.current.data).toBeUndefined()
  })

  it('fetches cities when query >= 2 chars', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ results: [{ id: 1, name: 'Springfield', latitude: 37.2, longitude: -93.3, country: 'US', timezone: 'America/Chicago' }] }),
    })

    const { result } = renderHook(() => useCitySearch('Spring'), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.data).toHaveLength(1)
  })
})
```

- [ ] **Step 4: Verify tests pass**

Run: `npm test -- --reporter=verbose src/hooks/__tests__/useCitySearch.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useCitySearch.ts src/hooks/__tests__/useCitySearch.test.ts
git commit -m "feat: add useCitySearch hook for geocoding API"
```

---

### Task 2: `useWeatherForecast` Hook

**Files:**
- Create: `src/hooks/useWeatherForecast.ts`
- Test: `src/hooks/__tests__/useWeatherForecast.test.ts`

- [ ] **Step 1: Write the hook** (matches existing `mydata.ts` structure)

```typescript
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

async function fetchWeather(lat: number, lon: number): Promise<WeatherResponse> {
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
```

- [ ] **Step 2: Write tests**

```typescript
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useWeatherForecast } from '../useWeatherForecast'

const createWrapper = () => {
  const queryClient = new QueryClient()
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useWeatherForecast', () => {
  it('does not fetch when lat/lon are null', () => {
    const { result } = renderHook(() => useWeatherForecast(null, null), { wrapper: createWrapper() })
    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBeUndefined()
  })

  it('fetches weather when lat/lon provided', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        latitude: 37.2,
        longitude: -93.3,
        current: { time: '2025-11-18T15:00', temperature_2m: 65.9, relative_humidity_2m: 92, weather_code: 3, wind_speed_10m: 19.5, precipitation: 0 },
        hourly: { time: ['2025-11-18T15:00'], temperature_2m: [65.9], weather_code: [3] },
        daily: { time: ['2025-11-18'], temperature_2m_max: [72.9], temperature_2m_min: [56.6], weather_code: [3], precipitation_probability_max: [25] },
      }),
    })

    const { result } = renderHook(() => useWeatherForecast(37.2, -93.3), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.data?.current.temperature_2m).toBe(65.9)
  })
})
```

- [ ] **Step 3: Verify tests pass**

Run: `npm test -- --reporter=verbose src/hooks/__tests__/useWeatherForecast.test.ts`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useWeatherForecast.ts src/hooks/__tests__/useWeatherForecast.test.ts
git commit -m "feat: add useWeatherForecast hook for weather API"
```

---

### Task 3: Connect Hooks to UI in `index.tsx`

**Files:**
- Modify: `src/routes/index.tsx`

- [ ] **Step 1: Add state and hooks to component**

In `index.tsx`, add imports and state:

```typescript
import { useCitySearch } from "../hooks/useCitySearch"
import { useWeatherForecast } from "../hooks/useWeatherForecast"
import type { Location } from "../hooks/useCitySearch"

const [searchInput, setSearchInput] = useState("")
const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)

const { data: cityResults, isLoading: isSearchingCities, error: searchError } = useCitySearch(searchInput)
const { data: weatherData, isLoading: isLoadingWeather, error: weatherError } = useWeatherForecast(
  selectedLocation?.latitude ?? null,
  selectedLocation?.longitude ?? null
)
```

- [ ] **Step 2: Add city dropdown below search input**

After the search input div, add:

```tsx
{searchError && (
  <p className={"text-preset-7 mt-2 text-red-400"}>Couldn't find cities. Try a different name.</p>
)}

{cityResults && cityResults.length > 0 && (
  <div className={"mx-auto mt-2 w-full max-w-[526px] rounded-xl bg-neutral-800"}>
    {cityResults.map((city) => (
      <button
        key={city.id}
        className={"flex w-full items-center px-4 py-2 text-left hover:bg-neutral-700"}
        onClick={() => {
          setSelectedLocation(city)
          setSearchInput(city.name)
        }}
      >
        <span className={"text-preset-5 text-neutral-200"}>{city.name}</span>
        <span className={"text-preset-7 ml-2 text-neutral-400"}>{city.admin1}, {city.country}</span>
      </button>
    ))}
  </div>
)}

{weatherError && (
  <p className={"text-preset-7 mt-2 text-red-400"}>Couldn't load weather data. Please try again.</p>
)}
```

- [ ] **Step 3: Add loading state to search button**

```tsx
<Button
  className={"text-preset-5 rounded-xl bg-[#4658D9] px-4 text-neutral-200 disabled:opacity-50"}
  disabled={!selectedLocation || isLoadingWeather}
  onClick={() => {}}
>
  {isLoadingWeather ? "Loading..." : "Search"}
</Button>
```

- [ ] **Step 4: Replace static data with live data**

Replace `data.daily.time` with `weatherData?.daily.time`, etc. Use optional chaining for safety. Keep static data as fallback:

```tsx
const displayWeather = weatherData ?? data
const displayLocation = selectedLocation?.name ?? "Berlin, Germany"
```

- [ ] **Step 5: Verify build passes**

Run: `npm run build`
Expected: SUCCESS with no errors

- [ ] **Step 6: Commit**

```bash
git add src/routes/index.tsx
git commit -m "feat: connect useCitySearch and useWeatherForecast to UI"
```

---

### Task 4: Final Verification

- [ ] **Step 1: Run full test suite**

Run: `npm test`
Expected: All tests pass

- [ ] **Step 2: Run linting**

Run: `npm run lint`
Expected: No errors

---

## Verification Checklist

- [ ] Geocoding search works (type 2+ chars, see dropdown, select city)
- [ ] Weather loads when Search clicked
- [ ] Error messages appear inline below search bar
- [ ] Previous weather stays visible on weather fetch failure
- [ ] All tests pass
- [ ] Build succeeds