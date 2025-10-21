import enUS from "./en_US";
import faIR from "./fa_IR";
import deDE from "./de_DE";
import esES from "./es_ES";
import frFR from "./fr_FR";

const languages = {
  en_US: enUS,
  fa_IR: faIR,
  de_DE: deDE,
  es_ES: esES,
  fr_FR: frFR,
} as const;

export type LanguageCode = keyof typeof languages;
export const DefaultLanguage: LanguageCode = Object.keys(
  languages
)[0] as LanguageCode;

export function getAvailableLanguages(): LanguageCode[] {
  return Object.keys(languages) as LanguageCode[];
}

export class Translator {
  private _languageCode: LanguageCode;

  constructor(languageCode?: LanguageCode) {
    if (languageCode && languages[languageCode]) {
      this._languageCode = languageCode;
    } else {
      const rawLang = (
        navigator.language ||
        (navigator as any).userLanguage ||
        DefaultLanguage
      ).replace("-", "_");

      this._languageCode =
        (Object.keys(languages).find(
          (key) => key.toLowerCase() === rawLang.toLowerCase()
        ) as LanguageCode) ?? DefaultLanguage;
    }
  }

  setLanguage(code: LanguageCode) {
    if (languages[code]) this._languageCode = code;
  }

  getLanguage(): LanguageCode {
    return this._languageCode;
  }

  private get messages() {
    return languages[this._languageCode];
  }

  private getString(key: string, obj = this.messages): string | undefined {
    const parts = key.split(".");
    let current = obj;

    for (const part of parts) {
      if (typeof current === "string") return undefined;
      if (!(part in current)) return undefined;

      current = (current as Record<string, any>)[part];
    }

    return typeof current === "string" ? current : undefined;
  }

  translate(key: string, fallback?: string): string {
    return this.getString(key) ?? fallback ?? key;
  }
}
