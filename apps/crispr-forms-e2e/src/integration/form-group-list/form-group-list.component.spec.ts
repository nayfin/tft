describe('crispr-forms', () => {
  beforeEach(() => cy.visit('/iframe.html?id=formgrouplistcomponent--primary'));

  it('should render the component', () => {
    cy.get('crispr-form-group-list').should('exist');
  });
});
