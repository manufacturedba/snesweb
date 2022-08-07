import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { query, where } from 'ember-cloud-firestore-adapter/firebase/firestore';

export default class BaseRoute extends Route {
  @service
  router;

  @service
  session;

  @service
  store;

  @service
  errorAlert;

  beforeModel(transition) {
    const live = this.remoteConfig.getBoolean('live');

    if (!live) {
      this.router.transitionTo('authenticated.construction');
    }

    this.session.requireAuthentication(
      transition,
      'authenticated.construction'
    );
  }

  async model() {
    return this.store.query('tepache-game', {
      isRealtime: true,

      filter(reference) {
        return query(reference, where('active', '==', true));
      },
    });
  }
}
