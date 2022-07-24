import Route from '@ember/routing/route';
import { service } from '@ember/service';
import {
  getAuth,
  signInAnonymously,
} from 'ember-cloud-firestore-adapter/firebase/auth';
import { Promise } from 'rsvp';

export default class BaseRoute extends Route {
  @service
  store;

  @service
  router;

  @service
  session;

  @service
  remoteConfig;

  model() {
    return new Promise((resolve, reject) => {
      const auth = getAuth();

      const isNotAuthenticated = this.session.prohibitAuthentication(() =>
        resolve(auth.currentUser)
      );

      if (isNotAuthenticated) {
        const auth = getAuth();
        return signInAnonymously(auth)
          .then(() => resolve(auth.currentUser))
          .catch((error) => {
            const { code: errorCode } = error;

            if (errorCode === 'auth/operation-not-allowed') {
              reject('You must enable Anonymous auth in the Firebase Console.');
            } else {
              reject(error);
            }
          });
      }
    });
  }

  beforeModel() {
    const live = this.remoteConfig.getBoolean('live');

    if (!live) {
      this.router.transitionTo('construction');
    }
  }
}
