import { setOption, setOptions } from "./option";
import { Translator } from "./i18n/language";

Object.defineProperty(global, "navigator", {
  value: { language: "en-US" },
  writable: true,
});

describe("option", () => {
  describe("setOption", () => {
    it("should set option", () => {
      const mockOption: any = { key1: "value1" };

      // Act → capture return value
      const result = setOption(mockOption, "key1", "newValue1");

      //Assert
      expect(result.key1).toBe("newValue1");
      expect(mockOption.key1).toBe("value1");
    });
  });

  describe("setOptions", () => {
    it("should set options", () => {
      const mockOption: any = { key1: "value1", key2: "value2" };

      // Act → capture return value
      const result = setOptions(mockOption, {
        key2: "newValue2",
        key1: "newValue1",
      });

      // Assert
      expect(result.key1).toBe("newValue1");
      expect(result.key2).toBe("newValue2");
      expect(mockOption.key1).toBe("value1");
      expect(mockOption.key2).toBe("value2");
    });
  });

  describe("setOptions with language", () => {
    it("should set language when provided", () => {
      const mockOption: any = {};
      // Act
      const result = setOptions(mockOption, { language: "fr_FR" });
      // Assert
      expect(result.language).toEqual("fr_FR");
    });

    it("should not override language when other options change", () => {
      const mockOption: any = {
        language: "en_US",
      };
      // Act
      const result = setOptions(mockOption, { htmlRender: true });
      // Assert
      expect(result.language).toEqual("en_US");
      expect(result.htmlRender).toBe(true);
    });

    it("should keep other options even if language changes", () => {
      const mockOption: any = {
        language: "en_US",
        htmlRender: true,
        customProp: "test",
      };
      // Act
      const updatedOption = setOption(mockOption, "language", "fr_FR");
      // Assert
      expect(updatedOption.language).toEqual("fr_FR");
      expect(updatedOption.htmlRender).toBe(true);
      expect(updatedOption.customProp).toBe("test");
    });
  });

  describe("Label handling and emoji overrides", () => {
    it("should override label with emoji when language is already set", () => {
      const options: any = {
        language: "de_DE",
        nextLabel: "Weiter",
        prevLabel: "Zurück",
        doneLabel: "Fertig",
      };

      const updated = setOptions(options, { nextLabel: "➡️" });

      expect(updated.nextLabel).toBe("➡️"); // emoji kept
      expect(updated.prevLabel).toBe("Zurück"); // other labels stay German
      expect(updated.doneLabel).toBe("Fertig");
    });

    it("overWritten emoji label when changing language", () => {
      const options: any = {
        language: "de_DE",
        nextLabel: "➡️",
        prevLabel: "Zurück",
        doneLabel: "Fertig",
      };

      const updated = setOptions(options, { language: "fr_FR" });

      expect(updated.nextLabel).toBe("Suivant"); // emoji overWritten by French
      const t = new Translator("fr_FR");
      expect(updated.prevLabel).toBe(t.translate("buttons.prev")); // now French
      expect(updated.doneLabel).toBe(t.translate("buttons.done"));
    });

    it("should retranslate all labels if none are custom", () => {
      const options: any = { language: "en_US" };
      const updated = setOptions(options, { language: "de_DE" });

      const t = new Translator("de_DE");
      expect(updated.nextLabel).toBe(t.translate("buttons.next"));
      expect(updated.prevLabel).toBe(t.translate("buttons.prev"));
      expect(updated.doneLabel).toBe(t.translate("buttons.done"));
    });

    it("should keep emoji doneLabel when language is not set", () => {
      const defaultOptions: any = {
        nextLabel: "Next",
        prevLabel: "Back",
        doneLabel: "Done",
      };

      const withEmoji = setOptions(defaultOptions, { doneLabel: "✅" });

      const afterStart = setOptions(withEmoji, { isActive: true });

      expect(afterStart.doneLabel).toBe("✅");

      expect(afterStart.nextLabel).toBe("Next");
      expect(afterStart.prevLabel).toBe("Back");
    });
  });
});
