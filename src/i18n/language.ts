import enUS from "./en_US";
import faIR from "./fa_IR";
import deDE from "./de_DE";
import esES from "./es_ES";
import frFR from "./fr_FR";

type MessageFormat = (...args: any[]) => string;

const languages = {
  en_US: enUS,
  fa_IR: faIR,
  de_DE: deDE,
  es_ES: esES,
  fr_FR: frFR,
} as const;

export type LanguageCode = keyof typeof languages;

/**
 * Get all available language codes
 */
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
        "en-US"
      ).replace("-", "_");

      const normalizedLang = (Object.keys(languages) as LanguageCode[]).find(
        (key) => key.toLowerCase() === rawLang.toLowerCase()
      );

      this._languageCode = normalizedLang ?? "en_US";
    }
  }

  setLanguage(code: LanguageCode) {
    if (languages[code]) {
      this._languageCode = code;
    }
  }

  getLanguage(): LanguageCode {
    return this._languageCode;
  }

  private get messages() {
    return languages[this._languageCode];
  }

  private getString(
    message: string,
    langObj: any = this.messages
  ): MessageFormat | null {
    if (!langObj || !message) return null;

    const splitted = message.split(".");
    const key = splitted[0];

    if (langObj[key]) {
      const val = langObj[key];
      if (typeof val === "string") {
        return (): string => val;
      } else if (typeof val === "function") {
        return val;
      } else {
        return this.getString(splitted.slice(1).join("."), val);
      }
    }

    return null;
  }

  translate(message: string, ...args: any[]): string {
    const translated = this.getString(message);
    return translated ? translated(...args) : message;
  }
}
