// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase:  {
    apiKey: 'AIzaSyClPsiH6DFJc_XvltxqrhLeFRWVm3jUZoo',
    authDomain: 'tft-library.firebaseapp.com',
    databaseURL: 'https://tft-library.firebaseio.com',
    projectId: 'tft-library',
    storageBucket: 'tft-library.appspot.com',
    messagingSenderId: '113394856035'
  },
  // TODO: get version for each project
  // e.g. version: { CRISPR_FORMS: require('../../crispr-forms/package.json').version };
  // VERSION: require('../../package.json').version
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
