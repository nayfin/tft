module.exports = {
  name: 'documentation',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/documentation',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
