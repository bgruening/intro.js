import { HintTooltip } from "./HintTooltip";
import { HintItem } from "../hintItem";
import dom from "../../dom";
import { TourStep } from "src/packages/tour/steps";

describe("HintTooltip", () => {
  test("should apply custom className to tooltip content container", () => {
    // Arrange
    const element = document.createElement("div");
    document.body.appendChild(element);

    const hintItem: HintItem = {
      element,
      hint: "Test hint",
      position: "bottom",
      hintTooltipElement: element,
      hintPosition: "bottom-middle",
    };

    const steps: TourStep = {
      step: 1,
      intro: "Test intro",
      element: element,
      title: "Test title",
      position: "bottom",
      scrollTo: "tooltip",
    };

    const closeButtonHandler = jest.fn();

    const stubClassName = "custom-tooltip";

    // Act
    const tooltip = HintTooltip({
      hintItem,
      closeButtonEnabled: false,
      closeButtonOnClick: closeButtonHandler,
      closeButtonLabel: "Close",
      closeButtonClassName: "custom-close-btn",
      className: stubClassName,
      autoPosition: false,
      positionPrecedence: ["top", "bottom"],
      refreshes: dom.state(0),
      showStepNumbers: true,
      step: steps,
    });

    document.body.appendChild(tooltip);

    // Assert
    const contentContainer = tooltip.querySelector(".introjs-tooltiptext");
    expect(contentContainer).not.toBeNull();
    expect(contentContainer?.classList.contains(stubClassName)).toBe(true);
    expect(contentContainer?.className).toBe(
      `introjs-tooltiptext ${stubClassName}`
    );
  });
});
