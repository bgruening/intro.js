import { getDefaultTourOptions, TourOptions } from "./packages/tour/option";
import { getDefaultHintOptions, HintOptions } from "./packages/hint/option";

/**
 * @param options The options object to modify
 * @param key The key to set
 * @param value The value to set
 * @returns The modified options object
 */
export function setOption<T, K extends keyof T>(
  options: T,
  key: K,
  value: T[K]
): T {
  const result = { ...options };
  result[key] = value;
  return result;
}

export function setOptions(
  options: TourOptions,
  partialOptions: Partial<TourOptions>
): TourOptions;

export function setOptions(
  options: HintOptions,
  partialOptions: Partial<HintOptions>
): HintOptions;

/**
 * @param options The current options object
 * @param partialOptions The partial options to merge
 * @returns A new options object with merged values
 */
export function setOptions<T>(options: T, partialOptions: Partial<T>): T {
  if (!options || !partialOptions) {
    return options;
  }

  const partial = partialOptions as any;
  if (!partial.language) {
    return { ...options, ...partialOptions };
  }

  const tourDefaults = getDefaultTourOptions(partial.language);
  if (tourDefaults) {
    return {
      ...options,
      ...tourDefaults,
      ...partialOptions,
    } as T;
  }

  const hintDefaults = getDefaultHintOptions(partial.language);
  return {
    ...options,
    ...hintDefaults,
    ...partialOptions,
  } as T;
}
