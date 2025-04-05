import dom from "../dom";
import { Tooltip, TooltipProps } from "./tooltip";

describe("Tooltip", () => {
  it("should set the correct class name", () => {
    // Arrange
    const stubClassName = "custom-tooltip";
    const props: TooltipProps = {
      className: stubClassName,
      element: document.createElement("div"),
      position: "top",
      refreshes: dom.state(0),
      showStepNumbers: true,
      autoPosition: false,
      positionPrecedence: ["top", "bottom"],
      hintMode: false,
    };

    // Act
    const tooltip = Tooltip(props);

    // Assert
    expect(tooltip.className).toContain(stubClassName);
  });
});
