import { start } from "./start";
import * as steps from "./steps";
import * as nextStep from "./steps";
import { getMockTour } from "./mock";
describe("start", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("should call the onstart callback", () => {
    // Arrange
    jest.spyOn(steps, "fetchSteps").mockReturnValue([]);
    jest.spyOn(nextStep, "nextStep").mockReturnValue(Promise.resolve(true));

    const onstartCallback = jest.fn();

    const mockTour = getMockTour();
    mockTour.onStart(onstartCallback);

    // Act
    start(mockTour);

    // Assert
    expect(onstartCallback).toBeCalledTimes(1);
    expect(onstartCallback).toBeCalledWith(document.body);
  });

  test("should not start the tour if isActive is false", () => {
    // Arrange
    const fetchIntroStepsMock = jest
      .spyOn(steps, "fetchSteps")
      .mockReturnValue([]);
    const nextStepMock = jest.spyOn(nextStep, "nextStep");

    const mockTour = getMockTour();
    mockTour.setOption("isActive", false);

    // Act
    start(mockTour);

    // Assert
    expect(fetchIntroStepsMock).toBeCalledTimes(0);
    expect(nextStepMock).toBeCalledTimes(0);
  });
});
describe("fetch steps", () => {
  const getMockTour = () => {
    const steps: any[] = [];

    return {
      addStep(step: any) {
        if (!step.element) {
          const el = document.createElement("div");
          el.setAttribute("data-intro", step.intro || "mock step");
          step.element = el;
          document.body.appendChild(el);
        }
        steps.push(step);
        return this;
      },
      getSteps() {
        return steps;
      },
      start: jest.fn().mockResolvedValue(true),
    };
  };

  test("should fetch the steps", async () => {
    const mockTour = getMockTour();
    mockTour.addStep({ intro: "first" });
    await mockTour.start();
    expect(mockTour.getSteps()).toHaveLength(1);
  });
});
