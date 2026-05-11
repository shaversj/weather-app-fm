import { Button, Input } from "@headlessui/react";
import { useCallback, useState } from "react";

import type { Location } from "../hooks/useCitySearch";

import { DEBOUNCE_DELAY_MS } from "../constants/weather";
import { useDebounce } from "../hooks/useDebounce";

import searchIcon from "/icon-search.svg";

interface SearchSectionProps {
  cityResults: Location[] | undefined;
  isLoadingWeather: boolean;
  onSearchInputChange: (input: string) => void;
  onSelectLocation: (location: Location) => void;
  searchError: Error | null;
  selectedLocation: Location | null;
}

export function SearchSection({ cityResults, isLoadingWeather, onSearchInputChange, onSelectLocation, searchError, selectedLocation }: SearchSectionProps) {
  const [searchInput, setSearchInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const debouncedSearchInput = useDebounce(searchInput, DEBOUNCE_DELAY_MS);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchInput(value);
      setShowDropdown(true);
      onSearchInputChange(value);
    },
    [onSearchInputChange],
  );

  const handleSelectCity = useCallback(
    (city: Location) => {
      setSearchInput(city.name);
      setShowDropdown(false);
      onSelectLocation(city);
    },
    [onSelectLocation],
  );

  return (
    <div className="relative mx-auto mt-16 lg:w-[625px]">
      <div className="flex w-full items-center gap-4">
        <div className="flex h-14 w-full items-center gap-4 rounded-xl bg-neutral-800 px-4">
          <img alt="Search Icon" className="size-5" src={searchIcon} />
          <Input className="text-preset-5 placeholder:text-preset-5 h-6 w-full text-neutral-200 placeholder-neutral-200 outline-none" name="Search" onChange={handleInputChange} placeholder="Search for a place..." type="text" value={searchInput} />
        </div>
        <Button className="text-preset-5 flex h-14 shrink-0 items-center rounded-xl bg-blue-500 px-4 text-neutral-200" disabled={!selectedLocation || isLoadingWeather}>
          {isLoadingWeather ? "Loading..." : "Search"}
        </Button>
      </div>
      {searchError && <p className="text-preset-7 mt-2 text-red-400">Couldn&apos;t find cities. Try a different name.</p>}
      {showDropdown && debouncedSearchInput.length >= 2 && cityResults && cityResults.length > 0 && (
        <div className="absolute right-0 left-0 mt-1 rounded-xl bg-neutral-800">
          {cityResults.map((city) => (
            <button className="flex w-full items-center px-4 py-2 text-left hover:bg-neutral-700" key={city.id} onClick={() => handleSelectCity(city)}>
              <span className="text-preset-5 text-neutral-200">{city.name}</span>
              <span className="text-preset-7 ml-2 text-neutral-400">
                {city.admin1}, {city.country}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
