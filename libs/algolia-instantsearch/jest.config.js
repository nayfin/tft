module.exports = {
  name: 'algolia-instantsearch',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/algolia-instantsearch',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
