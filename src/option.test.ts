import { setOption, setOptions } from "./option";
import { Translator, Language } from "../src/i18n/language";

describe("option", () => {
  describe("setOption", () => {
    it("should set option", () => {
      const mockOption: any = { key1: "value1" };

      // Act → capture return value
      const result = setOption(mockOption, "key1", "newValue1");

      // Assert
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

  describe("setOptions with translator", () => {
    it("should inject translator if provided", () => {
      const mockTranslator = new Translator({ code: "en_US", dictionary: {} });
      const mockOption: any = {};

      const result = setOptions(mockOption, { translator: mockTranslator });

      expect(result.translator).toBe(mockTranslator);
    });

    it("should not override translator when other options change", () => {
      const mockTranslator = new Translator({ code: "en_US", dictionary: {} });
      const mockOption: any = { translator: mockTranslator };

      const result = setOptions(mockOption, { htmlRender: true });

      expect(result.translator).toBe(mockTranslator);
      expect(result.htmlRender).toBe(true);
    });

    it("should keep htmlRender even if language changes", () => {
      const mockTranslator = new Translator({ code: "en_US", dictionary: {} });
      const mockOption: any = { translator: mockTranslator, htmlRender: true };

      // Change language via setOption
      const newLanguage = { code: "fr_FR", dictionary: {} } as Language;
      const updatedOption = setOption(mockOption, "language", newLanguage);

      // Assert translator updated
      expect(updatedOption.translator!.getLanguage().code).toBe("fr_FR");

      // htmlRender should remain
      expect(updatedOption.htmlRender).toBe(true);
    });
  });
});
