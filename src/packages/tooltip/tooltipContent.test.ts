import { TooltipContent } from "./tooltipContent";

describe("TooltipContent", () => {
  it("renders plain text when tooltipRenderAsHtml is false", () => {
    const el = TooltipContent({
      text: "Hello, tooltip!",
      tooltipRenderAsHtml: false,
    });

    expect(el.textContent).toBe("Hello, tooltip!");
    expect(el.innerHTML).toBe("Hello, tooltip!");
    expect(el.className).toBe("introjs-tooltiptext");
  });

  it("renders HTML content when tooltipRenderAsHtml is true", () => {
    const el = TooltipContent({
      text: "<strong>Bold Text</strong>",
      tooltipRenderAsHtml: true,
    });

    expect(el.innerHTML).toBe("<strong>Bold Text</strong>");
    expect(el.querySelector("strong")?.textContent).toBe("Bold Text");
  });

  it("applies a custom class when provided", () => {
    const el = TooltipContent({
      text: "Custom class test",
      className: "my-custom-tooltip",
    });

    expect(el.className).toBe("my-custom-tooltip");
    expect(el.textContent).toBe("Custom class test");
  });

  it("clears old content on re-derivation", () => {
    const el = TooltipContent({
      text: "<i>Initial</i>",
      tooltipRenderAsHtml: true,
    });

    el.innerHTML = "<b>Old Content</b>"; // Simulate old content
    const updated = TooltipContent({
      text: "Updated text",
      tooltipRenderAsHtml: false,
    });

    expect(updated.innerHTML).toBe("Updated text");
    expect(updated.querySelector("b")).toBeNull();
  });
});
