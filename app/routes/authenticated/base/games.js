import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { query, where } from 'ember-cloud-firestore-adapter/firebase/firestore';

export default class BaseGamesRoute extends Route {
  @service
  store;

  model() {
    return this.store.query('tepache-game', {
      adapterOptions: {
        isRealtime: true,

        filter(reference) {
          return query(reference, where('active', '==', true));
        },
      },
    });
  }
}
