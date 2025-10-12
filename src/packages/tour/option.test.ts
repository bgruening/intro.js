import { getDefaultTourOptions } from "./option";
import { TranslatorManager } from "../../i18n/TranslatorManager";
import enUS from "../../i18n/en_US";

Object.defineProperty(global, "navigator", {
  value: { language: "en-US" },
  writable: true,
});

describe("getDefaultTourOptions", () => {
  it("should create a new Translator internally if none is injected", () => {
    const opts = getDefaultTourOptions();
    const t = TranslatorManager.createTranslator(enUS);

    expect(opts.nextLabel).toBe(t.translate("buttons.next"));
    expect(opts.doneLabel).toBe(t.translate("buttons.done"));
    expect(opts.language).toEqual(enUS);
  });

  it("should use the injected translator's language for translations", () => {
    const language = { name: "frFR", code: "fr_FR" };
    const translator = TranslatorManager.createTranslator(language);
    const opts = getDefaultTourOptions(translator);

    expect(opts.nextLabel).toBe(translator.translate("buttons.next"));
    expect(opts.prevLabel).toBe(translator.translate("buttons.prev"));
    expect(opts.doneLabel).toBe(translator.translate("buttons.done"));
    expect(opts.language).toEqual(language);
  });

  it("should update all labels correctly for different languages", () => {
    const lang = { code: "es_ES", name: "esES" };
    const translator = TranslatorManager.createTranslator(lang);
    const opts = getDefaultTourOptions(translator);

    expect(opts.nextLabel).toBe(translator.translate("buttons.next"));
    expect(opts.stepNumbersOfLabel).toBe(
      translator.translate("messages.stepNumbersOfLabel")
    );
    expect(opts.dontShowAgainLabel).toBe(
      translator.translate("messages.dontShowAgain")
    );
    expect(opts.language).toEqual(lang);
  });

  it("should always return an independent translator when called separately", () => {
    const opts1 = getDefaultTourOptions();
    const opts2 = getDefaultTourOptions();

    expect(opts1.nextLabel).toBe(opts2.nextLabel);
    expect(opts1.language).toEqual(enUS);
  });

  it("should default to en_US if translator not provided", () => {
    const opts = getDefaultTourOptions();
    expect(opts.language).toEqual(enUS);
  });
});
