import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { query, where } from 'ember-cloud-firestore-adapter/firebase/firestore';
import { action } from '@ember/object';
import config from 'tepacheweb/config/environment';

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
    this.session.requireAuthentication(
      transition,
      'authenticated.construction'
    );
  }

  async model() {
    return this.store.query('tepache-game', {
      adapterOptions: {
        isRealtime: true,

        filter(reference) {
          return query(reference, where('active', '==', true));
        },
      },
    });
  }

  @action
  error(error) {
    console.error(error);
    this.errorAlert.set('Unrecoverable error has occurred');

    if (config.redirectAfterError) {
      this.router.replaceWith('authenticated.construction');
    }
  }
}
