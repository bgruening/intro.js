import { getDefaultTourOptions, TourOptions } from "./packages/tour/option";
import { getDefaultHintOptions, HintOptions } from "./packages/hint/option";
import { Translator } from "./i18n/language";

function isHintOptions(options: any): options is HintOptions {
  return "hints" in options;
}

/**
 * Ensures a valid Translator instance exists for a tour or hint.
 * Translator is **not** part of the public options.
 */
function ensureTranslator(options: Partial<TourOptions | HintOptions>) {
  const language = options.language ?? "en_US";

  const translator = new Translator();
  translator.setLanguage(language);
  return translator;
}

export function applyLanguageDefaults<T extends TourOptions | HintOptions>(
  options: T
): T {
  const translator = ensureTranslator(options);

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
    language: translator.getLanguage(),
  } as T;
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
