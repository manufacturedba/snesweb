import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { signInAnonymously } from 'ember-cloud-firestore-adapter/firebase/auth';
import { action } from '@ember/object';
export default class AuthenticatedRoute extends Route {
  @service
  session;

  async beforeModel() {
    if (!this.session.isAuthenticated) {
      return await this.session.authenticate('authenticator:firebase', (auth) =>
        signInAnonymously(auth)
      );
    }
  }
}
