import Route from '@ember/routing/route';
import { service } from '@ember/service';
import {
  query,
  where,
  limit,
  orderBy,
} from 'ember-cloud-firestore-adapter/firebase/firestore';

export default class BaseIndexRoute extends Route {
  @service
  store;

  @service
  remoteConfig;

  @service
  router;

  beforeModel() {
    const live = this.remoteConfig.getBoolean('live');
    if (!live) {
      this.router.transitionTo('authenticated.construction');
    }
  }

  async model() {
    const magWestGameSessionUrn = this.remoteConfig.getString(
      'magwest_game_session_urn'
    );

    if (magWestGameSessionUrn) {
      const games = await this.store.query('tepache-game-session', {
        isRealtime: true,

        filter(reference) {
          return query(
            reference,
            where('urn', '==', magWestGameSessionUrn),
            orderBy('expiresAt', 'desc')
          );
        },
      });

      return games.firstObject;
    }
  }
}
