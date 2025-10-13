import { setOption, setOptions } from "./option";

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

  describe("setOptions with language", () => {
    it("should set language when provided", () => {
      const mockOption: any = {};

      const result = setOptions(mockOption, { language: "fr_FR" });

      expect(result.language).toEqual("fr_FR");
    });

    it("should not override language when other options change", () => {
      const mockOption: any = {
        language: "en_US",
      };

      const result = setOptions(mockOption, { htmlRender: true });

      expect(result.language).toEqual("en_US");
      expect(result.htmlRender).toBe(true);
    });

    it("should keep other options even if language changes", () => {
      const mockOption: any = {
        language: "en_US",
        htmlRender: true,
        customProp: "test",
      };

      // Change language via setOption
      const updatedOption = setOption(mockOption, "language", "fr_FR");

      // Assert language updated
      expect(updatedOption.language).toEqual("fr_FR");

      // Other options should remain
      expect(updatedOption.htmlRender).toBe(true);
      expect(updatedOption.customProp).toBe("test");
    });
  });
});
