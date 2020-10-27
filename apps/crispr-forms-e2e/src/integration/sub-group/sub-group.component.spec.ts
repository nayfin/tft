describe('crispr-forms', () => {
  beforeEach(() => cy.visit('/iframe.html?id=subgroupcomponent--primary'));

  it('should render the component', () => {
    cy.get('crispr-sub-group').should('exist');
  });
});
