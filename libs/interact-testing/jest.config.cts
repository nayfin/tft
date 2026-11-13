module.exports = {
  displayName: 'interact-testing',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  // Plain TypeScript, no Angular: override the Angular transform from the root preset.
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  transformIgnorePatterns: ['/node_modules/'],
  snapshotSerializers: [],
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/libs/interact-testing',
};
