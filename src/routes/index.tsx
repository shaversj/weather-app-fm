import { createFileRoute } from "@tanstack/react-router";
import logo from "/logo.svg";
import units from "/icon-units.svg";
import dropdown from "/icon-dropdown.svg";
import search from "/icon-search.svg";
import drizzle from "/icon-drizzle.webp";

import { MenuButton, Menu, Input, Button } from "@headlessui/react";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    // <!-- replaces: px-4 pt-4 md:px-6 md:pt-6 lg:px-28 lg:pt-12 -->
    <div className="min-h-screen bg-neutral-900 px-[clamp(1rem,2vw+0.5rem,7rem)] pt-[clamp(1rem,1.5vw+0.5rem,3rem)] antialiased lg:pb-20">
      <header className={"flex justify-between"}>
        <img src={logo} alt="Logo" />
        <Menu>
          <MenuButton className="inline-flex items-center gap-2 rounded-md bg-neutral-800 px-3 py-1.5 text-sm/6 font-semibold text-white focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-700 data-open:bg-gray-700">
            <img src={units} alt={"Units Icon"} />
            Units
            <img src={dropdown} alt={"Dropdown Icon"} />
          </MenuButton>
        </Menu>
      </header>
      <main className={""}>
        <div className={"grid place-items-center"}>
          <h1 className={"text-preset-2 mt-16 text-white"}>How's the sky looking today?</h1>
          <div className={"mx-auto mt-16 flex h-14 w-full justify-center gap-x-4"}>
            <div className={"flex items-center gap-3 rounded-xl bg-[#262540] px-4 lg:w-[526px]"}>
              <img src={search} alt={"Search Icon"} className={"size-5"} />
              <Input className={"text-preset-5 placeholder:text-preset-5 h-6 text-neutral-200 placeholder-neutral-200 outline-none"} placeholder={"Search for a place..."} name={"Search"} type={"text"} />
            </div>
            <Button className={"text-preset-5 rounded-xl bg-[#4658D9] px-4 text-neutral-200"}>Search</Button>
          </div>
        </div>

        <div className={"flex gap-x-8 pt-12"}>
          <section>
            <div className={""}>
              <img src={"/bg-today-large.svg"} alt={"Background Today"} />
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
                <img src={drizzle} alt={"Drizzle Icon"} className={"mx-auto size-[60px]"} />
                <div className={"text-preset-7 flex justify-between px-2.5 text-neutral-200"}>
                  <p>20°</p>
                  <p>14°</p>
                </div>
              </div>
              <div className={"w-full space-y-4 rounded-xl bg-[#262540] py-4"}>
                <h3 className={"text-preset-6 text-center text-neutral-200"}>Tue</h3>
                <img src={drizzle} alt={"Drizzle Icon"} className={"mx-auto size-[60px]"} />
                <div className={"text-preset-7 flex justify-between px-2.5 text-neutral-200"}>
                  <p>20°</p>
                  <p>14°</p>
                </div>
              </div>
              <div className={"w-full space-y-4 rounded-xl bg-[#262540] py-4"}>
                <h3 className={"text-preset-6 text-center text-neutral-200"}>Tue</h3>
                <img src={drizzle} alt={"Drizzle Icon"} className={"mx-auto size-[60px]"} />
                <div className={"text-preset-7 flex justify-between px-2.5 text-neutral-200"}>
                  <p>20°</p>
                  <p>14°</p>
                </div>
              </div>
              <div className={"w-full space-y-4 rounded-xl bg-[#262540] py-4"}>
                <h3 className={"text-preset-6 text-center text-neutral-200"}>Tue</h3>
                <img src={drizzle} alt={"Drizzle Icon"} className={"mx-auto size-[60px]"} />
                <div className={"text-preset-7 flex justify-between px-2.5 text-neutral-200"}>
                  <p>20°</p>
                  <p>14°</p>
                </div>
              </div>
              <div className={"w-full space-y-4 rounded-xl bg-[#262540] py-4"}>
                <h3 className={"text-preset-6 text-center text-neutral-200"}>Tue</h3>
                <img src={drizzle} alt={"Drizzle Icon"} className={"mx-auto size-[60px]"} />
                <div className={"text-preset-7 flex justify-between px-2.5 text-neutral-200"}>
                  <p>20°</p>
                  <p>14°</p>
                </div>
              </div>
              <div className={"w-full space-y-4 rounded-xl bg-[#262540] py-4"}>
                <h3 className={"text-preset-6 text-center text-neutral-200"}>Tue</h3>
                <img src={drizzle} alt={"Drizzle Icon"} className={"mx-auto size-[60px]"} />
                <div className={"text-preset-7 flex justify-between px-2.5 text-neutral-200"}>
                  <p>20°</p>
                  <p>14°</p>
                </div>
              </div>
              <div className={"w-full space-y-4 rounded-xl bg-[#262540] py-4"}>
                <h3 className={"text-preset-6 text-center text-neutral-200"}>Tue</h3>
                <img src={drizzle} alt={"Drizzle Icon"} className={"mx-auto size-[60px]"} />
                <div className={"text-preset-7 flex justify-between px-2.5 text-neutral-200"}>
                  <p>20°</p>
                  <p>14°</p>
                </div>
              </div>
            </div>
          </section>

          <section className={"min-w-[384px] rounded-xl bg-[#262540]"}></section>
        </div>
      </main>
    </div>
  );
}
