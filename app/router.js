import EmberRouter from '@embroider/router';
import config from 'tepacheweb/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
  routeAfterAuthentication = config.routeAfterAuthentication;
}

Router.map(function () {
  this.route('authenticated', { path: '/' }, function () {
    this.route('base', { path: '/' }, function () {
      this.route('index', { path: '/' });
      this.route('about');
      this.route('play', function () {
        this.route('live');
      });
      this.route('games');
      this.route('game', { path: '/games/:game_urn' });

      this.route('credit');
      this.route('privacy');
      this.route('terms');
      this.route('admin', function () {
        this.route('reports');
        this.route('game-sessions');
        this.route('game-session', { path: '/game-sessions/:game_session_id' });
        this.route('game-session-new', { path: '/game-sessions/new' });
      });
      this.route('cookie-policy');
    });
    // TODO - This treats 404 scenarios as valid.
    this.route('404', { path: '/*path' });
  });
  this.route('login');
});
