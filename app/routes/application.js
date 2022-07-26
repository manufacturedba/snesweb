import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { getAnalytics } from 'firebase/analytics';
import {
  getAuth,
  signInAnonymously,
} from 'ember-cloud-firestore-adapter/firebase/auth';
import { Promise } from 'rsvp';

export default class ApplicationRoute extends Route {
  @service
  remoteConfig;

  @service('-firebase')
  firebase;

  @service
  session;

  model() {
    return new Promise((resolve, reject) => {
      const auth = this.firebase.auth();

      const isNotAuthenticated = this.session.prohibitAuthentication(() =>
        resolve(auth.currentUser)
      );

      if (isNotAuthenticated) {
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
    getAnalytics();
    return this.remoteConfig.fetchAndActivate();
  }
}
