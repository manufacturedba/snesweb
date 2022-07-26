import EmberRouter from '@ember/routing/router';
import config from 'tepacheweb/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('base', { path: '/' }, function () {
    this.route('index', { path: '/' });
    this.route('about');
    this.route('magwest', function () {
      this.route('live');
    });
    this.route('games');
  });
  this.route('construction');
  // TODO - This treats 404 scenarios as valid.
  this.route('404', { path: '/*path' });
});
