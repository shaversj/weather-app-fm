# Weather Loading Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current single-card loading state with a full dashboard skeleton that appears during the initial weather fetch and during location/unit-triggered weather refetches.

**Architecture:** Keep the home route as the single source of truth for weather-loading display. Add one dedicated `WeatherDashboardSkeleton` component for the loading branch, revert `CurrentWeather` to resolved-data rendering only, and expand route-level tests so weather-query loading drives the skeleton while city-search activity does not.

**Tech Stack:** React 19, TanStack Router, TanStack Query, TypeScript, Tailwind CSS, Vitest, Testing Library

---

### Task 1: Add route-level tests for skeleton and live dashboard branching

**Files:**
- Modify: `src/__tests__/index-route.test.tsx`
- Reference: `src/routes/index.tsx`

- [ ] **Step 1: Write the failing route tests**

Replace `src/__tests__/index-route.test.tsx` with:

```tsx
import { render, screen, waitFor } from "@testing-library/react";

import { App } from "../routes/index";

const mockUseCitySearch = vi.fn();
const mockUseWeatherForecast = vi.fn();

vi.mock("../hooks/useCitySearch", () => ({
  useCitySearch: (...args: unknown[]) => mockUseCitySearch(...args),
}));

vi.mock("../hooks/useDebounce", () => ({
  useDebounce: (value: string) => value,
}));

vi.mock("../hooks/useWeatherForecast", () => ({
  useWeatherForecast: (...args: unknown[]) => mockUseWeatherForecast(...args),
}));

function stubGeolocation() {
  Object.defineProperty(window.navigator, "geolocation", {
    configurable: true,
    value: {
      getCurrentPosition: vi.fn((success: (position: GeolocationPosition) => void) =>
        success({
          coords: {
            accuracy: 1,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            latitude: 41.8781,
            longitude: -87.6298,
            speed: null,
          },
          timestamp: Date.now(),
        } as GeolocationPosition),
      ),
    },
  });
}

function stubReverseGeocode() {
  globalThis.fetch = vi.fn().mockResolvedValue({
    json: () =>
      Promise.resolve({
        results: [{ admin1: "Illinois", name: "Chicago" }],
      }),
    ok: true,
  });
}

function createWeatherData() {
  return {
    current: {
      precipitation: 0,
      relative_humidity_2m: 75,
      temperature_2m: 68,
      time: "2026-05-12T10:00",
      weather_code: 1,
      wind_speed_10m: 12,
    },
    daily: {
      precipitation_probability_max: [10, 20, 30, 40, 50, 60, 70],
      temperature_2m_max: [72, 73, 74, 75, 76, 77, 78],
      temperature_2m_min: [60, 61, 62, 63, 64, 65, 66],
      time: ["2026-05-12", "2026-05-13", "2026-05-14", "2026-05-15", "2026-05-16", "2026-05-17", "2026-05-18"],
      weather_code: [1, 1, 2, 2, 3, 3, 45],
    },
    hourly: {
      temperature_2m: [68, 69, 70, 71, 72, 73],
      time: ["2026-05-12T10:00", "2026-05-12T11:00", "2026-05-12T12:00", "2026-05-12T13:00", "2026-05-12T14:00", "2026-05-12T15:00"],
      weather_code: [1, 1, 1, 2, 2, 3],
    },
  };
}

describe("App route", () => {
  beforeEach(() => {
    stubGeolocation();
    stubReverseGeocode();
    mockUseCitySearch.mockReturnValue({ data: [], error: null });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the dashboard skeleton while the initial weather request is pending", async () => {
    mockUseWeatherForecast.mockReturnValue({
      data: undefined,
      error: null,
      isFetching: true,
      isPending: true,
      refetch: vi.fn(),
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Loading...")).toBeTruthy();
    });

    expect(screen.getByText("Hourly forecast")).toBeTruthy();
    expect(screen.getByText("Daily forecast")).toBeTruthy();
  });

  it("renders the dashboard skeleton during weather refetches even when stale weather data exists", async () => {
    mockUseWeatherForecast.mockReturnValue({
      data: createWeatherData(),
      error: null,
      isFetching: true,
      isPending: false,
      refetch: vi.fn(),
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Loading...")).toBeTruthy();
    });

    expect(screen.queryByText("Chicago, Illinois")).toBeNull();
  });

  it("renders the live dashboard when weather data is available and not fetching", async () => {
    mockUseWeatherForecast.mockReturnValue({
      data: createWeatherData(),
      error: null,
      isFetching: false,
      isPending: false,
      refetch: vi.fn(),
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Chicago, Illinois")).toBeTruthy();
    });

    expect(screen.getByText("68°")).toBeTruthy();
    expect(screen.getByText("Hourly Forecast")).toBeTruthy();
  });

  it("does not render the dashboard skeleton when only city-search activity changes", async () => {
    mockUseCitySearch.mockReturnValue({
      data: [{ admin1: "Illinois", country: "United States", id: 1, latitude: 41.8781, longitude: -87.6298, name: "Chicago", timezone: "America/Chicago" }],
      error: null,
    });

    mockUseWeatherForecast.mockReturnValue({
      data: createWeatherData(),
      error: null,
      isFetching: false,
      isPending: false,
      refetch: vi.fn(),
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Chicago, Illinois")).toBeTruthy();
    });

    expect(screen.queryByText("Loading...")).toBeNull();
  });
});
```

- [ ] **Step 2: Run the route test file and verify it fails**

Run:

```bash
npm test -- src/__tests__/index-route.test.tsx
```

Expected:
- FAIL because the current route/component structure still renders the old loading treatment
- At least one assertion around `Hourly forecast`, `Daily forecast`, or stale content visibility should fail

- [ ] **Step 3: Commit the failing test checkpoint**

```bash
git add src/__tests__/index-route.test.tsx
git commit -m "test: define weather dashboard skeleton behavior"
```

### Task 2: Build a dedicated loading dashboard skeleton component

**Files:**
- Create: `src/components/WeatherDashboardSkeleton.tsx`
- Reference: `src/components/WeatherStats.tsx`
- Reference: `src/components/DailyForecast.tsx`
- Reference: `src/components/HourlyForecast.tsx`

- [ ] **Step 1: Add the new skeleton component**

Create `src/components/WeatherDashboardSkeleton.tsx` with:

```tsx
import loadingIcon from "/icon-loading.svg";

function StatPlaceholder({ label }: { label: string }) {
  return (
    <div className="max-h-[118px] w-full max-w-[163.5px] space-y-6 rounded-xl bg-neutral-800 p-5 md:max-h-none md:max-w-none">
      <h3 className="text-preset-6 text-neutral-200">{label}</h3>
      <span className="text-preset-3 text-nowrap text-neutral-200">-</span>
    </div>
  );
}

export function WeatherDashboardSkeleton() {
  return (
    <div className="flex flex-col gap-x-8 pt-12 lg:flex-row lg:justify-center">
      <section>
        <div className="grid h-[286px] min-w-[800px] place-items-center rounded-4xl bg-neutral-800/95 lg:min-w-[800px]">
          <div className="flex flex-col items-center">
            <img alt="Loading" src={loadingIcon} />
            <p className="text-preset-6 text-white">Loading...</p>
          </div>
        </div>

        <div className="mt-8 flex w-full flex-wrap gap-x-6 gap-y-4 md:flex-nowrap">
          <StatPlaceholder label="Feels Like" />
          <StatPlaceholder label="Humidity" />
          <StatPlaceholder label="Wind" />
          <StatPlaceholder label="Precipitation" />
        </div>

        <h2 className="text-preset-4 pt-12 text-neutral-200">Daily forecast</h2>
        <div className="flex flex-wrap gap-4 pt-5">
          {Array.from({ length: 7 }).map((_, index) => (
            <div className="h-[110px] max-w-[103px] flex-1 rounded-xl bg-neutral-800 md:max-w-[89px] lg:h-[110px] lg:max-w-[100.5px]" key={index} />
          ))}
        </div>
      </section>

      <section className="z-0 mt-8 min-w-[384px] rounded-xl bg-neutral-800 px-6 lg:mt-0">
        <div className="flex items-center justify-between pt-6">
          <h2 className="text-preset-5 text-neutral-200">Hourly forecast</h2>
          <div className="h-10 w-20 rounded-lg bg-neutral-600" />
        </div>
        <section className="space-y-4 pt-4 pb-6">
          {Array.from({ length: 7 }).map((_, index) => (
            <div className="h-[60px] rounded-lg bg-neutral-600" key={index} />
          ))}
        </section>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Run the route test file and verify it still fails**

Run:

```bash
npm test -- src/__tests__/index-route.test.tsx
```

Expected:
- FAIL because the new component exists but the route does not render it yet

- [ ] **Step 3: Commit the component scaffold**

```bash
git add src/components/WeatherDashboardSkeleton.tsx
git commit -m "feat: add weather dashboard skeleton component"
```

### Task 3: Switch the home route to a dedicated skeleton branch

**Files:**
- Modify: `src/routes/index.tsx`
- Modify: `src/components/CurrentWeather.tsx`
- Reference: `src/components/WeatherDashboardSkeleton.tsx`

- [ ] **Step 1: Update the route and current weather component**

Update `src/routes/index.tsx`:

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import type { Location } from "../hooks/useCitySearch";

import { CurrentWeather } from "../components/CurrentWeather";
import { DailyForecast } from "../components/DailyForecast";
import { HourlyForecast } from "../components/HourlyForecast";
import { SearchSection } from "../components/SearchSection";
import { UnitsMenu } from "../components/UnitsMenu";
import { WeatherDashboardSkeleton } from "../components/WeatherDashboardSkeleton";
import { WeatherStats } from "../components/WeatherStats";
import { DEBOUNCE_DELAY_MS } from "../constants/weather";
import { useCitySearch } from "../hooks/useCitySearch";
import { useDebounce } from "../hooks/useDebounce";
import { useWeatherForecast } from "../hooks/useWeatherForecast";

import logo from "/logo.svg";

const BERLIN_LAT = 52.5244;
const BERLIN_LON = 13.4105;

async function reverseGeocode(lat: number, lon: number): Promise<string> {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("latitude", lat.toString());
  url.searchParams.set("longitude", lon.toString());
  url.searchParams.set("count", "1");
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");

  const response = await fetch(url.toString());
  if (!response.ok) return "Current Location";

  const data = await response.json();
  if (data.results && data.results.length > 0) {
    const result = data.results[0];
    return result.admin1 ? `${result.name}, ${result.admin1}` : `${result.name}, ${result.country}`;
  }
  return "Current Location";
}

export const Route = createFileRoute("/")({
  component: App,
});

export function App() {
  const [selectedDay, setSelectedDay] = useState(new Date().toLocaleDateString("en-US", { weekday: "long" }));
  const [isImperial, setIsImperial] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [defaultLocation, setDefaultLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [defaultLocationName, setDefaultLocationName] = useState<string>("Loading...");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setDefaultLocation({ lat: latitude, lon: longitude });
          const name = await reverseGeocode(latitude, longitude);
          setDefaultLocationName(name);
        },
        () => {
          setDefaultLocation({ lat: BERLIN_LAT, lon: BERLIN_LON });
          setDefaultLocationName("Berlin, Germany");
        },
      );
    } else {
      setDefaultLocation({ lat: BERLIN_LAT, lon: BERLIN_LON });
      setDefaultLocationName("Berlin, Germany");
    }
  }, []);

  const debouncedSearchInput = useDebounce(searchInput, DEBOUNCE_DELAY_MS);
  const { data: cityResults, error: searchError } = useCitySearch(debouncedSearchInput);

  const lat = selectedLocation?.latitude ?? defaultLocation?.lat ?? null;
  const lon = selectedLocation?.longitude ?? defaultLocation?.lon ?? null;

  const { data: weatherData, error: weatherError, isFetching: isFetchingWeather, isPending: isLoadingWeather, refetch } = useWeatherForecast(lat, lon, isImperial ? "fahrenheit" : "celsius");

  const displayLocation = selectedLocation?.name ?? defaultLocationName;
  const showWeatherSkeleton = isLoadingWeather || isFetchingWeather;
  const showWeatherDashboard = showWeatherSkeleton || Boolean(weatherData);

  const tempUnit = isImperial ? "Fahrenheit" : "Celsius";
  const windUnit = isImperial ? "mph" : "km/h";
  const precipUnit = isImperial ? "inches" : "mm";

  const handleToggleUnits = () => {
    setIsImperial((prev) => !prev);
    if (selectedLocation) refetch();
  };

  const handleSetTemperature = (unit: "celsius" | "fahrenheit") => {
    setIsImperial(unit === "fahrenheit");
    if (selectedLocation) refetch();
  };

  const handleSetWindSpeed = (unit: "km/h" | "mph") => {
    setIsImperial(unit === "mph");
    if (selectedLocation) refetch();
  };

  const handleSetPrecipitation = () => {
    if (selectedLocation) refetch();
  };

  const handleSelectLocation = (location: Location) => {
    setSelectedLocation(location);
  };

  if (!defaultLocation) {
    return (
      <div className="min-h-screen bg-neutral-900 px-[clamp(1rem,2vw+0.5rem,7rem)] pt-[clamp(1rem,1.5vw+0.5rem,3rem)] antialiased lg:pb-20">
        <header className="flex justify-between">
          <img alt="Logo" src={logo} />
        </header>
        <main className="flex min-h-[60vh] flex-col items-center justify-center">
          <p className="text-preset-5 text-white">Loading...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 px-[clamp(1rem,2vw+0.5rem,7rem)] pt-[clamp(1rem,1.5vw+0.5rem,3rem)] antialiased lg:pb-20">
      <header className="flex justify-between">
        <img alt="Logo" src={logo} />
        <UnitsMenu
          isImperial={isImperial}
          onSetPrecipitation={handleSetPrecipitation}
          onSetTemperature={handleSetTemperature}
          onSetWindSpeed={handleSetWindSpeed}
          onToggleUnits={handleToggleUnits}
          precipUnit={precipUnit}
          tempUnit={tempUnit}
          windUnit={windUnit}
        />
      </header>
      <main>
        <div className="flex flex-col items-center">
          <h1 className="text-preset-2 mt-16 text-white">How&apos;s the sky looking today?</h1>
          <SearchSection cityResults={cityResults} isLoadingWeather={isLoadingWeather} onSearchInputChange={setSearchInput} onSelectLocation={handleSelectLocation} searchError={searchError} selectedLocation={selectedLocation} />
          {weatherError && <p className="text-preset-7 mt-2 text-red-400">Couldn&apos;t load weather data. Please try again.</p>}
        </div>

        {showWeatherDashboard ? (
          showWeatherSkeleton ? (
            <WeatherDashboardSkeleton />
          ) : (
            <div className="flex flex-col gap-x-8 pt-12 lg:flex-row lg:justify-center">
              <section>
                <CurrentWeather location={displayLocation} weather={weatherData!.current} />
                <WeatherStats isImperial={isImperial} weather={weatherData!.current} />
                <DailyForecast daily={weatherData!.daily} />
              </section>

              <HourlyForecast daily={weatherData!.daily} hourly={weatherData!.hourly} onSelectDay={setSelectedDay} selectedDay={selectedDay} />
            </div>
          )
        ) : null}
      </main>
    </div>
  );
}
```

Update `src/components/CurrentWeather.tsx`:

```tsx
import type { WeatherData } from "../types/weather";

import { WeatherIcon } from "./WeatherIcon";

interface CurrentWeatherProps {
  location: string;
  weather: WeatherData["current"];
}

export function CurrentWeather({ location, weather }: CurrentWeatherProps) {
  return (
    <div className={"bg-accent-500 grid h-[286px] min-w-[800px] place-items-center"}>
      <div className="h-[286px] w-full rounded-4xl bg-[url(/bg-today-large.svg)] bg-no-repeat p-6 py-[41px] md:py-0 lg:min-w-[800px]">
        <div className="flex h-full w-full flex-col items-center md:flex-row">
          <div>
            <p className="text-preset-4 text-white">{location}</p>
            <p className="text-preset-6 pt-3 text-white opacity-80">
              {new Date(weather.time).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center pr-3 md:ml-auto">
            <WeatherIcon className="size-[120px]" code={weather.weather_code} />
            <span className="text-preset-1 text-white">{Math.round(weather.temperature_2m)}°</span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Run the route tests and verify they pass**

Run:

```bash
npm test -- src/__tests__/index-route.test.tsx
```

Expected:
- PASS
- Skeleton appears for `isPending` and `isFetching`
- Live dashboard appears only when weather data exists and weather loading is false

- [ ] **Step 3: Commit the route integration**

```bash
git add src/routes/index.tsx src/components/CurrentWeather.tsx src/components/WeatherDashboardSkeleton.tsx
git commit -m "feat: render full dashboard skeleton during weather loading"
```

### Task 4: Verify the full suite and tighten skeleton styling if needed

**Files:**
- Modify: `src/components/WeatherDashboardSkeleton.tsx` (only if tests pass but visual spacing still needs alignment)
- Verify: `src/components/__tests__/CurrentWeather.test.tsx`
- Verify: `src/hooks/__tests__/useCitySearch.test.tsx`
- Verify: `src/hooks/__tests__/useWeatherForecast.test.tsx`

- [ ] **Step 1: Remove or replace outdated component tests if they no longer match component responsibility**

If `src/components/__tests__/CurrentWeather.test.tsx` still expects `CurrentWeather` to render a loading state, replace it with:

```tsx
import { render, screen } from "@testing-library/react";

import { CurrentWeather } from "../CurrentWeather";

describe("CurrentWeather", () => {
  it("shows the resolved current weather details", () => {
    render(
      <CurrentWeather
        location="Chicago, Illinois"
        weather={{
          precipitation: 0,
          relative_humidity_2m: 75,
          temperature_2m: 68,
          time: "2026-05-12T10:00",
          weather_code: 1,
          wind_speed_10m: 12,
        }}
      />,
    );

    expect(screen.getByText("Chicago, Illinois")).toBeTruthy();
    expect(screen.getByText("68°")).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run the full test suite**

Run:

```bash
npm test
```

Expected:
- PASS
- Existing hook tests remain green
- Route tests cover the loading branch behavior

- [ ] **Step 3: Make final visual-only tweaks if needed, then re-run tests**

If the skeleton needs tighter alignment with the mockup, only adjust classes in `src/components/WeatherDashboardSkeleton.tsx`, then run:

```bash
npm test
```

Expected:
- PASS after any final spacing or sizing tweaks

- [ ] **Step 4: Commit the completed implementation**

```bash
git add src/components/__tests__/CurrentWeather.test.tsx src/__tests__/index-route.test.tsx src/components/WeatherDashboardSkeleton.tsx src/components/CurrentWeather.tsx src/routes/index.tsx
git commit -m "test: finalize weather loading dashboard coverage"
```
