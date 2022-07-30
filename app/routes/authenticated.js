import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { signInAnonymously } from 'ember-cloud-firestore-adapter/firebase/auth';
import { action } from '@ember/object';

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
        if (e?.message?.includes('The route index was not found')) {
          this.router.transitionTo('authenticated.base');
        }
      }
    }
  }

  @action
  error(error, transition) {
    // eslint-disable-next-line ember/no-controller-access-in-routes
    debugger;
    const controller = this.controllerFor('application');
    controller.set('error', error);
    transition.abort();
  }
}
