import Route from '@ember/routing/route';
import { service } from '@ember/service';
import {
  query,
  where,
  limit,
  orderBy,
} from 'ember-cloud-firestore-adapter/firebase/firestore';

export default class MagwestRoute extends Route {
  @service
  remoteConfig;

  @service
  store;

  async model() {
    const magWestGameSessionUrn = await this.remoteConfig.getString(
      'magwest_game_session_urn'
    );

    const gameSessions = await this.store.query('tepache-game-session', {
      isRealtime: true,

      filter(reference) {
        return query(
          reference,
          where('urn', '==', magWestGameSessionUrn),
          orderBy('expiresAt', 'desc'),
          limit(1)
        );
      },
    });
    return gameSessions.firstObject;
  }
}
