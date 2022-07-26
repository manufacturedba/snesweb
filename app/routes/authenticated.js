import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { signInAnonymously } from 'ember-cloud-firestore-adapter/firebase/auth';

export default class AuthenticatedRoute extends Route {
  @service
  session;

  async beforeModel() {
    if (!this.session.isAuthenticated) {
      this.session.authenticate('authenticator:firebase', (auth) =>
        signInAnonymously(auth)
      );
    }
  }
}
