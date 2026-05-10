import { Button, Input, Listbox, ListboxButton, ListboxOption, ListboxOptions, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { createFileRoute } from "@tanstack/react-router";
import clsx from "clsx";
import { useState } from "react";

import type { Location } from "../hooks/useCitySearch";

import { weatherData as data } from "../data/mydata";
import { useCitySearch } from "../hooks/useCitySearch";
import { useWeatherForecast } from "../hooks/useWeatherForecast";

import checkmark from "/icon-checkmark.svg";
import drizzle from "/icon-drizzle.webp";
import dropdown from "/icon-dropdown.svg";
import fog from "/icon-fog.webp";
import overcast from "/icon-overcast.webp";
import partlyCloudy from "/icon-partly-cloudy.webp";
import rain from "/icon-rain.webp";
import search from "/icon-search.svg";
import snow from "/icon-snow.webp";
import storm from "/icon-storm.webp";
import sunny from "/icon-sunny.webp";
import units from "/icon-units.svg";
import logo from "/logo.svg";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const [selectedDay, setselectedDay] = useState(new Date().toLocaleDateString("en-US", { weekday: "long" }));
  const [tempUnit, setTempUnit] = useState("Celsius");
  const [windUnit, setWindUnit] = useState("km/h");
  const [precipUnit, setprecipUnit] = useState("mm");
  const [isImperial, setIsImperial] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const { data: cityResults, error: searchError } = useCitySearch(searchInput);
  const { data: weatherData, error: weatherError, isLoading: isLoadingWeather, refetch } = useWeatherForecast(selectedLocation?.latitude ?? null, selectedLocation?.longitude ?? null, isImperial ? "fahrenheit" : "celsius");

  const displayWeather = weatherData ?? data;
  const displayLocation = selectedLocation?.name ?? "Berlin, Germany";

  const selectedDayHandler = (day: string) => {
    const weekday = new Date(day).toLocaleDateString("en-US", { weekday: "long" });
    setselectedDay(weekday);
  };

  function toggleUnits() {
    setIsImperial(!isImperial);
    setTempUnit(isImperial ? "Celsius" : "Fahrenheit");
    setWindUnit(isImperial ? "km/h" : "mph");
    setprecipUnit(isImperial ? "mm" : "inches");
    if (selectedLocation) {
      refetch();
    }
  }

  function setTemperatureUnit(unit: "Celsius" | "Fahrenheit") {
    setTempUnit(unit);
    const nowImperial = unit === "Fahrenheit";
    setIsImperial(nowImperial);
    setWindUnit(nowImperial ? "mph" : "km/h");
    setprecipUnit(nowImperial ? "inches" : "mm");
    if (selectedLocation) {
      refetch();
    }
  }

  const displayTemp = (temp: number) => temp;

  function getWeatherIcon(code: number) {
    switch (code) {
      case 0:
        return sunny;
      case 1:
        return sunny;
      case 2:
        return partlyCloudy;
      case 3:
        return overcast;
      case 45:
        return fog;
      case 48:
        return fog;
      case 51:
        return drizzle;
      case 53:
        return drizzle;
      case 55:
        return drizzle;
      case 56:
        return rain;
      case 57:
        return rain;
      case 61:
        return rain;
      case 63:
        return rain;
      case 65:
        return rain;
      case 66:
        return rain;
      case 67:
        return rain;
      case 71:
        return snow;
      case 73:
        return snow;
      case 75:
        return snow;
      case 77:
        return snow;
      case 80:
        return rain;
      case 81:
        return rain;
      case 82:
        return rain;
      case 85:
        return snow;
      case 86:
        return snow;
      case 95:
        return storm;
      case 96:
        return storm;
      case 99:
        return storm;
      default:
        return sunny;
    }
  }

  return (
    // <!-- replaces: px-4 pt-4 md:px-6 md:pt-6 lg:px-28 lg:pt-12 -->
    <div className="min-h-screen bg-neutral-900 px-[clamp(1rem,2vw+0.5rem,7rem)] pt-[clamp(1rem,1.5vw+0.5rem,3rem)] antialiased lg:pb-20">
      <header className={"flex justify-between"}>
        <img alt="Logo" src={logo} />
        <div className={"flex items-center rounded-md bg-neutral-800"}>
          <Menu>
            <MenuButton className="text-preset-7 text-neutral-0 inline-flex items-center gap-2 bg-neutral-800 px-3 py-1.5 font-semibold focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white">
              <img alt={"Units Icon"} src={units} />
              Units
              <img alt={"Dropdown Icon"} src={dropdown} />
            </MenuButton>

            <MenuItems anchor={"bottom end"} className={"mt-2.5 w-[214px] rounded-xl bg-neutral-800 px-2 outline-none"} transition>
              <button className={"mt-1.5 h-[39px] w-full px-2 text-left hover:rounded-md hover:bg-gray-700"} onClick={toggleUnits}>
                <span className={"text-preset-7 text-neutral-0"}>{isImperial ? "Switch to Metric" : "Switch to Imperial"}</span>
              </button>

              <p className={"text-preset-8 my-2 px-2 text-neutral-300"}>Temperature</p>
              <MenuItem>
                <button
                  className={"text-neutral-0 text-preset-7 flex h-[39px] w-full items-center px-2 py-2 hover:rounded-md hover:bg-gray-700"}
                  onClick={() => {
                    setIsImperial(false);
                    setWindUnit("km/h");
                    setprecipUnit("mm");
                    setTemperatureUnit("Celsius");
                  }}
                >
                  <span>Celsius (°C)</span>
                  {tempUnit === "Celsius" ? <img alt={"Checkmark Icon"} className={"ml-auto size-4"} src={checkmark} /> : null}
                </button>
              </MenuItem>
              <MenuItem>
                <button
                  className={"text-neutral-0 text-preset-7 flex h-[39px] w-full items-center px-2 py-2 hover:rounded-md hover:bg-gray-700"}
                  onClick={() => {
                    setIsImperial(true);
                    setWindUnit("mph");
                    setprecipUnit("inches");
                    setTemperatureUnit("Fahrenheit");
                  }}
                >
                  <span>Fahrenheit (°F)</span>
                  {tempUnit === "Fahrenheit" ? <img alt={"Checkmark Icon"} className={"ml-auto size-4"} src={checkmark} /> : null}
                </button>
              </MenuItem>

              <hr className={"mx-2 my-1 h-[1px] border-neutral-600"} />
              <p className={"text-preset-8 my-2 px-2 text-neutral-300"}>Wind Speed</p>
              <MenuItem>
                <button className={"text-neutral-0 text-preset-7 flex h-[39px] w-full items-center px-2 py-2 hover:rounded-md hover:bg-gray-700"} onClick={() => setWindUnit("km/h")}>
                  <span>km/h</span>
                  {windUnit === "km/h" ? <img alt={"Checkmark Icon"} className={"ml-auto size-4"} src={checkmark} /> : null}
                </button>
              </MenuItem>
              <MenuItem>
                <button className={"text-neutral-0 text-preset-7 flex h-[39px] w-full items-center px-2 py-2 hover:rounded-md hover:bg-gray-700"} onClick={() => setWindUnit("mph")}>
                  <span>mph</span>
                  {windUnit === "mph" ? <img alt={"Checkmark Icon"} className={"ml-auto size-4"} src={checkmark} /> : null}
                </button>
              </MenuItem>
              <hr className={"mx-2 my-1 h-[1px] border-neutral-600"} />
              <p className={"text-preset-8 my-2 px-2 text-neutral-300"}>Precipitation</p>
              <MenuItem>
                <button className={"text-neutral-0 text-preset-7 flex h-[39px] w-full items-center px-2 py-2 hover:rounded-md hover:bg-gray-700"} onClick={() => setprecipUnit("mm")}>
                  <span>Millimeters (mm)</span>
                  {precipUnit === "mm" ? <img alt={"Checkmark Icon"} className={"ml-auto size-4"} src={checkmark} /> : null}
                </button>
              </MenuItem>
              <MenuItem>
                <button className={"text-neutral-0 text-preset-7 flex h-[39px] w-full items-center px-2 py-2 hover:rounded-md hover:bg-gray-700"} onClick={() => setprecipUnit("inches")}>
                  <span>Inches (in)</span>
                  {precipUnit === "inches" ? <img alt={"Checkmark Icon"} className={"ml-auto size-4"} src={checkmark} /> : null}
                </button>
              </MenuItem>
            </MenuItems>
          </Menu>
        </div>
      </header>
      <main className={""}>
        <div className={"flex flex-col items-center"}>
          <h1 className={"text-preset-2 mt-16 text-white"}>How's the sky looking today?</h1>
          <div className={"relative mx-auto mt-16 w-full lg:w-[526px]"}>
            <div className={"flex h-14 w-full items-center gap-4 rounded-xl bg-[#262540] px-4"}>
              <img alt={"Search Icon"} className={"size-5"} src={search} />
              <Input
                className={"text-preset-5 placeholder:text-preset-5 h-6 w-full text-neutral-200 placeholder-neutral-200 outline-none"}
                name={"Search"}
                onChange={(e) => {
                setSearchInput(e.target.value);
                setShowCityDropdown(true);
              }}
                placeholder={"Search for a place..."}
                type={"text"}
                value={searchInput}
              />
            </div>
            <Button className={"text-preset-5 absolute top-0 right-0 flex h-14 items-center rounded-xl bg-[#4658d9] px-4 text-neutral-200"} disabled={!selectedLocation || isLoadingWeather} onClick={() => {}}>
              {isLoadingWeather ? "Loading..." : "Search"}
            </Button>
            {searchError && <p className={"text-preset-7 mt-2 text-red-400"}>Couldn't find cities. Try a different name.</p>}
            {showCityDropdown && cityResults && cityResults.length > 0 && (
              <div className={"absolute right-0 left-0 mt-1 rounded-xl bg-neutral-800"}>
                {cityResults.map((city) => (
                  <button
                    className={"flex w-full items-center px-4 py-2 text-left hover:bg-neutral-700"}
                    key={city.id}
                    onClick={() => {
                      setSelectedLocation(city);
                      setSearchInput(city.name);
                      setShowCityDropdown(false);
                    }}
                  >
                    <span className={"text-preset-5 text-neutral-200"}>{city.name}</span>
                    <span className={"text-preset-7 ml-2 text-neutral-400"}>
                      {city.admin1}, {city.country}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {weatherError && <p className={"text-preset-7 mt-2 text-red-400"}>Couldn't load weather data. Please try again.</p>}
        </div>

        <div className={"flex flex-col gap-x-8 pt-12 lg:flex-row lg:justify-center"}>
          <section>
            <div>
              <div className={"h-[286px] rounded-4xl bg-[url(/bg-today-large.svg)] bg-no-repeat p-6 py-[41px] md:py-0"}>
                {/*<img alt={"Background Today"} className={"min-w-full"} src={"/bg-today-large.svg"} />*/}
                <div className={"flex h-full w-full flex-col items-center md:flex-row"}>
                  <div className={""}>
                    <p className={"text-preset-4 text-white"}>{displayLocation}</p>
                    <p className={"text-preset-6 pt-3 text-white opacity-80"}>{new Date(displayWeather.current.time).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}</p>
                  </div>
                  <div className={"flex items-center pr-3 md:ml-auto"}>
                    <img alt={"Weather Icon"} className={"size-[120px]"} src={getWeatherIcon(displayWeather.current.weather_code)} />
                    <span className={"text-preset-1 text-white"}>{displayTemp(displayWeather.current.temperature_2m)}°</span>
                  </div>
                </div>
              </div>
              <div></div>
              <div className={"mt-8 flex w-full flex-wrap gap-x-6 gap-y-4 md:flex-nowrap"}>
                <div className={"max-h-[118px] w-full max-w-[163.5px] space-y-6 rounded-xl bg-[#262540] p-5 md:max-h-none md:max-w-none"}>
                  <h3 className={"text-preset-6 text-neutral-200"}>Feels Like</h3>
                  <span className={"text-preset-3 text-nowrap text-neutral-200"}>{displayTemp(displayWeather.current.temperature_2m)}°</span>
                </div>
                <div className={"max-h-[118px] w-full max-w-[163.5px] space-y-6 rounded-xl bg-[#262540] p-5 md:max-h-none md:max-w-none"}>
                  <h3 className={"text-preset-6 text-neutral-200"}>Humidity</h3>
                  <span className={"text-preset-3 text-nowrap text-neutral-200"}>{displayWeather.current.relative_humidity_2m}%</span>
                </div>
                <div className={"max-h-[118px] w-full max-w-[163.5px] space-y-6 rounded-xl bg-[#262540] p-5 md:max-h-none md:max-w-none"}>
                  <h3 className={"text-preset-6 text-neutral-200"}>Wind</h3>
                  <span className={"text-preset-3 text-nowrap text-neutral-200"}>
                    {displayWeather.current.wind_speed_10m} {isImperial ? "mph" : "km/h"}
                  </span>
                </div>
                <div className={"max-h-[118px] w-full max-w-[163.5px] space-y-6 rounded-xl bg-[#262540] p-5 md:max-h-none md:max-w-none"}>
                  <h3 className={"text-preset-6 text-neutral-200"}>Precipitation</h3>
                  <span className={"text-preset-3 text-nowrap text-neutral-200"}>{displayWeather.current.precipitation} mm</span>
                </div>
              </div>
            </div>

            <h2 className={"text-preset-4 pt-12 text-neutral-200"}>Daily Forecast</h2>

            <div className={"flex flex-wrap gap-4 pt-5"}>
              {displayWeather.daily.time.map((time, index) => (
                <div className={"max-w-[103px] flex-1 space-y-4 rounded-xl bg-[#262540] py-4 md:max-w-[89px] lg:max-w-[100.5px]"} key={time}>
                  <h3 className={"text-preset-6 text-center text-neutral-200"}>{new Date(time).toLocaleDateString("en-US", { weekday: "short" })}</h3>
                  <img alt={"Weather Icon"} className={"mx-auto size-[60px]"} src={getWeatherIcon(displayWeather.daily.weather_code[index])} />
                  <div className={"text-preset-7 flex justify-between px-2.5 text-neutral-200"}>
                    <p>{displayTemp(displayWeather.daily.temperature_2m_max[index])}°</p>
                    <p>{displayTemp(displayWeather.daily.temperature_2m_min[index])}°</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={"z-0 mt-8 min-w-[384px] rounded-xl bg-[#262540] px-6 lg:mt-0"}>
            <div className={"flex items-center justify-between pt-6"}>
              <h2 className={"text-preset-5 text-neutral-200"}>Hourly Forecast</h2>

              <div className="z-10 w-40">
                <Listbox onChange={selectedDayHandler} value={selectedDay}>
                  <ListboxButton
                    className={clsx("relative block w-full rounded-lg bg-white/5 py-1.5 pr-8 pl-3 text-left text-sm/6 text-white", "focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25")}
                  >
                    {selectedDay}
                  </ListboxButton>
                  <ListboxOptions
                    anchor="bottom"
                    className={clsx("w-(--button-width) rounded-xl border border-white/5 bg-white/5 p-1 [--anchor-gap:--spacing(1)] focus:outline-none", "transition duration-100 ease-in data-leave:data-closed:opacity-0")}
                    transition
                  >
                    {displayWeather.daily.time.map((time, index) => (
                      <ListboxOption className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-white/10" key={index} value={time}>
                        <div className="text-sm/6 text-white">{new Date(time).toLocaleDateString("en-US", { weekday: "long" })}</div>
                      </ListboxOption>
                    ))}
                  </ListboxOptions>
                </Listbox>
              </div>
            </div>
            <section className={"space-y-4 pt-4"}>
              {displayWeather.hourly.time.map((time, index) => {
                const day = new Date(time).toLocaleDateString("en-US", { weekday: "long" });
                if (day === selectedDay) {
                  const currentHour = new Date().getHours();
                  const timeHour = new Date(time).getHours();
                  if (timeHour >= currentHour && timeHour < currentHour + 8) {
                    return (
                      <div className={"flex h-[60px] items-center rounded-lg bg-[#3C3B5E] pr-4 pl-3"} key={time}>
                        <img alt={"Weather Icon"} className={"size-10"} src={getWeatherIcon(displayWeather.hourly.weather_code[index])} />
                        <p className={"text-preset-5 text-neutral-0 pl-2"}>{new Date(time).toLocaleTimeString("en-US", { hour: "numeric", hour12: true })}</p>
                        <p className={"text-preset-7 text-neutral-0 ml-auto"}>{displayTemp(displayWeather.hourly.temperature_2m[index])}°</p>
                      </div>
                    );
                  }
                }
              })}
            </section>
          </section>
        </div>
      </main>
    </div>
  );
}
