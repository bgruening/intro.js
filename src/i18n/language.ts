import enUS from "./en_US";

type MessageFormat = (...args: any[]) => string;
type Message = string | MessageFormat;
export type Language = { [key: string]: Message | Language };

export class Translator {
  private _language: Language;

  constructor(language?: Language) {
    if (language) {
      this._language = language;
    } else {
      const browserLang = navigator.language.replace("-", "_");
      try {
        this._language = require(`./${browserLang}`).default;
      } catch {
        this._language = enUS;
      }
    }
  }

  setLanguage(language: Language) {
    this._language = language;
  }

  private getString(message: string, lang: Language): MessageFormat | null {
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
        return this.getString(splitted.slice(1).join("."), val);
      }
    }

    return null;
  }

  translate(message: string, ...args: any[]): string {
    const translated = this.getString(message, this._language);
    return translated ? translated(...args) : message;
  }
}
