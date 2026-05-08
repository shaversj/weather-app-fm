# Open-Meteo Integration Design

## Context

Weather app currently uses static data in `src/data/mydata.ts` and `src/data/location.ts`. The data structure mirrors Open-Meteo's API responses exactly. Goal: replace static data with live API calls.

## User Flow

1. User types in search input (2+ characters)
2. Live dropdown shows city suggestions (debounced 300ms)
3. User clicks a suggestion → selected city stored with lat/lon
4. User clicks Search button → weather loads for selected city
5. On API error → inline error message below search bar, previous data stays visible

## Architecture

```
User types → useCitySearch(query) → dropdown of cities
User selects city → stores {name, latitude, longitude}
User clicks Search → useWeatherForecast(lat, lon) → weather data
```

## API Integration

### Geocoding API
- **URL:** `GET https://geocoding-api.open-meteo.com/v1/search`
- **Params:** `name` (required), `count=5`, `language=en`, `format=json`
- **Response:** Array of locations with lat/lon/timezone (matches `src/data/location.ts` structure)

### Weather API
- **URL:** `GET https://api.open-meteo.com/v1/forecast`
- **Params:** `latitude`, `longitude`, `current`, `hourly`, `daily`, `timezone=auto`
- **Response:** Matches existing `src/data/mydata.ts` structure

## Custom Hooks

### `useCitySearch(query: string)`
- Enabled when query.length >= 2
- Debounced 300ms
- Returns `{ data: Location[], isLoading, error }`
- Uses TanStack Query for caching

### `useWeatherForecast(latitude: number, longitude: number)`
- Fetches on lat/lon change
- Returns `{ data: WeatherResponse, isLoading, error }`
- WeatherResponse shape matches existing `mydata.ts` structure

## Component Changes

### `src/routes/index.tsx`
Add state:
```ts
const [searchQuery, setSearchQuery] = useState("")
const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
```

- Search input triggers `useCitySearch` on change, shows dropdown
- City dropdown renders when search results exist
- Search button triggers `useWeatherForecast` when clicked (enabled only when `selectedLocation` exists)
- Location name displayed instead of hardcoded "Berlin, Germany"

## Error Handling

Inline error below search bar:
- Geocoding error → "Couldn't find cities. Try a different name."
- Weather error → "Couldn't load weather data. Please try again."
- Previous weather data remains visible on weather fetch failure

## File Changes

| File | Action |
|------|--------|
| `src/hooks/useCitySearch.ts` | New |
| `src/hooks/useWeatherForecast.ts` | New |
| `src/routes/index.tsx` | Modify - connect hooks to UI |
| `src/data/mydata.ts` | Keep as fallback |
| `src/data/location.ts` | Keep as fallback |

## Design Principles

- Hooks handle data fetching and state
- Components handle rendering and user interaction
- Clear separation: hooks don't know about UI, components don't know about API
- TanStack Query provides caching and loading states
- Existing `mydata.ts` and `location.ts` can serve as initial/demo data