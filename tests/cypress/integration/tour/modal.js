context('Modal', () => {
  beforeEach(() => {
    cy.visit('./cypress/setup/index.html');
  });

  it('should match the popup', () => {
    cy.window().then((win) => {
      win.introJs().setOptions({
        steps: [{
          intro: "step one"
        }, {
          intro: "step two"
        }]
      }).start();

      cy.wait(500);

      cy.compareSnapshot('first-step', 0);

      cy.get('.introjs-nextbutton').click();
      cy.wait(800);

      cy.compareSnapshot('second-step', 0);

      cy.get('.introjs-nextbutton').click();
      cy.wait(800);

      cy.compareSnapshot('exit', 0);
    });
  });
});
