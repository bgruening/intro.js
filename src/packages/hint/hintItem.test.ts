describe("hintAnimation logic", () => {
  const dataHintAnimationAttribute = "data-hint-animation";

  let element: HTMLElement;
  let hint: { getOption: (key: string) => boolean };

  beforeEach(() => {
    element = document.createElement("div");

    hint = {
      getOption: jest.fn(() => true), // default: true
    };
  });

  function getHintAnimation(element: HTMLElement, hint: any): boolean {
    const hintAnimationAttr = element.getAttribute(dataHintAnimationAttribute);
    let hintAnimation: boolean = hint.getOption("hintAnimation");
    if (hintAnimationAttr) {
      hintAnimation = hintAnimationAttr === "true";
    }
    return hintAnimation;
  }

  test("should use hint.getOption when no attribute is set", () => {
    (hint.getOption as jest.Mock).mockReturnValue(true);

    const result = getHintAnimation(element, hint);

    expect(result).toBe(true);
    expect(hint.getOption).toHaveBeenCalledWith("hintAnimation");
  });

  test("should override with true when attribute is 'true'", () => {
    element.setAttribute(dataHintAnimationAttribute, "true");
    (hint.getOption as jest.Mock).mockReturnValue(false); // default false

    const result = getHintAnimation(element, hint);

    expect(result).toBe(true);
  });

  test("should override with false when attribute is 'false'", () => {
    element.setAttribute(dataHintAnimationAttribute, "false");
    (hint.getOption as jest.Mock).mockReturnValue(true); // default true

    const result = getHintAnimation(element, hint);

    expect(result).toBe(false);
  });
});
