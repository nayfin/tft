const { getJestProjectsAsync } = require('@nx/jest');

module.exports = async () => ({
  projects: [
    ...(await getJestProjectsAsync()),
    '<rootDir>/apps/documentation',
    '<rootDir>/apps/api',
    '<rootDir>/libs/api-interfaces',
    '<rootDir>/libs/crispr-forms',
    '<rootDir>/libs/core',
    '<rootDir>/libs/form-validation-handler',
    '<rootDir>/libs/interact',
    '<rootDir>/libs/mat-instantsearch',
    '<rootDir>/libs/ui-imports',
  ],
});
