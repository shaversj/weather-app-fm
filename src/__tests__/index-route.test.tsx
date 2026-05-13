import { fireEvent, render, screen, waitFor } from "@testing-library/react";

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
      expect(screen.getByText("Loading...", { selector: "p" })).toBeTruthy();
    });

    const loadingDashboardWrappers = Array.from(document.querySelectorAll("div")).filter(
      (element) => element.className === "flex flex-col gap-x-8 pt-12 lg:flex-row lg:justify-center",
    );

    expect(loadingDashboardWrappers).toHaveLength(1);
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

    expect(screen.getByText("Hourly forecast")).toBeTruthy();
    expect(screen.getByText("Daily forecast")).toBeTruthy();
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
    expect(screen.getByText("Daily Forecast")).toBeTruthy();
    expect(screen.queryByText("Loading...")).toBeNull();
  });

  it("keeps the settled weather dashboard visible during city-search activity", async () => {
    const cityResults = [{ admin1: "Illinois", country: "United States", id: 1, latitude: 41.8781, longitude: -87.6298, name: "Chicago", timezone: "America/Chicago" }];

    mockUseCitySearch.mockImplementation((query: string) => ({
      data: query.length >= 2 ? cityResults : [],
      error: null,
    }));

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

    const searchInput = screen.getByPlaceholderText("Search for a place...");

    fireEvent.change(searchInput, { target: { value: "Ch" } });

    await waitFor(() => {
      expect(mockUseCitySearch).toHaveBeenLastCalledWith("Ch");
    });

    expect(screen.getByDisplayValue("Ch")).toBeTruthy();
    expect(screen.getByRole("button", { name: /ChicagoIllinois, United States/i })).toBeTruthy();
    expect(screen.getByText("68°")).toBeTruthy();
    expect(screen.getByText("Hourly Forecast")).toBeTruthy();
    expect(screen.getByText("Daily Forecast")).toBeTruthy();
    expect(screen.queryByText("Loading...")).toBeNull();
  });
});
