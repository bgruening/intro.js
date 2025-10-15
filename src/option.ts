import { getDefaultTourOptions, TourOptions } from "./packages/tour/option";
import { getDefaultHintOptions, HintOptions } from "./packages/hint/option";
import { Translator, DefaultLanguage } from "./i18n/language";

function isHintOptions(options: any): options is HintOptions {
  return "hints" in options;
}

export function applyLanguageDefaults<T extends TourOptions | HintOptions>(
  options: T
): T {
  const language = options.language ?? DefaultLanguage;
  const translator = new Translator();
  translator.setLanguage(language);

  if (isHintOptions(options)) {
    const translatedOptions = getDefaultHintOptions(translator);

    return {
      ...options,
      hintButtonLabel: translatedOptions.hintButtonLabel,
    };
  } else {
    const translatedOptions = getDefaultTourOptions(translator);

    return {
      ...options,
      doneLabel: translatedOptions.doneLabel,
      nextLabel: translatedOptions.nextLabel,
      prevLabel: translatedOptions.prevLabel,
      skipLabel: translatedOptions.skipLabel,
      dontShowAgainLabel: translatedOptions.dontShowAgainLabel,
      stepNumbersOfLabel: translatedOptions.stepNumbersOfLabel,
    };
  }
}

/**
 * Update a single option.
 * Special handling for language: regenerates defaults in the new language.
 */
export function setOption<
  T extends TourOptions | HintOptions,
  K extends keyof T
>(options: T, key: K, value: T[K]): T {
  if (key === "language") {
    return applyLanguageDefaults({ ...options, language: value } as T);
  }

  return { ...options, [key]: value };
}

/**
 * Update multiple options at once.
 */
export function setOptions<T extends TourOptions | HintOptions>(
  options: T,
  partialOptions: Partial<T>
): T {
  let updated = { ...options };
  for (const [key, value] of Object.entries(partialOptions)) {
    updated = setOption(updated, key as keyof T, value as T[keyof T]);
  }
  return updated;
}
