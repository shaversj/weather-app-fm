import { Button, Input, Listbox, ListboxButton, ListboxOption, ListboxOptions, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { createFileRoute } from "@tanstack/react-router";
import clsx from "clsx";
import { useState } from "react";

import { weatherData as data } from "../data/mydata";

import checkmark from "/icon-checkmark.svg";
import drizzle from "/icon-drizzle.webp";
import dropdown from "/icon-dropdown.svg";
import search from "/icon-search.svg";
import sunny from "/icon-sunny.webp";
import units from "/icon-units.svg";
import storm from "/icon-storm.webp";
import snow from "/icon-snow.webp";
import rain from "/icon-rain.webp";
import partlyCloudy from "/icon-partly-cloudy.webp";
import overcast from "/icon-overcast.webp";
import fog from "/icon-fog.webp";
import logo from "/logo.svg";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const [selectedDay, setselectedDay] = useState(new Date(data.daily.time[0]).toLocaleDateString("en-US", { weekday: "long" }));
  const [tempUnit, setTempUnit] = useState("Celsius");
  const [windUnit, setWindUnit] = useState("km/h");
  const [precipUnit, setPrecipUnit] = useState("mm");
  const [isImperial, setIsImperial] = useState(false);

  const selectedDayHandler = (day: string) => {
    const weekday = new Date(day).toLocaleDateString("en-US", { weekday: "long" });
    setselectedDay(weekday);
  };

  function toggleUnits() {
    if (isImperial) {
      setTempUnit("Celsius");
      setWindUnit("km/h");
      setPrecipUnit("mm");
      setIsImperial(!isImperial);
      return;
    } else {
      setTempUnit("Fahrenheit");
      setWindUnit("mph");
      setPrecipUnit("inches");
      setIsImperial(!isImperial);
      return;
    }
  }

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
      case 80:
        return rain;
      case 81:
        return rain;
      case 82:
        return rain;
      case 71:
        return snow;
      case 73:
        return snow;
      case 75:
        return snow;
      case 77:
        return snow;
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
                <button className={"text-neutral-0 text-preset-7 flex h-[39px] w-full items-center px-2 py-2 hover:rounded-md hover:bg-gray-700"} onClick={() => setTempUnit("Celsius")}>
                  <span>Celsius (°C)</span>
                  {tempUnit === "Celsius" ? <img alt={"Checkmark Icon"} className={"ml-auto size-4"} src={checkmark} /> : null}
                </button>
              </MenuItem>
              <MenuItem>
                <button className={"text-neutral-0 text-preset-7 flex h-[39px] w-full items-center px-2 py-2 hover:rounded-md hover:bg-gray-700"} onClick={() => setTempUnit("Fahrenheit")}>
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
                <button className={"text-neutral-0 text-preset-7 flex h-[39px] w-full items-center px-2 py-2 hover:rounded-md hover:bg-gray-700"} onClick={() => setPrecipUnit("mm")}>
                  <span>Millimeters (mm)</span>
                  {precipUnit === "mm" ? <img alt={"Checkmark Icon"} className={"ml-auto size-4"} src={checkmark} /> : null}
                </button>
              </MenuItem>
              <MenuItem>
                <button className={"text-neutral-0 text-preset-7 flex h-[39px] w-full items-center px-2 py-2 hover:rounded-md hover:bg-gray-700"} onClick={() => setPrecipUnit("inches")}>
                  <span>Inches (in)</span>
                  {precipUnit === "inches" ? <img alt={"Checkmark Icon"} className={"ml-auto size-4"} src={checkmark} /> : null}
                </button>
              </MenuItem>
            </MenuItems>
          </Menu>
        </div>
      </header>
      <main className={""}>
        <div className={"grid place-items-center"}>
          <h1 className={"text-preset-2 mt-16 text-white"}>How's the sky looking today?</h1>
          <div className={"mx-auto mt-16 flex h-14 w-full justify-center gap-x-4"}>
            <div className={"flex items-center gap-3 rounded-xl bg-[#262540] px-4 lg:w-[526px]"}>
              <img alt={"Search Icon"} className={"size-5"} src={search} />
              <Input className={"text-preset-5 placeholder:text-preset-5 h-6 text-neutral-200 placeholder-neutral-200 outline-none"} name={"Search"} placeholder={"Search for a place..."} type={"text"} />
            </div>
            <Button className={"text-preset-5 rounded-xl bg-[#4658D9] px-4 text-neutral-200"}>Search</Button>
          </div>
        </div>

        <div className={"flex gap-x-8 pt-12"}>
          <section>
            <div>
              <div className={"relative"}>
                <img alt={"Background Today"} className={"min-w-full"} src={"/bg-today-large.svg"} />
                <div className={"absolute top-1/3 ml-6 flex w-full items-center"}>
                  <div className={""}>
                    <p className={"text-preset-4 text-white"}>Berlin, Germany</p>
                    <p className={"text-preset-6 pt-3 text-white opacity-80"}>Tuesday, Aug 5, 2025</p>
                  </div>
                  <div className={"mr-16 ml-auto flex items-center"}>
                    <img alt={"Sunny Icon"} className={"size-[120px]"} src={sunny} />
                    <span className={"text-preset-1 text-white"}>{data.current.temperature_2m}°</span>
                  </div>
                </div>
              </div>
              <div></div>
              <div className={"mt-8 flex w-full gap-x-6"}>
                <div className={"w-full space-y-6 rounded-xl bg-[#262540] p-5"}>
                  <h3 className={"text-preset-6 text-neutral-200"}>Feels Like</h3>
                  <span className={"text-preset-3 text-neutral-200"}>{data.current.temperature_2m}°</span>
                </div>
                <div className={"w-full space-y-6 rounded-xl bg-[#262540] p-5"}>
                  <h3 className={"text-preset-6 text-neutral-200"}>Humidity</h3>
                  <span className={"text-preset-3 text-neutral-200"}>{data.current.relative_humidity_2m}%</span>
                </div>
                <div className={"w-full space-y-6 rounded-xl bg-[#262540] p-5"}>
                  <h3 className={"text-preset-6 text-neutral-200"}>Wind</h3>
                  <span className={"text-preset-3 text-neutral-200"}>{data.current.wind_speed_10m} km/h</span>
                </div>
                <div className={"w-full space-y-6 rounded-xl bg-[#262540] p-5"}>
                  <h3 className={"text-preset-6 text-neutral-200"}>Precipitation</h3>
                  <span className={"text-preset-3 text-neutral-200"}>{data.current.precipitation} mm</span>
                </div>
              </div>
            </div>

            <h2 className={"text-preset-4 pt-12 text-neutral-200"}>Daily Forecast</h2>

            <div className={"flex gap-x-4 pt-5"}>
              {data.daily.time.map((time, index) => (
                <div className={"w-full space-y-4 rounded-xl bg-[#262540] py-4"} key={time}>
                  <h3 className={"text-preset-6 text-center text-neutral-200"}>{new Date(time).toLocaleDateString("en-US", { weekday: "short" })}</h3>
                  <img alt={"Weather Icon"} className={"mx-auto size-[60px]"} src={getWeatherIcon(data.daily.weather_code[index])} />
                  <div className={"text-preset-7 flex justify-between px-2.5 text-neutral-200"}>
                    <p>{isImperial ? Math.round(((data.daily.temperature_2m_max[index] - 32) * 5) / 9).toPrecision(2) : data.daily.temperature_2m_max[index].toPrecision(2)}°</p>
                    <p>{isImperial ? Math.round(((data.daily.temperature_2m_min[index] - 32) * 5) / 9).toPrecision(2) : data.daily.temperature_2m_min[index].toPrecision(2)}°</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={"z-0 min-w-[384px] rounded-xl bg-[#262540] px-6"}>
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
                    {data.daily.time.map((time, index) => (
                      <ListboxOption className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-white/10" key={time} value={time}>
                        <div className="text-sm/6 text-white">{new Date(time).toLocaleDateString("en-US", { weekday: "long" })}</div>
                      </ListboxOption>
                    ))}
                  </ListboxOptions>
                </Listbox>
              </div>
            </div>
            <section className={"space-y-4 pt-4"}>
              {data.hourly.time.map((time, index) => {
                const day = new Date(time).toLocaleDateString("en-US", { weekday: "long" });
                if (day === selectedDay) {
                  const currentHour = new Date().getHours();
                  const timeHour = new Date(time).getHours();
                  if (timeHour >= currentHour && timeHour < currentHour + 8) {
                    return (
                      <div className={"flex h-[60px] items-center rounded-lg bg-[#3C3B5E] pr-4 pl-3"} key={time}>
                        <img alt={"Weather Icon"} className={"size-10"} src={getWeatherIcon(data.hourly.weather_code[index])} />
                        <p className={"text-preset-5 text-neutral-0 pl-2"}>{new Date(time).toLocaleTimeString("en-US", { hour: "numeric", hour12: true })}</p>
                        <p className={"text-preset-7 text-neutral-0 ml-auto"}>{isImperial ? Math.round(((data.hourly.temperature_2m[index] - 32) * 5) / 9).toPrecision(2) : data.hourly.temperature_2m[index].toPrecision(2)}°</p>
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
