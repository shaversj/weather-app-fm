import { render, screen } from "@testing-library/react";

import { CurrentWeather } from "../CurrentWeather";

describe("CurrentWeather", () => {
  it("shows the location, formatted date, and temperature", () => {
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
    expect(screen.getByText("May 12, 2026")).toBeTruthy();
    expect(screen.getByText("68°")).toBeTruthy();
  });
});
