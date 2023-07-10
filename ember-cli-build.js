const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const path = require('path');

module.exports = function emberCLIBuild(defaults) {
  let app = new EmberApp(defaults, {
    'ember-bootstrap': {
      bootstrapVersion: 5,
      importBootstrapCSS: false,
    },
    'ember-simple-auth': {
      useSessionSetupMethod: true,
    },
    sassOptions: {
      includePaths: [
        'node_modules/bootstrap-icons/font',
        'node_modules/bootstrap/scss',
      ],
    },
    svg: {
      optimize: false,
    },
  });

  app.import('node_modules/ovenplayer/dist/ovenplayer.js');
  app.import('node_modules/pubnub/dist/web/pubnub.js');

  app.import('node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff', {
    destDir: 'assets/fonts',
  });
  app.import('node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff2', {
    destDir: 'assets/fonts',
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.
  const { Webpack } = require('@embroider/webpack');

  return require('@embroider/compat').compatBuild(app, Webpack, {
    staticAddonTestSupportTrees: true,
    staticAddonTrees: true,
    staticHelpers: true,
    staticModifiers: true,
    staticComponents: true,
    splitAtRoutes: [/authenticated.base.*/],
    staticAppPaths: ['svgs.js'],
    packagerOptions: {
      webpackConfig: {},
    },
  });
};
