describe("Appointments", () => {
  
  beforeEach(() => {
    cy.visit('/'); // visit the page
    cy.request("GET", "/api/debug/reset")
    cy.contains("Monday")
  });

  it("should book an interview", () => {

    // click the Add appointment button
    cy.get('[alt=Add]')
      .first()
      .click();

    // Type a student name into the input
    cy.get('[data-testid=student-name-input]')
      .type("Lydia Miller-Jones");

    // Select an interviewer 
    cy.get('[alt="Sylvia Palmer"]').click();

    // Click save
    cy.contains('Save').click();

    // Sees booked appointment
    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Sylvia Palmer");

  });

  it("should edit an interview", () => {
    
    // Edit the first interview appointment
    cy.get('[data-testid="appointment"]').first()
      .get('[alt=Edit]').first().click({ force: true })

    // Select an interviewer 
    cy.get('[alt="Tori Malcolm"]').click();

    // Type a student name into the input
    cy.get('[data-testid=student-name-input]')
      .clear()
      .type('Archie Cohen');

    // Click save
    cy.contains('Save').click();

    // Sees booked appointment
    cy.contains(".appointment__card--show", "Archie Cohen");
    cy.contains(".appointment__card--show", "Tori Malcolm");

  });

  it("should cancel an interview", () => {
    
    cy.get("[alt=Delete]")
      .click({ force: true });

    cy.contains("Confirm").click();

    cy.contains("Deleting").should("exist");
    cy.contains("Deleting").should("not.exist");

    cy.contains(".appointment__card--show", "Archie Cohen")
      .should("not.exist");

  });
});