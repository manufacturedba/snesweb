import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { signInAnonymously } from 'ember-cloud-firestore-adapter/firebase/auth';
import { getAnalytics, logEvent } from 'firebase/analytics';

export default class AuthenticatedRoute extends Route {
  @service
  session;

  @service
  router;

  @service
  remoteConfig;

  async beforeModel() {
    if (!this.session.isAuthenticated) {
      try {
        await this.session.authenticate('authenticator:firebase', (auth) =>
          signInAnonymously(auth)
        );
      } catch (e) {
        // Session service does not allow route configuration
        if (e?.message?.includes('The route index was not found')) {
          this.router.transitionTo('authenticated.base.index');
        }
      }
    }
  }

  async afterModel() {
    const analytics = getAnalytics();
    await this.remoteConfig.fetchAndActivate();
    logEvent(analytics, 'config_fetched');
  }
}
