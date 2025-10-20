import dom from "../dom";
import { TourStep } from "./steps";
import { Tour } from "./tour";
import {
  dataIntroAttribute,
  dataPosition,
  dataStepAttribute,
  dataTitleAttribute,
} from "./dataAttributes";

const { div, b, a, h1 } = dom.tags;

export const appendMockSteps = (targetElement: HTMLElement = document.body) => {
  // ✅ Create a single region container instead of <main>
  let region = targetElement.querySelector('[role="region"]');
  if (!region) {
    region = document.createElement("section");
    region.setAttribute("role", "region");
    region.setAttribute("aria-label", "Mock steps region");
    targetElement.appendChild(region);
  }

  const mockElementOne = div();
  mockElementOne.setAttribute(dataIntroAttribute, "Mock element");

  const mockElementTwo = b();
  mockElementTwo.setAttribute(dataIntroAttribute, "Mock element left position");
  mockElementTwo.setAttribute(dataPosition, "left");

  const mockElementThree = h1("Mock heading");
  mockElementThree.setAttribute(
    dataIntroAttribute,
    "Mock element second to last"
  );
  mockElementThree.setAttribute(dataStepAttribute, "10");
  mockElementThree.setAttribute(dataTitleAttribute, "test title");
  mockElementThree.setAttribute("aria-label", "Mock heading");

  const mockElementFour = a("Mock element last");
  mockElementFour.setAttribute(dataIntroAttribute, "Mock element last");
  mockElementFour.setAttribute(dataStepAttribute, "20");

  // ✅ Append inside region, not <main>
  region.appendChild(mockElementOne);
  region.appendChild(mockElementTwo);
  region.appendChild(mockElementThree);
  region.appendChild(mockElementFour);

  return [mockElementOne, mockElementTwo, mockElementThree, mockElementFour];
};

export const getMockPartialSteps = (): Partial<TourStep>[] => {
  return [
    {
      title: "Floating title 1",
      intro: "Step One of the tour",
    },
    {
      title: "Floating title 2",
      intro: "Step Two of the tour",
    },
    {
      title: "First title",
      intro: "Step Three of the tour",
      position: "top",
      scrollTo: "tooltip",
      element: "h1",
    },
    {
      intro: "Step Four of the tour",
      position: "right",
      scrollTo: "off",
      element: document.createElement("div"),
    },
    {
      element: ".not-found",
      intro: "Element not found",
    },
  ];
};

export const getMockSteps = (): TourStep[] => {
  return [
    {
      step: 1,
      scrollTo: "tooltip",
      position: "bottom",
      title: "Floating title 1",
      intro: "Step One of the tour",
    },
    {
      step: 2,
      scrollTo: "tooltip",
      position: "bottom",
      title: "Floating title 2",
      intro: "Step Two of the tour",
    },
    {
      step: 3,
      position: "top",
      scrollTo: "tooltip",
      title: "First title",
      intro: "Step Three of the tour",
    },
    {
      step: 4,
      position: "right",
      scrollTo: "off",
      title: "",
      intro: "Step Four of the tour",
      element: document.createElement("div"),
    },
    {
      step: 5,
      position: "right",
      scrollTo: "off",
      title: "",
      intro: "Element not found",
      element: ".not-found",
    },
  ];
};

export const getMockTour = (targetElement: HTMLElement = document.body) => {
  return new Tour(targetElement);
};
