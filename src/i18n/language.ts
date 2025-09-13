import enUS from "./en_US";
import faIR from "./fa_IR";
import de_DE from "./de_DE";
import esES from "./es_ES";
import frFR from "./fr_FR";

type MessageFormat = (...args: any[]) => string;
type Message = string | MessageFormat;
export type Language = { [key: string]: Message | Language };

const languages: Record<string, Language> = {
  en_US: enUS,
  fa_IR: faIR,
  de_DE: de_DE,
  es_ES: esES,
  fr_FR: frFR,
};

export class Translator {
  private _language: Language;

  constructor(language?: Language) {
    if (language) {
      this._language = language;
    } else {
      const rawLang =
        (navigator.language || (navigator as any).userLanguage || "en-US")
          .replace("-", "_");

      const normalizedLang = Object.keys(languages).find(
        key => key.toLowerCase() === rawLang.toLowerCase()
      );

      this._language = normalizedLang ? languages[normalizedLang] : enUS;
    }
  }

  setLanguage(language: Language) {
    this._language = language;
  }

  private getString(message: string, lang: Language = this._language): MessageFormat | null {
    if (!lang || !message) return null;

    const splitted = message.split(".");
    const key = splitted[0];

    if (lang[key]) {
      const val = lang[key];

      if (typeof val === "string") {
        return (): string => val;
      } else if (typeof val === "function") {
        return val;
      } else {
        return this.getString(splitted.slice(1).join("."), val as Language);
      }
    }

    return null;
  }

  translate(message: string, ...args: any[]): string {
    const translated = this.getString(message);
    return translated ? translated(...args) : message;
  }
}
