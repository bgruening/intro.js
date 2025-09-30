import { getDefaultTourOptions } from "./packages/tour/option";
import { getDefaultHintOptions } from "./packages/hint/option";

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

export function setOptions<T>(options: T, partialOptions: Partial<T>): T {  
  for (const [key, value] of Object.entries(partialOptions)) {
    options = setOption(options, key as keyof T, value as T[keyof T]);
  }
  
  return options;
}
