describe("Intro.js tooltip position with scrollable container", () => {
  beforeEach(() => {
    cy.visit("./cypress/setup/index.html");

    // Add scrollable container and target element dynamically
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

      // Add start tour button
      let btn = doc.getElementById("start-tour");
      if (!btn) {
        btn = doc.createElement("button");
        btn.id = "start-tour";
        btn.textContent = "Start Tour";
        btn.style.display = "block";
        btn.className = "btn btn-success mb-4";
        doc.body.prepend(btn);
      }
    });

    // Inject Intro.js script and initialize tour
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
            scrollToElement: true,
            scrollTo: "element",
            tooltipPosition: "bottom",
          });
          win.__testTour = tour;
          resolve();
        };
        win.document.head.appendChild(script);
      });
    });
  });

  it("scrolls and ensures tooltip is correctly positioned near target", () => {
    // Scroll target into view within the container
    cy.get("#scrollable-container").scrollTo("top");
    cy.get("#target-element")
      .scrollIntoView({ block: "center" })
      .should("be.visible");

    // Start the tour
    cy.window().then((win) => {
      win.__testTour.start();
    });

    // Wait for tooltip
    cy.get(".introjs-tooltip", { timeout: 5000 }).should("be.visible");

    // Verify tooltip placement
    cy.get("#target-element").then(($target) => {
      const targetRect = $target[0].getBoundingClientRect();

      cy.get(".introjs-tooltip").then(($tooltip) => {
        const tooltipRect = $tooltip[0].getBoundingClientRect();

        cy.log("Target Rect:", JSON.stringify(targetRect));
        cy.log("Tooltip Rect:", JSON.stringify(tooltipRect));

        // Ensure not overlapping
        const horizontallySeparate =
          tooltipRect.right < targetRect.left ||
          tooltipRect.left > targetRect.right;
        const verticallySeparate =
          tooltipRect.bottom < targetRect.top ||
          tooltipRect.top > targetRect.bottom;
        expect(horizontallySeparate || verticallySeparate).to.be.true;

        // Ensure tooltip is close to target (±10px tolerance)
        const verticalDistance = Math.min(
          Math.abs(tooltipRect.top - targetRect.bottom),
          Math.abs(targetRect.top - tooltipRect.bottom)
        );
        expect(verticalDistance).to.be.lessThan(15);
      });
    });
  });
});
