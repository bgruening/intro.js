import { Translator, getLanguageByCode, getAvailableLanguages, LanguageCode } from "./language";
import enUS from "./en_US";
import esES from "./es_ES";
import frFR from "./fr_FR";
import faIR from "./fa_IR";
import deDE from "./de_DE";

// Store original navigator
const originalNavigator = global.navigator;

// Mock navigator object
const createMockNavigator = (language?: string, userLanguage?: string) => {
  const mockNavigator: any = {};

  if (language !== undefined) {
    mockNavigator.language = language;
  }

  if (userLanguage !== undefined) {
    mockNavigator.userLanguage = userLanguage;
  }

  // Set default language only if neither language nor userLanguage is specified
  if (language === undefined && userLanguage === undefined) {
    mockNavigator.language = "en-US";
  }

  Object.defineProperty(global, "navigator", {
    value: mockNavigator,
    writable: true,
    configurable: true,
  });

  return mockNavigator;
};

describe("Translator", () => {
  beforeEach(() => {
    // Reset to default navigator before each test
    createMockNavigator();
  });

  afterAll(() => {
    // Restore original navigator
    Object.defineProperty(global, "navigator", {
      value: originalNavigator,
      writable: true,
      configurable: true,
    });
  });

  describe("Constructor", () => {
    it("should use provided language when passed", () => {
      const translator = new Translator(esES);
      expect(translator.translate("buttons.next")).toBe("Siguiente");
    });

    it("should detect browser language and use matching locale", () => {
      createMockNavigator("es-ES");
      const translator = new Translator();
      expect(translator.translate("buttons.next")).toBe("Siguiente");
    });

    it("should handle language codes with underscores", () => {
      createMockNavigator("es_ES");
      const translator = new Translator();
      expect(translator.translate("buttons.next")).toBe("Siguiente");
    });

    it("should handle language codes with dashes and convert to underscores", () => {
      createMockNavigator("fr-FR");
      const translator = new Translator();
      expect(translator.translate("buttons.next")).toBe("Suivant");
    });

    it("should fall back to en_US for unsupported languages", () => {
      createMockNavigator("zh-CN");
      const translator = new Translator();
      expect(translator.translate("buttons.next")).toBe("Next");
    });

    it("should use userLanguage as fallback for IE", () => {
      createMockNavigator(undefined, "de-DE");
      const translator = new Translator();
      expect(translator.translate("buttons.next")).toBe("Weiter");
    });

    it("should default to en-US when no language is detected", () => {
      createMockNavigator(undefined, undefined);
      const translator = new Translator();
      expect(translator.translate("buttons.next")).toBe("Next");
    });

    it("should handle case-insensitive language matching", () => {
      createMockNavigator("ES-es");
      const translator = new Translator();
      expect(translator.translate("buttons.next")).toBe("Siguiente");
    });
  });

  describe("setLanguage", () => {
    it("should change the active language", () => {
      const translator = new Translator(enUS);
      expect(translator.translate("buttons.next")).toBe("Next");

      translator.setLanguage(esES);
      expect(translator.translate("buttons.next")).toBe("Siguiente");
    });

    it("should work with all supported languages", () => {
      const translator = new Translator();

      translator.setLanguage(enUS);
      expect(translator.translate("buttons.done")).toBe("Done");

      translator.setLanguage(esES);
      expect(translator.translate("buttons.done")).toBe("Hecho");

      translator.setLanguage(frFR);
      expect(translator.translate("buttons.done")).toBe("Terminé");

      translator.setLanguage(faIR);
      expect(translator.translate("buttons.done")).toBe("پایان");

      translator.setLanguage(deDE);
      expect(translator.translate("buttons.done")).toBe("Fertig");
    });
  });

  describe("translate", () => {
    let translator: Translator;

    beforeEach(() => {
      translator = new Translator(enUS);
    });

    it("should translate simple keys", () => {
      expect(translator.translate("buttons.next")).toBe("Next");
      expect(translator.translate("buttons.prev")).toBe("Back");
      expect(translator.translate("buttons.skip")).toBe("Skip");
      expect(translator.translate("buttons.done")).toBe("Done");
    });

    it("should translate nested keys", () => {
      expect(translator.translate("messages.dontShowAgainLabel")).toBe(
        "Don't show this again"
      );
      expect(translator.translate("messages.stepNumbersOfLabel")).toBe("of");
    });

    it("should return the key itself when translation is not found", () => {
      expect(translator.translate("nonexistent.key")).toBe("nonexistent.key");
      expect(translator.translate("buttons.nonexistent")).toBe(
        "buttons.nonexistent"
      );
    });

    it("should handle empty or null keys", () => {
      expect(translator.translate("")).toBe("");
      expect(translator.translate(null as any)).toBe(null);
      expect(translator.translate(undefined as any)).toBe(undefined);
    });

    it("should handle function-based translations with parameters", () => {
      // Create a custom language with function-based translations
      const customLang = {
        greetings: {
          hello: (name: string) => `Hello, ${name}!`,
          welcome: (name: string, count: number) =>
            `Welcome ${name}, you have ${count} messages`,
        },
      };

      translator.setLanguage(customLang);
      expect(translator.translate("greetings.hello", "John")).toBe(
        "Hello, John!"
      );
      expect(translator.translate("greetings.welcome", "Jane", 5)).toBe(
        "Welcome Jane, you have 5 messages"
      );
    });

    it("should handle deeply nested keys", () => {
      const deepLang = {
        level1: {
          level2: {
            level3: {
              message: "Deep message",
            },
          },
        },
      };

      translator.setLanguage(deepLang);
      expect(translator.translate("level1.level2.level3.message")).toBe(
        "Deep message"
      );
    });

    it("should return key when intermediate path doesn't exist", () => {
      expect(translator.translate("buttons.nonexistent.deep")).toBe(
        "buttons.nonexistent.deep"
      );
    });
  });

  describe("Language consistency", () => {
    const requiredKeys = [
      "buttons.next",
      "buttons.prev",
      "buttons.skip",
      "buttons.done",
      "messages.dontShowAgainLabel",
      "messages.stepNumbersOfLabel",
    ];

    const languages = [
      { name: "English", lang: enUS },
      { name: "Spanish", lang: esES },
      { name: "French", lang: frFR },
      { name: "Persian", lang: faIR },
      { name: "German", lang: deDE },
    ];

    languages.forEach(({ name, lang }) => {
      describe(`${name} language`, () => {
        let translator: Translator;

        beforeEach(() => {
          translator = new Translator(lang);
        });

        requiredKeys.forEach((key) => {
          it(`should have translation for ${key}`, () => {
            const translation = translator.translate(key);
            expect(translation).toBeDefined();
            expect(translation).not.toBe(key); // Should not return the key itself
            expect(typeof translation).toBe("string");
            expect(translation.length).toBeGreaterThan(0);
          });
        });

        it("should have all button translations", () => {
          expect(translator.translate("buttons.next")).toBeTruthy();
          expect(translator.translate("buttons.prev")).toBeTruthy();
          expect(translator.translate("buttons.skip")).toBeTruthy();
          expect(translator.translate("buttons.done")).toBeTruthy();
        });

        it("should have all message translations", () => {
          expect(
            translator.translate("messages.dontShowAgainLabel")
          ).toBeTruthy();
          expect(
            translator.translate("messages.stepNumbersOfLabel")
          ).toBeTruthy();
        });
      });
    });
  });

  describe("Edge cases", () => {
    it("should handle malformed language objects", () => {
      const malformedLang = {
        buttons: null,
        messages: undefined,
      };

      const translator = new Translator(malformedLang as any);
      expect(translator.translate("buttons.next")).toBe("buttons.next");
      expect(translator.translate("messages.dontShowAgainLabel")).toBe(
        "messages.dontShowAgainLabel"
      );
    });

    it("should handle circular references gracefully", () => {
      const circularLang: any = {
        buttons: {
          next: "Next",
        },
      };
      circularLang.buttons.circular = circularLang.buttons;

      const translator = new Translator(circularLang);
      expect(translator.translate("buttons.next")).toBe("Next");
      // Should not cause infinite recursion
      expect(translator.translate("buttons.circular.next")).toBe("Next");
    });

    it("should handle mixed string and function values", () => {
      const mixedLang = {
        buttons: {
          next: "Next",
          custom: (param: string) => `Custom ${param}`,
        },
      };

      const translator = new Translator(mixedLang);
      expect(translator.translate("buttons.next")).toBe("Next");
      expect(translator.translate("buttons.custom", "Button")).toBe(
        "Custom Button"
      );
    });
  });

  describe("Performance", () => {
    it("should handle multiple translations efficiently", () => {
      const translator = new Translator(enUS);
      const startTime = performance.now();

      // Perform many translations
      for (let i = 0; i < 1000; i++) {
        translator.translate("buttons.next");
        translator.translate("buttons.prev");
        translator.translate("messages.dontShowAgainLabel");
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Should complete within reasonable time (less than 100ms for 3000 translations)
      expect(duration).toBeLessThan(100);
    });
  });

  describe("Language Code Support", () => {
    describe("getLanguageByCode", () => {
      it("should return correct language object for valid codes", () => {
        expect(getLanguageByCode("en_US")).toBe(enUS);
        expect(getLanguageByCode("es_ES")).toBe(esES);
        expect(getLanguageByCode("fr_FR")).toBe(frFR);
        expect(getLanguageByCode("de_DE")).toBe(deDE);
        expect(getLanguageByCode("fa_IR")).toBe(faIR);
      });

      it("should return English as fallback for invalid codes", () => {
        expect(getLanguageByCode("invalid_CODE" as LanguageCode)).toBe(enUS);
      });
    });

    describe("getAvailableLanguages", () => {
      it("should return all available language codes", () => {
        const availableLanguages = getAvailableLanguages();
        expect(availableLanguages).toContain("en_US");
        expect(availableLanguages).toContain("es_ES");
        expect(availableLanguages).toContain("fr_FR");
        expect(availableLanguages).toContain("de_DE");
        expect(availableLanguages).toContain("fa_IR");
        expect(availableLanguages).toHaveLength(5);
      });

      it("should return array of strings", () => {
        const availableLanguages = getAvailableLanguages();
        availableLanguages.forEach(code => {
          expect(typeof code).toBe("string");
        });
      });
    });

    describe("String-based language usage", () => {
      it("should work with language codes in Translator", () => {
        // Test that we can use the language objects returned by getLanguageByCode
        const spanishLang = getLanguageByCode("es_ES");
        const translator = new Translator(spanishLang);
        expect(translator.translate("buttons.next")).toBe("Siguiente");
      });

      it("should work with all available language codes", () => {
        const testCases = [
          { code: "en_US" as LanguageCode, expected: "Next" },
          { code: "es_ES" as LanguageCode, expected: "Siguiente" },
          { code: "fr_FR" as LanguageCode, expected: "Suivant" },
          { code: "de_DE" as LanguageCode, expected: "Weiter" },
          { code: "fa_IR" as LanguageCode, expected: "بعدی" },
        ];

        testCases.forEach(({ code, expected }) => {
          const lang = getLanguageByCode(code);
          const translator = new Translator(lang);
          expect(translator.translate("buttons.next")).toBe(expected);
        });
      });
    });

    describe("Integration with Tour options", () => {
      // Mock Tour class for testing
      class MockTour {
        private _options: any = {};
        
        setOptions(options: any) {
          // Simulate the Tour class setOptions logic
          const processedOptions = { ...options };
          
          if (processedOptions.language) {
            let languageObj;
            if (typeof processedOptions.language === 'string') {
              languageObj = getLanguageByCode(processedOptions.language as LanguageCode);
              processedOptions.language = languageObj;
            } else {
              languageObj = processedOptions.language;
            }
            
            // Update button labels based on the new language
            const translator = new Translator(languageObj);
            
            if (!options.nextLabel) {
              processedOptions.nextLabel = translator.translate("buttons.next");
            }
            if (!options.prevLabel) {
              processedOptions.prevLabel = translator.translate("buttons.prev");
            }
            if (!options.doneLabel) {
              processedOptions.doneLabel = translator.translate("buttons.done");
            }
          }
          
          this._options = { ...this._options, ...processedOptions };
          return this;
        }
        
        getOption(key: string) {
          return this._options[key];
        }
      }

      it("should work with string language codes in setOptions", () => {
        const tour = new MockTour();
        
        tour.setOptions({ language: "es_ES" });
        
        expect(tour.getOption("nextLabel")).toBe("Siguiente");
        expect(tour.getOption("prevLabel")).toBe("Atrás");
        expect(tour.getOption("doneLabel")).toBe("Hecho");
      });

      it("should work with different language codes", () => {
        const tour = new MockTour();
        
        // Test German
        tour.setOptions({ language: "de_DE" });
        expect(tour.getOption("nextLabel")).toBe("Weiter");
        expect(tour.getOption("prevLabel")).toBe("Zurück");
        expect(tour.getOption("doneLabel")).toBe("Fertig");
        
        // Test French
        tour.setOptions({ language: "fr_FR" });
        expect(tour.getOption("nextLabel")).toBe("Suivant");
        expect(tour.getOption("prevLabel")).toBe("Retour");
        expect(tour.getOption("doneLabel")).toBe("Terminé");
        
        // Test Persian
        tour.setOptions({ language: "fa_IR" });
        expect(tour.getOption("nextLabel")).toBe("بعدی");
        expect(tour.getOption("prevLabel")).toBe("قبلی");
        expect(tour.getOption("doneLabel")).toBe("پایان");
      });

      it("should not override explicitly provided button labels", () => {
        const tour = new MockTour();
        
        tour.setOptions({ 
          language: "es_ES",
          nextLabel: "Custom Next",
          prevLabel: "Custom Prev"
        });
        
        // Custom labels should be preserved
        expect(tour.getOption("nextLabel")).toBe("Custom Next");
        expect(tour.getOption("prevLabel")).toBe("Custom Prev");
        // But doneLabel should be translated since it wasn't provided
        expect(tour.getOption("doneLabel")).toBe("Hecho");
      });
    });
  });
});
