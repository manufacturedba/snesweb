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

    'ember-cli-google': {
      analytics: {
        version: 'v4',
        measurementId: 'G-XXXXXXXXXX',
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
        measurementId: 'G-EM9H1WY5XC',
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

    APP: {},
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
    ENV.APP.liveMode = process.env.LIVE_MODE || false;
    ENV['ember-cli-google'] = {
      analytics: {
        version: 'v4',
        measurementId: process.env.GOOGLE_MEASUREMENT_ID,
      },
    };
  }

  return ENV;
};
