'use strict';

module.exports = {
  name: require('./package').name,

  isDevelopingAddon() {
    return true;
  },

  included(app, parentAddon) {
    let target = parentAddon || app;
    target.options = target.options || {};
    target.options.babel = target.options.babel || { includePolyfill: true };

    const missingOvenPlayer =
      app && !app.registry.availablePlugins['ovenplayer'];

    if (missingOvenPlayer) {
      throw new Error('Must include ovenplayer as dependency');
    }

    app.import('node_modules/ovenplayer/dist/ovenplayer.js', {
      using: [{ transformation: 'amd', as: 'ovenplayer' }],
    });

    return this._super.included.apply(this, arguments);
  },
};
