import EmberRouter from '@ember/routing/router';
import config from 'tepacheweb/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  if (config.liveMode) {
    this.route('main', { path: '/' });
  } else {
    this.route('construction', { path: '/' });
  }
});
