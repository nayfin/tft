describe('crispr-forms', () => {
  beforeEach(() => cy.visit('/iframe.html?id=infocomponent--primary&knob-info'));

  it('should render the component', () => {
    cy.get('crispr-info').should('exist');
  });
});
