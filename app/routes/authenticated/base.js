import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { query, where } from 'ember-cloud-firestore-adapter/firebase/firestore';
import { action } from '@ember/object';

export default class BaseRoute extends Route {
  @service
  router;

  @service
  remoteConfig;

  @service
  session;

  beforeModel(transition) {
    this.session.requireAuthentication(
      transition,
      'authenticated.construction'
    );
  }

  async model() {
    return this.store.query('tepache-game', {
      adapterOptions: {
        isRealtime: true,
      },

      filter(reference) {
        return query(reference, where('active', '==', true));
      },
    });
  }

  @action
  error() {
    this.router.replaceWith('authenticated.construction');
  }
}
