import { createFileRoute } from "@tanstack/react-router";
import logo from "/logo.svg";
import units from "/icon-units.svg";
import dropdown from "/icon-dropdown.svg";
import { MenuButton, Menu } from "@headlessui/react";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    // <!-- replaces: px-4 pt-4 md:px-6 md:pt-6 lg:px-28 lg:pt-12 -->
    <div className="min-h-screen bg-neutral-900 px-[clamp(1rem,2vw+0.5rem,7rem)] pt-[clamp(1rem,1.5vw+0.5rem,3rem)]">
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
    </div>
  );
}
