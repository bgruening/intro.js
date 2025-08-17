describe("Intro.js tooltip position with scrollable container", () => {
  beforeEach(() => {
    cy.visit("./cypress/setup/index.html");

    // intro.js CSS
    cy.document().then((doc) => {
      if (!doc.getElementById("introjs-css")) {
        const link = doc.createElement("link");
        link.id = "introjs-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/intro.js/minified/introjs.min.css";
        doc.head.appendChild(link);
      }
    });

    // scrollable container and target element
    cy.document().then((doc) => {
      const container = doc.createElement("div");
      container.id = "scrollable-container";
      container.style.cssText =
        "height: 600px; overflow-y: auto; border: 2px solid gray; margin-bottom: 20px;";

      const inner = doc.createElement("div");
      inner.style.height = "1000px";
      inner.style.position = "relative";

      const target = doc.createElement("div");
      target.id = "target-element";
      target.style.cssText =
        "margin-top: 800px; background-color: yellow; padding: 10px;";
      target.setAttribute("data-intro", "Scrollable test element");
      target.textContent = "Step Element (scrollable test)";

      inner.appendChild(target);
      container.appendChild(inner);
      doc.body.prepend(container);
    });

    // intro.js script and initialize tour
    cy.window().then((win) => {
      return new Promise((resolve) => {
        const script = win.document.createElement("script");
        script.src = "https://unpkg.com/intro.js/minified/intro.min.js";
        script.onload = () => {
          const tour = win.introJs.tour();
          tour.setOptions({
            steps: [
              { element: "#target-element", intro: "Scrollable test tooltip" },
              {
                element: "#target-element",
                intro: "Scrollable test tooltip 2",
              },
            ],
          });
          win.__testTour = tour;
          resolve();
        };
        win.document.head.appendChild(script);
      });
    });
  });

  it("scrolls and ensures tooltip is correctly positioned near target", () => {
    cy.get("#scrollable-container").scrollTo("top");
    cy.get("#target-element")
      .scrollIntoView({ block: "center" })
      .should("be.visible");

    cy.window().then((win) => {
      win.__testTour.start();
    });

    cy.get(".introjs-tooltip", { timeout: 500 }).should("be.visible");

    cy.get("#target-element").then(($target) => {
      const targetRect = $target[0].getBoundingClientRect();

      cy.get(".introjs-tooltip").then(($tooltip) => {
        const tooltipRect = $tooltip[0].getBoundingClientRect();

        cy.log("Target Rect:", JSON.stringify(targetRect));
        cy.log("Tooltip Rect:", JSON.stringify(tooltipRect));

        const horizontallySeparate =
          tooltipRect.right < targetRect.left ||
          tooltipRect.left > targetRect.right;
        const verticallySeparate =
          tooltipRect.bottom < targetRect.top ||
          tooltipRect.top > targetRect.bottom;
        expect(horizontallySeparate || verticallySeparate).to.be.true;

        const verticalDistance = Math.min(
          Math.abs(tooltipRect.top - targetRect.bottom),
          Math.abs(targetRect.top - tooltipRect.bottom)
        );
        expect(verticalDistance).to.be.lessThan(16);
      });
    });
  });
});
