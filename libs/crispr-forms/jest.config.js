module.exports = {
  name: 'crispr-forms',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/crispr-forms',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
