import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { signInAnonymously } from 'ember-cloud-firestore-adapter/firebase/auth';
import { getAnalytics, setUserProperties } from 'firebase/analytics';

export default class AuthenticatedRoute extends Route {
  @service
  session;

  @service
  router;

  async model() {
    if (!this.session.isAuthenticated) {
      try {
        await this.session.authenticate('authenticator:firebase', (auth) =>
          signInAnonymously(auth)
        );
      } catch (e) {
        // Session service does not allow route configuration
        if (e?.message?.includes('The route index was not found')) {
          this.router.transitionTo('authenticated.base');
        }
      }
    } else {
      const analytics = getAnalytics();
      setUserProperties(analytics, {
        firebase_user_id:
          this.session?.data?.authenticated?.user?.uid || 'NO_UID',
      });
    }
  }

  // @action
  // error(error, transition) {
  //   // eslint-disable-next-line ember/no-controller-access-in-routes
  //   const controller = this.controllerFor('application');
  //   controller.set('error', error);
  //   transition.abort();
  // }
}
