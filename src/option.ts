import { getDefaultTourOptions, TourOptions } from "./packages/tour/option";
import { getDefaultHintOptions, HintOptions } from "./packages/hint/option";
import {
  Translator,
  Language,
  LanguageCode,
  getLanguageByCode,
} from "./i18n/language";
import en_US from "./i18n/en_US";

function isHintOptions(options: any): options is HintOptions {
  return "hints" in options;
}

/**
 * Apply language defaults to tour or hint options.
 * Translates all labels according to the selected language.
 */
export function applyLanguageDefaults<T extends TourOptions | HintOptions>(
  options: T
): T {
  const languageObj: Language =
    typeof options.language === "string"
      ? getLanguageByCode(options.language as LanguageCode)
      : options.language ?? en_US;

  const translator = new Translator();
  translator.setLanguage(languageObj);

  const defaults = isHintOptions(options)
    ? getDefaultHintOptions(translator)
    : getDefaultTourOptions(translator);

  const {
    nextLabel,
    prevLabel,
    skipLabel,
    doneLabel,
    stepNumbersOfLabel,
    dontShowAgainLabel,
    hintButtonLabel,
    language: _,
    ...userOptions
  } = options as any;

  return {
    ...defaults,
    ...userOptions,
    language: languageObj,
  } as T;
}

/**
 * Update a single option.
 * Special handling for language: regenerates defaults in the new language.
 */
export function setOption<T extends TourOptions | HintOptions, K extends keyof T>(
  options: T,
  key: K,
  value: T[K]
): T {
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
