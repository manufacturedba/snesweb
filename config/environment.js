'use strict';

const remoteConfig = require('../remote_config.json');

module.exports = function (environment) {
  let ENV = {
    redirectAfterError: false, // prevent redirect after error
    routeAfterAuthentication: 'authenticated.base',
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
        authDomain: 'auth.tepachemode.com',
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

    // Configuration for requests
    'platform-adapter': {
      host: 'http://localhost:7676',
    },

    'hapi-nes': {
      host: 'ws://localhost:7676',
    },

    storage: {
      emulator: {
        host: 'localhost',
        port: 9199,
      },
    },

    APP: {
      remoteConfig: {
        defaultConfig: remoteConfig,
        settings: {
          minimumFetchIntervalMillis: 15000, // 15 seconds
        },
      },
    },
  };

  if (environment === 'development') {
    ENV['ember-cloud-firestore-adapter']['firebaseConfig'] = {
      apiKey: 'AIzaSyB4qE0_mYuHrpuE0AxhqhpEqd0uJGC4nYE',
      authDomain: 'tepache-mode-dev.firebaseapp.com',
      projectId: 'tepache-mode-dev',
      storageBucket: 'tepache-mode-dev.appspot.com',
      messagingSenderId: '909423050243',
      appId: '1:909423050243:web:ef1f0c441ecc10e00a9836',
      measurementId: 'G-ZE99WSEPPE',
    };

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
    ENV['platform-adapter'].host = process.env.API_PLATFORM_HOST;
    ENV['hapi-nes'].host = process.env.API_HAPI_NES_HOST;
    ENV['storage'].emulator = null;

    ENV.APP.remoteConfig.settings.minimumFetchIntervalMillis = 3600000; // 1 hour

    ENV.redirectAfterError = true;
  }

  return ENV;
};
