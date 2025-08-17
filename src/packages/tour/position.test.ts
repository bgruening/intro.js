import { setPositionRelativeToStep } from "./position";
import { setPositionRelativeTo } from "../../util/positionRelativeTo";
import { TourStep } from "./steps";

jest.mock("../../util/positionRelativeTo", () => ({
  setPositionRelativeTo: jest.fn(),
}));

beforeAll(() => {
  // Mock requestAnimationFrame to call callback immediately
  global.requestAnimationFrame = (cb) => {
    cb(0);
    return 0;
  };
});

afterAll(() => {
  global.requestAnimationFrame = undefined as any;
});

test("requestAnimationFrame runs and calls setPositionRelativeTo", () => {
  const relativeElement = document.createElement("div");
  const element = document.createElement("div");
  const step: TourStep = {
    step: 0,
    title: "My Step Title",
    intro: "My step description",
    element: element,
    position: "bottom",
    tooltipClass: "my-tooltip-class",
    highlightClass: "my-highlight-class",
    scrollTo: "element",
    disableInteraction: false,
  };

  setPositionRelativeToStep(relativeElement, element, step, 10);

  expect(setPositionRelativeTo).toHaveBeenCalledWith(
    relativeElement,
    element,
    step.element,
    10
  );
});
