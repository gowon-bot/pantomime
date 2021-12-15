import { LocationOptions } from "../image/inputs";

export function locationAdd(
  location: LocationOptions,
  amount: number | Partial<LocationOptions>
): LocationOptions {
  return {
    ...location,
    top: location.top + (typeof amount === "number" ? amount : amount.top || 0),
    left:
      location.left + (typeof amount === "number" ? amount : amount.left || 0),
  };
}

export function locationSubtract(
  location: LocationOptions,
  amount: number | Partial<LocationOptions>
): LocationOptions {
  return {
    ...location,
    top: location.top - (typeof amount === "number" ? amount : amount.top || 0),
    left:
      location.left - (typeof amount === "number" ? amount : amount.left || 0),
  };
}

export function floorLocation(location: LocationOptions): LocationOptions {
  return {
    ...location,
    top: Math.floor(location.top),
    left: Math.floor(location.left),
  };
}
