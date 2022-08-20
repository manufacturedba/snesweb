import Route from '@ember/routing/route';
import { service } from '@ember/service';
import {
  query,
  where,
  limit,
} from 'ember-cloud-firestore-adapter/firebase/firestore';

export default class BaseGameRoute extends Route {
  @service
  store;

  async model(params) {
    const games = await this.store.query('tepache-game', {
      isRealtime: true,

      filter(reference) {
        return query(
          reference,
          where('active', '==', true),
          where('urn', '==', params.game_urn),
          limit(1)
        );
      },
    });

    return games.firstObject;
  }
}
