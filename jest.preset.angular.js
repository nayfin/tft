const base = require('./jest.preset.js');

/** Jest preset for the Angular projects: extends the base preset with jest-preset-angular. */
module.exports = {
  ...base,
  // Angular settings shared by the Angular libs. `<rootDir>` resolves per project, so each lib uses its own
  // tsconfig.spec.json. Non-Angular projects use jest.preset.js.
  // Angular 21 ships only .mjs files, so they must be transformed, and node_modules .mjs must not be ignored.
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes.js',
    'jest-preset-angular/build/serializers/ng-snapshot.js',
    'jest-preset-angular/build/serializers/html-comment.js',
  ],
};
