import { Button, Input, Listbox, ListboxButton, ListboxOption, ListboxOptions, Menu, MenuButton } from "@headlessui/react";
import { createFileRoute } from "@tanstack/react-router";

import drizzle from "/icon-drizzle.webp";
import dropdown from "/icon-dropdown.svg";
import search from "/icon-search.svg";
import units from "/icon-units.svg";
import logo from "/logo.svg";
import sunny from "/icon-sunny.webp";
import { useState } from "react";
import clsx from "clsx";

export const Route = createFileRoute("/")({
  component: App,
});

const days = [
  { id: 1, name: "Monday" },
  { id: 2, name: "Tuesday" },
  { id: 3, name: "Wednesday" },
  { id: 4, name: "Thursday" },
  { id: 5, name: "Friday" },
  { id: 6, name: "Saturday" },
  { id: 7, name: "Sunday" },
];

function App() {
  const [selectedDay, setselectedDay] = useState(days[0]);

  return (
    // <!-- replaces: px-4 pt-4 md:px-6 md:pt-6 lg:px-28 lg:pt-12 -->
    <div className="min-h-screen bg-neutral-900 px-[clamp(1rem,2vw+0.5rem,7rem)] pt-[clamp(1rem,1.5vw+0.5rem,3rem)] antialiased lg:pb-20">
      <header className={"flex justify-between"}>
        <img alt="Logo" src={logo} />
        <Menu>
          <MenuButton className="inline-flex items-center gap-2 rounded-md bg-neutral-800 px-3 py-1.5 text-sm/6 font-semibold text-white focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-700 data-open:bg-gray-700">
            <img alt={"Units Icon"} src={units} />
            Units
            <img alt={"Dropdown Icon"} src={dropdown} />
          </MenuButton>
        </Menu>
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
            <div className={""}>
              <img alt={"Background Today"} src={"/bg-today-large.svg"} />
              <div className={"mt-8 flex w-full gap-x-6"}>
                <div className={"w-full space-y-6 rounded-xl bg-[#262540] p-5"}>
                  <h3 className={"text-preset-6 text-neutral-200"}>Feels Like</h3>
                  <span className={"text-preset-3 text-neutral-200"}>18°</span>
                </div>
                <div className={"w-full space-y-6 rounded-xl bg-[#262540] p-5"}>
                  <h3 className={"text-preset-6 text-neutral-200"}>Feels Like</h3>
                  <span className={"text-preset-3 text-neutral-200"}>18°</span>
                </div>
                <div className={"w-full space-y-6 rounded-xl bg-[#262540] p-5"}>
                  <h3 className={"text-preset-6 text-neutral-200"}>Feels Like</h3>
                  <span className={"text-preset-3 text-neutral-200"}>18°</span>
                </div>
                <div className={"w-full space-y-6 rounded-xl bg-[#262540] p-5"}>
                  <h3 className={"text-preset-6 text-neutral-200"}>Feels Like</h3>
                  <span className={"text-preset-3 text-neutral-200"}>18°</span>
                </div>
              </div>
            </div>

            <h2 className={"text-preset-4 pt-12 text-neutral-200"}>Daily Forecast</h2>

            <div className={"flex gap-x-4 pt-5"}>
              <div className={"w-full space-y-4 rounded-xl bg-[#262540] py-4"}>
                <h3 className={"text-preset-6 text-center text-neutral-200"}>Tue</h3>
                <img alt={"Drizzle Icon"} className={"mx-auto size-[60px]"} src={drizzle} />
                <div className={"text-preset-7 flex justify-between px-2.5 text-neutral-200"}>
                  <p>20°</p>
                  <p>14°</p>
                </div>
              </div>
              <div className={"w-full space-y-4 rounded-xl bg-[#262540] py-4"}>
                <h3 className={"text-preset-6 text-center text-neutral-200"}>Tue</h3>
                <img alt={"Drizzle Icon"} className={"mx-auto size-[60px]"} src={drizzle} />
                <div className={"text-preset-7 flex justify-between px-2.5 text-neutral-200"}>
                  <p>20°</p>
                  <p>14°</p>
                </div>
              </div>
              <div className={"w-full space-y-4 rounded-xl bg-[#262540] py-4"}>
                <h3 className={"text-preset-6 text-center text-neutral-200"}>Tue</h3>
                <img alt={"Drizzle Icon"} className={"mx-auto size-[60px]"} src={drizzle} />
                <div className={"text-preset-7 flex justify-between px-2.5 text-neutral-200"}>
                  <p>20°</p>
                  <p>14°</p>
                </div>
              </div>
              <div className={"w-full space-y-4 rounded-xl bg-[#262540] py-4"}>
                <h3 className={"text-preset-6 text-center text-neutral-200"}>Tue</h3>
                <img alt={"Drizzle Icon"} className={"mx-auto size-[60px]"} src={drizzle} />
                <div className={"text-preset-7 flex justify-between px-2.5 text-neutral-200"}>
                  <p>20°</p>
                  <p>14°</p>
                </div>
              </div>
              <div className={"w-full space-y-4 rounded-xl bg-[#262540] py-4"}>
                <h3 className={"text-preset-6 text-center text-neutral-200"}>Tue</h3>
                <img alt={"Drizzle Icon"} className={"mx-auto size-[60px]"} src={drizzle} />
                <div className={"text-preset-7 flex justify-between px-2.5 text-neutral-200"}>
                  <p>20°</p>
                  <p>14°</p>
                </div>
              </div>
              <div className={"w-full space-y-4 rounded-xl bg-[#262540] py-4"}>
                <h3 className={"text-preset-6 text-center text-neutral-200"}>Tue</h3>
                <img alt={"Drizzle Icon"} className={"mx-auto size-[60px]"} src={drizzle} />
                <div className={"text-preset-7 flex justify-between px-2.5 text-neutral-200"}>
                  <p>20°</p>
                  <p>14°</p>
                </div>
              </div>
              <div className={"w-full space-y-4 rounded-xl bg-[#262540] py-4"}>
                <h3 className={"text-preset-6 text-center text-neutral-200"}>Tue</h3>
                <img alt={"Drizzle Icon"} className={"mx-auto size-[60px]"} src={drizzle} />
                <div className={"text-preset-7 flex justify-between px-2.5 text-neutral-200"}>
                  <p>20°</p>
                  <p>14°</p>
                </div>
              </div>
            </div>
          </section>

          <section className={"z-0 min-w-[384px] rounded-xl bg-[#262540] px-6"}>
            <div className={"flex items-center justify-between pt-6"}>
              <h2 className={"text-preset-5 text-neutral-200"}>Hourly Forecast</h2>

              <div className="z-10 w-40">
                <Listbox value={selectedDay} onChange={setselectedDay}>
                  <ListboxButton
                    className={clsx("relative block w-full rounded-lg bg-white/5 py-1.5 pr-8 pl-3 text-left text-sm/6 text-white", "focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25")}
                  >
                    {selectedDay.name}
                  </ListboxButton>
                  <ListboxOptions
                    anchor="bottom"
                    transition
                    className={clsx("w-(--button-width) rounded-xl border border-white/5 bg-white/5 p-1 [--anchor-gap:--spacing(1)] focus:outline-none", "transition duration-100 ease-in data-leave:data-closed:opacity-0")}
                  >
                    {days.map((day) => (
                      <ListboxOption key={day.id} value={day} className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-white/10">
                        <div className="text-sm/6 text-white">{day.name}</div>
                      </ListboxOption>
                    ))}
                  </ListboxOptions>
                </Listbox>
              </div>
            </div>
            <section className={"space-y-4 pt-4"}>
              <div className={"flex h-[60px] items-center rounded-lg bg-[#3C3B5E] pr-4 pl-3"}>
                <img src={sunny} alt={"Sunny Icon"} className={"size-10"} />
                <p className={"text-preset-5 text-neutral-0"}>3 PM</p>
                <p className={"text-preset-7 text-neutral-0 ml-auto"}>20°</p>
              </div>
              <div className={"flex h-[60px] items-center rounded-lg bg-[#3C3B5E] pr-4 pl-3"}>
                <img src={sunny} alt={"Sunny Icon"} className={"size-10"} />
                <p className={"text-preset-5 text-neutral-0 py-2.5"}>3 PM</p>
                <p className={"text-preset-7 text-neutral-0 ml-auto"}>20°</p>
              </div>
              <div className={"flex h-[60px] items-center rounded-lg bg-[#3C3B5E] pr-4 pl-3"}>
                <img src={sunny} alt={"Sunny Icon"} className={"size-10"} />
                <p className={"text-preset-5 text-neutral-0 py-2.5"}>3 PM</p>
                <p className={"text-preset-7 text-neutral-0 ml-auto"}>20°</p>
              </div>
              <div className={"flex h-[60px] items-center rounded-lg bg-[#3C3B5E] pr-4 pl-3"}>
                <img src={sunny} alt={"Sunny Icon"} className={"size-10"} />
                <p className={"text-preset-5 text-neutral-0 py-2.5"}>3 PM</p>
                <p className={"text-preset-7 text-neutral-0 ml-auto"}>20°</p>
              </div>
              <div className={"flex h-[60px] items-center rounded-lg bg-[#3C3B5E] pr-4 pl-3"}>
                <img src={sunny} alt={"Sunny Icon"} className={"size-10"} />
                <p className={"text-preset-5 text-neutral-0 py-2.5"}>3 PM</p>
                <p className={"text-preset-7 text-neutral-0 ml-auto"}>20°</p>
              </div>
              <div className={"flex h-[60px] items-center rounded-lg bg-[#3C3B5E] pr-4 pl-3"}>
                <img src={sunny} alt={"Sunny Icon"} className={"size-10"} />
                <p className={"text-preset-5 text-neutral-0 py-2.5"}>3 PM</p>
                <p className={"text-preset-7 text-neutral-0 ml-auto"}>20°</p>
              </div>
              <div className={"flex h-[60px] items-center rounded-lg bg-[#3C3B5E] pr-4 pl-3"}>
                <img src={sunny} alt={"Sunny Icon"} className={"size-10"} />
                <p className={"text-preset-5 text-neutral-0 py-2.5"}>3 PM</p>
                <p className={"text-preset-7 text-neutral-0 ml-auto"}>20°</p>
              </div>
              <div className={"flex h-[60px] items-center rounded-lg bg-[#3C3B5E] pr-4 pl-3"}>
                <img src={sunny} alt={"Sunny Icon"} className={"size-10"} />
                <p className={"text-preset-5 text-neutral-0 py-2.5"}>3 PM</p>
                <p className={"text-preset-7 text-neutral-0 ml-auto"}>20°</p>
              </div>
            </section>
          </section>
        </div>
      </main>
    </div>
  );
}
