import { getDefaultTourOptions, TourOptions } from "./packages/tour/option";
import { getDefaultHintOptions, HintOptions } from "./packages/hint/option";

function applyLanguageDefaults<T>(options: T, language: any): T {
  const optionsObj = options as any;
  
  if (optionsObj.hintButtonLabel !== undefined || optionsObj.hints !== undefined) {
    const defaults = getDefaultHintOptions(language);
    return { ...options, ...defaults, language } as T;
  }
  
  const defaults = getDefaultTourOptions(language);
  return { ...options, ...defaults, language } as T;
}

export function setOption<T, K extends keyof T>(
  options: T,
  key: K,
  value: T[K]
): T {
  if (key === 'language') {
    return applyLanguageDefaults(options, value);
  }
  
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

export function setOptions<T>(options: T, partialOptions: Partial<T>): T;

export function setOptions<T>(options: T, partialOptions: Partial<T>): T {
  const partial = partialOptions as any;
  
  if (partial.language) {
    options = applyLanguageDefaults(options, partial.language);
    
    for (const [key, value] of Object.entries(partialOptions)) {
      if (key !== 'language') {
        const result = { ...options };
        result[key as keyof T] = value as T[keyof T];
        options = result;
      }
    }
    
    return options;
  }
  
  for (const [key, value] of Object.entries(partialOptions)) {
    options = setOption(options, key as keyof T, value as T[keyof T]);
  }
  
  return options;
}
