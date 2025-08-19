context("Intro.js tooltip position with scrollable container", () => {
  beforeEach(() => {
    cy.visit("./cypress/setup/index.html");

    // scrollable container and target element
    cy.document().then((doc) => {
      const container = doc.createElement("div");
      container.id = "scrollable-container";
      container.style.cssText =
        "height: 600px; overflow-y: scroll; border: 2px solid gray; margin-bottom: 20px;";

      const getTargetElement = (id, marginTop, label) => {
        const target = doc.createElement("div");
        target.id = id;
        target.style.cssText = `margin-top: ${marginTop}; background-color: yellow; padding: 10px;`;
        target.setAttribute("data-intro", label);
        target.textContent = `Step Element (${label})`;
        return target;
      };

      container.appendChild(
        getTargetElement(
          "scrollable-target-element-1",
          "5px",
          "First Scrollable Step"
        )
      );
      container.appendChild(
        getTargetElement(
          "scrollable-target-element-2",
          "800px",
          "Second Scrollable Step"
        )
      );
      doc.body.prepend(container);
    });
  });

  it("scrolls and ensures tooltip is correctly positioned near target", () => {
    cy.get("#scrollable-container").scrollTo("top");

    cy.window().then((win) => {
      cy.compareSnapshot("scrollable-first-step");

      win.introJs.tour().start();
      cy.wait(500);
      cy.compareSnapshot("scrollable-second-step");

      cy.nextStep();
      cy.wait(500);
      cy.compareSnapshot("scrollable-third-step");

      cy.nextStep();
      cy.wait(800);
      cy.compareSnapshot("scrollable-fourth-step");
    });
  });
});
