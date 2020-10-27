describe('crispr-forms', () => {
  beforeEach(() => cy.visit('/iframe.html?id=optioncomponent--primary&knob-option'));

  it('should render the component', () => {
    cy.get('crispr-option').should('exist');
  });
});
