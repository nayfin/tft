module.exports = {
  name: 'form-validation-handler',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/form-validation-handler',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
