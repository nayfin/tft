module.exports = {
  name: 'mat-instantsearch',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/mat-instantsearch',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
