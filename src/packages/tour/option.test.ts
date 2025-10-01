import { getDefaultTourOptions } from "./option";
import { Translator, getLanguageByCode } from "../../i18n/language";

describe("getDefaultTourOptions", () => {
  it("should create a new Translator if none is injected", () => {
    const opts = getDefaultTourOptions(undefined, "fr_FR");

    expect(opts.translator).toBeInstanceOf(Translator);

    expect(opts.nextLabel).toBe(opts.translator.translate("buttons.next"));
    expect(opts.doneLabel).toBe(opts.translator.translate("buttons.done"));
  });

  it("should reuse the injected translator instance", () => {
    const injectedTranslator = new Translator(getLanguageByCode("de_DE"));
    const opts = getDefaultTourOptions(injectedTranslator, "de_DE");

    expect(opts.translator).toBe(injectedTranslator);
  });

  it("should update translator language if created new", () => {
    const opts = getDefaultTourOptions(undefined, "es_ES");

    expect(opts.translator.translate("buttons.next")).toBe(opts.nextLabel);
  });

  it("should not overwrite injected translator if already provided", () => {
    const injectedTranslator = new Translator(getLanguageByCode("fa_IR"));
    jest.spyOn(injectedTranslator, "setLanguage");

    const opts = getDefaultTourOptions(injectedTranslator, "fr_FR");

    expect(opts.translator).toBe(injectedTranslator);

    expect(injectedTranslator.setLanguage).toHaveBeenCalledWith(
      getLanguageByCode("fr_FR")
    );
  });
});
