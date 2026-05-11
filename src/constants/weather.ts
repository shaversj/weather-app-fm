export const DEBOUNCE_DELAY_MS = 300;
export const MIN_SEARCH_LENGTH = 2;
export const HOURLY_FORECAST_HOURS = 8;

export const WMO_CODES: Record<string, readonly number[]> = {
  drizzle: [51, 53, 55],
  fog: [45, 48],
  overcast: [3],
  partlyCloudy: [2],
  rain: [56, 57, 61, 63, 65, 66, 67, 80, 81, 82],
  snow: [71, 73, 75, 77, 85, 86],
  storm: [95, 96, 99],
  sunny: [0, 1],
};
