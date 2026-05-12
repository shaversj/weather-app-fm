import { render, screen, waitFor } from "@testing-library/react";

import { App } from "../routes/index";

vi.mock("../hooks/useCitySearch", () => ({
  useCitySearch: () => ({
    data: [],
    error: null,
  }),
}));

vi.mock("../hooks/useDebounce", () => ({
  useDebounce: (value: string) => value,
}));

vi.mock("../hooks/useWeatherForecast", () => ({
  useWeatherForecast: () => ({
    data: undefined,
    error: null,
    isFetching: true,
    isPending: true,
    refetch: vi.fn(),
  }),
}));

describe("App route", () => {
  it("shows the current weather loading state before weather data arrives", async () => {
    const geolocation = {
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
    };

    Object.defineProperty(window.navigator, "geolocation", {
      configurable: true,
      value: geolocation,
    });

    globalThis.fetch = vi.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({
          results: [{ admin1: "Illinois", name: "Chicago" }],
        }),
      ok: true,
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getAllByText("Loading...").length).toBeGreaterThan(0);
    });
  });
});
