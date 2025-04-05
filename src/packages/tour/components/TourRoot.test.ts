import { TourRoot } from "./TourRoot";
import dom from "../../dom";
import { nextStep, previousStep } from "../steps";

jest.mock("../../dom", () => ({
  tags: { div: jest.fn((props, ...children) => ({ props, children })) },
  state: jest.fn((initial) => ({ val: initial })),
  derive: jest.fn((fn) => ({ val: fn() })),
}));

jest.mock("../ReferenceLayer", () => ({
  ReferenceLayer: jest.fn(() => "ReferenceLayer"),
}));
jest.mock("../HelperLayer", () => ({
  HelperLayer: jest.fn(() => "HelperLayer"),
}));
jest.mock("../OverlayLayer", () => ({
  OverlayLayer: jest.fn(() => "OverlayLayer"),
}));
jest.mock("../DisableInteraction", () => ({
  DisableInteraction: jest.fn(() => "DisableInteraction"),
}));
jest.mock("../steps", () => ({ nextStep: jest.fn(), previousStep: jest.fn() }));

jest.useFakeTimers();

describe("TourRoot", () => {
  let tour: any;

  beforeEach(() => {
    tour = {
      getCurrentStepSignal: jest.fn(() => ({ val: 0 })),
      getRefreshesSignal: jest.fn(() => ({ val: 0 })),
      getSteps: jest.fn(() => [{ disableInteraction: false }]),
      getTargetElement: jest.fn(() => "targetElement"),
      getOption: jest.fn((option: keyof typeof Option) => {
        const options = {
          highlightClass: "highlight",
          overlayOpacity: 0.5,
          helperElementPadding: 10,
          exitOnOverlayClick: true,
          positionPrecedence: ["top", "bottom"],
          autoPosition: true,
          showStepNumbers: true,
          showBullets: true,
          showButtons: true,
          tooltipClass: "tooltip",
          nextToDone: false,
          showProgress: true,
          scrollToElement: true,
          scrollPadding: 20,
          dontShowAgain: false,
        };
        return options[option];
      }),
      exit: jest.fn(),
      goToStep: jest.fn(),
      isLastStep: jest.fn(() => false),
      getCurrentStep: jest.fn(() => 0),
      callback: jest.fn(() => jest.fn()),
      setDontShowAgain: jest.fn(),
    };
  });

  it("renders correctly and initializes state", () => {
    // Arrange
    // Act
    const component = TourRoot({ tour });

    // Assert
    expect(dom.tags.div).toHaveBeenCalled();
    expect(component).toBeDefined();
  });

  it("calls nextStep on next button click", async () => {
    // Arrange
    const component = TourRoot({ tour });
    const nextClickHandler = (component.children[1] as any).props.onNextClick;

    // Act
    await nextClickHandler({ target: { className: "next-button" } });

    // Assert
    expect(nextStep).toHaveBeenCalledWith(tour);
  });

  it("calls previousStep on prev button click", async () => {
    // Arrange
    const component = TourRoot({ tour });
    const prevClickHandler = (component.children[1] as any).props.onPrevClick;

    // Act
    await prevClickHandler();

    // Assert
    expect(previousStep).toHaveBeenCalledWith(tour);
  });

  it("calls tour.exit when overlay is clicked and exitOnOverlayClick is true", async () => {
    // Arrange
    const component = TourRoot({ tour });
    const overlayClickHandler = (component.children[0] as any).props.onExitTour;

    // Act
    await overlayClickHandler();

    // Assert
    expect(tour.exit).toHaveBeenCalled();
  });

  it("removes root when tour is done", () => {
    // Arrange
    (dom.state as jest.Mock).mockImplementationOnce(() => ({ val: 0 }));
    const component = TourRoot({ tour });

    if (component instanceof HTMLElement && component.style) {
      component.style.display = "none"; // Example adjustment
    }

    // Act & Assert
    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 250);
  });

  it("calls setDontShowAgain when checkbox is toggled", () => {
    // Arrange
    const component = TourRoot({ tour });
    const dontShowAgainHandler = (component.children[1] as any).props
      .onDontShowAgainChange;

    // Act
    dontShowAgainHandler(true);

    // Assert
    expect(tour.setDontShowAgain).toHaveBeenCalledWith(true);
  });
});
