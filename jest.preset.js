const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
  /* TODO: Update to latest Jest snapshotFormat
   * By default Nx has kept the older style of Jest Snapshot formats
   * to prevent breaking of any existing tests with snapshots.
   * It's recommend you update to the latest format.
   * You can do this by removing snapshotFormat property
   * and running tests with --update-snapshot flag.
   * Example: "nx affected --targets=test --update-snapshot"
   * More info: https://jestjs.io/docs/upgrading-to-jest29#snapshot-format
   */
  snapshotFormat: { escapeString: true, printBasicPrototype: true },
  // Angular settings shared by the Angular libs. `<rootDir>` resolves per project, so each lib uses its own
  // tsconfig.spec.json. Non-Angular projects (interact-testing) override `transform` with ts-jest.
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
