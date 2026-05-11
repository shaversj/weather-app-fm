import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

import checkmark from "/icon-checkmark.svg";
import dropdown from "/icon-dropdown.svg";
import units from "/icon-units.svg";

interface UnitsMenuProps {
  isImperial: boolean;
  onSetPrecipitation: () => void;
  onSetTemperature: (unit: "celsius" | "fahrenheit") => void;
  onSetWindSpeed: (unit: "km/h" | "mph") => void;
  onToggleUnits: () => void;
  precipUnit: string;
  tempUnit: string;
  windUnit: string;
}

export function UnitsMenu({ isImperial, onSetPrecipitation, onSetTemperature, onSetWindSpeed, onToggleUnits, precipUnit, tempUnit, windUnit }: UnitsMenuProps) {
  return (
    <div className="flex items-center rounded-md bg-neutral-800">
      <Menu>
        <MenuButton className="text-preset-7 text-neutral-0 inline-flex items-center gap-2 bg-neutral-800 px-3 py-1.5 font-semibold focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white">
          <img alt="Units Icon" src={units} />
          Units
          <img alt="Dropdown Icon" src={dropdown} />
        </MenuButton>

        <MenuItems anchor="bottom end" className="mt-2.5 w-[214px] rounded-xl bg-neutral-800 px-2 outline-none" transition>
          <button className="mt-1.5 h-[39px] w-full px-2 text-left hover:rounded-md hover:bg-gray-700" onClick={onToggleUnits}>
            <span className="text-preset-7 text-neutral-0">{isImperial ? "Switch to Metric" : "Switch to Imperial"}</span>
          </button>

          <p className="text-preset-8 my-2 px-2 text-neutral-300">Temperature</p>
          <MenuItem>
            <button className="text-neutral-0 text-preset-7 flex h-[39px] w-full items-center px-2 py-2 hover:rounded-md hover:bg-gray-700" onClick={() => onSetTemperature("celsius")}>
              <span>Celsius (°C)</span>
              {tempUnit === "Celsius" ? <img alt="Checkmark Icon" className="ml-auto size-4" src={checkmark} /> : null}
            </button>
          </MenuItem>
          <MenuItem>
            <button className="text-neutral-0 text-preset-7 flex h-[39px] w-full items-center px-2 py-2 hover:rounded-md hover:bg-gray-700" onClick={() => onSetTemperature("fahrenheit")}>
              <span>Fahrenheit (°F)</span>
              {tempUnit === "Fahrenheit" ? <img alt="Checkmark Icon" className="ml-auto size-4" src={checkmark} /> : null}
            </button>
          </MenuItem>

          <hr className="mx-2 my-1 h-px border-neutral-600" />
          <p className="text-preset-8 my-2 px-2 text-neutral-300">Wind Speed</p>
          <MenuItem>
            <button className="text-neutral-0 text-preset-7 flex h-[39px] w-full items-center px-2 py-2 hover:rounded-md hover:bg-gray-700" onClick={() => onSetWindSpeed("km/h")}>
              <span>km/h</span>
              {windUnit === "km/h" ? <img alt="Checkmark Icon" className="ml-auto size-4" src={checkmark} /> : null}
            </button>
          </MenuItem>
          <MenuItem>
            <button className="text-neutral-0 text-preset-7 flex h-[39px] w-full items-center px-2 py-2 hover:rounded-md hover:bg-gray-700" onClick={() => onSetWindSpeed("mph")}>
              <span>mph</span>
              {windUnit === "mph" ? <img alt="Checkmark Icon" className="ml-auto size-4" src={checkmark} /> : null}
            </button>
          </MenuItem>
          <hr className="mx-2 my-1 h-px border-neutral-600" />
          <p className="text-preset-8 my-2 px-2 text-neutral-300">Precipitation</p>
          <MenuItem>
            <button className="text-neutral-0 text-preset-7 flex h-[39px] w-full items-center px-2 py-2 hover:rounded-md hover:bg-gray-700" onClick={onSetPrecipitation}>
              <span>Millimeters (mm)</span>
              {precipUnit === "mm" ? <img alt="Checkmark Icon" className="ml-auto size-4" src={checkmark} /> : null}
            </button>
          </MenuItem>
          <MenuItem>
            <button className="text-neutral-0 text-preset-7 flex h-[39px] w-full items-center px-2 py-2 hover:rounded-md hover:bg-gray-700" onClick={onSetPrecipitation}>
              <span>Inches (in)</span>
              {precipUnit === "inches" ? <img alt="Checkmark Icon" className="ml-auto size-4" src={checkmark} /> : null}
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>
    </div>
  );
}
