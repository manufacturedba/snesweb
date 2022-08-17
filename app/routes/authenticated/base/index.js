import Route from '@ember/routing/route';
import { service } from '@ember/service';
import {
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'ember-cloud-firestore-adapter/firebase/firestore';

export default class BaseIndexRoute extends Route {
  @service
  store;

  @service
  remoteConfig;

  @service
  router;

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
            where('expiresAt', '>', new Date()),
            orderBy('expiresAt', 'desc')
          );
        },
      });

      return games.firstObject;
    }
  }
}
