import { Translator, Language } from "./language";

/**
 * TranslatorManager handles creating independent Translator instances.
 */
export class TranslatorManager {
  /**
   * Creates a new Translator instance with the specified language.
   * Always returns a new, independent Translator.
   * @param language Language object or language code
   */
  static createTranslator(language: Language): Translator {
    const translator = new Translator();
    translator.setLanguage(language);
    return translator;
  }
}
