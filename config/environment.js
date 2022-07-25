'use strict';

const remoteConfig = require('../remote_config_defaults.json');

module.exports = function (environment) {
  let ENV = {
    modulePrefix: 'tepacheweb',
    environment,
    rootURL: '/',
    locationType: 'history',
    EmberENV: {
      FEATURES: {},
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false,
      },
    },

    'ember-cloud-firestore-adapter': {
      firebaseConfig: {
        apiKey: 'AIzaSyDiKmk72f0aOl3Dw0xK9ehK1YyQhzmHxIE',
        authDomain: 'tepache-mode.firebaseapp.com',
        projectId: 'tepache-mode',
        storageBucket: 'tepache-mode.appspot.com',
        messagingSenderId: '135682984531',
        appId: '1:135682984531:web:ff2d084602798c1c4694a6',
        measurementId: 'G-VNHTKVCJLS',
      },

      firestore: {
        emulator: {
          hostname: 'localhost',
          port: 8080,
        },
      },

      auth: {
        emulator: {
          hostname: 'localhost',
          port: 9099,
        },
      },
    },

    APP: {
      remoteConfig,
    },
  };

  if (environment === 'development') {
    ENV.APP.LOG_RESOLVER = true;
    ENV.APP.LOG_ACTIVE_GENERATION = true;
    ENV.APP.LOG_TRANSITIONS = true;
    ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    ENV.locationType = 'none';

    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    ENV['ember-cloud-firestore-adapter'].firestore.emulator = null;
    ENV['ember-cloud-firestore-adapter'].auth.emulator = null;
  }

  return ENV;
};
