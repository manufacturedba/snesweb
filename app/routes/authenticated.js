import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { signInAnonymously } from 'ember-cloud-firestore-adapter/firebase/auth';
import { setUserId, getAnalytics, logEvent } from 'firebase/analytics';

export default class AuthenticatedRoute extends Route {
  @service
  session;

  @service
  router;

  @service
  remoteConfig;

  async model() {
    const analytics = getAnalytics();

    await this.session.setup();

    logEvent(analytics, 'authentication_start');

    if (this.session.isAuthenticated) {
      setUserId(analytics, this.session?.data?.authenticated?.user?.uid);
    } else {
      try {
        setUserId(analytics, null);
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
}
