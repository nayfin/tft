describe('crispr-forms', () => {
  beforeEach(() => cy.visit('/iframe.html?id=crisprformcomponent--primary&knob-config&knob-form&knob-value'));

  it('should render the component', () => {
    cy.get('crispr-form').should('exist');
  });
});
