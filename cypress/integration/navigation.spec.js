describe("Navigation", () => {
  
  // beforeEach(() => {
  //   // visit the page
  //   cy.visit('/');
  // });

  it("should navigate to Tuesday", () => {
    // click Tuesday and // check that the li with tuesday has a white background
    cy.visit('/');
    cy.contains("[data-testid=day]", "Tuesday")
      .click()
      .should("have.class", "day-list__item--selected");
      
  });

});