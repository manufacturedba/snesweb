import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { query, where } from 'ember-cloud-firestore-adapter/firebase/firestore';

export default class BaseGamesRoute extends Route {
  @service
  store;

  async model() {
    return await this.store.query('tepache-game', {
      isRealtime: true,

      filter(reference) {
        return query(reference, where('active', '==', true));
      },
    });
  }

  @action
  error(error) {
    console.error('Error in BaseGamesRoute', error);
  }
}
