import { render, screen } from "@testing-library/react";

import { CurrentWeather } from "../CurrentWeather";

describe("CurrentWeather", () => {
  it("shows a loading state when weather data is not available yet", () => {
    render(<CurrentWeather isLoadingWeather location="Chicago, Illinois" weather={undefined} />);

    expect(screen.getByText("Loading...")).toBeTruthy();
    expect(screen.getByAltText("Loading")).toBeTruthy();
  });

  it("shows weather details when loading is complete", () => {
    render(
      <CurrentWeather
        isLoadingWeather={false}
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
