import { getDefaultTourOptions } from "./packages/tour/option";
import { getDefaultHintOptions } from "./packages/hint/option";
import {
  Translator,
  Language,
  LanguageCode,
  getLanguageByCode,
} from "./i18n/language";

function applyLanguageDefaults<T extends { translator?: Translator }>(
  options: T,
  language: Language | LanguageCode
): T {
  const translator = options.translator!;
  const languageObj =
    typeof language === "string" ? getLanguageByCode(language) : language;

  translator.setLanguage(languageObj);

  const optionsObj = options as any;

  if (
    optionsObj.hintButtonLabel !== undefined ||
    optionsObj.hints !== undefined
  ) {
    const defaults = getDefaultHintOptions(translator, languageObj);
    return { ...options, ...defaults, language: languageObj, translator } as T;
  }

  const defaults = getDefaultTourOptions(translator, languageObj);
  return { ...options, ...defaults, language: languageObj, translator } as T;
}

export function setOption<
  T extends { translator?: Translator },
  K extends keyof T
>(options: T, key: K, value: T[K]): T {
  if (key === "language") {
    return applyLanguageDefaults(options, value as Language | LanguageCode);
  }

  const result = { ...options };
  result[key] = value;
  return result;
}

export function setOptions<T extends { translator?: Translator }>(
  options: T,
  partialOptions: Partial<T>
): T {
  for (const [key, value] of Object.entries(partialOptions)) {
    options = setOption(options, key as keyof T, value as T[keyof T]);
  }
  return options;
}
