module.exports = {
  name: 'interact',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/interact',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
