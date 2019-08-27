import { getGreeting } from '../support/app.po';

describe('documentation', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    getGreeting().contains('Welcome to documentation!');
  });
});
