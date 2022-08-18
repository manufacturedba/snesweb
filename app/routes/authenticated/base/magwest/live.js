import Route from '@ember/routing/route';
import { service } from '@ember/service';
import {
  limit,
  orderBy,
  query,
  where,
} from 'ember-cloud-firestore-adapter/firebase/firestore';
import { hash } from 'rsvp';

export default class MagwestLiveRoute extends Route {
  @service
  remoteConfig;

  @service
  store;

  @service
  router;

  async model() {
    const { gameSession } = this.modelFor('authenticated.base.magwest');

    const playerSession = await this.store.query('tepache-player-session', {
      gameSessionUrn: gameSession.urn,
    }).firstObject;

    if (!playerSession) {
      return this.router.transitionTo('authenticated.base.magwest');
    }

    if (!gameSession) {
      return this.router.transitionTo('authenticated.base');
    }

    const hardwareInput = this.store.query('tepache-hardware-input', {
      isRealtime: true,

      filter(reference) {
        return query(
          reference,
          where('gameSessionUrn', '==', gameSession.urn),
          orderBy('createdAt', 'desc'),
          limit(10)
        );
      },
    });

    return hash({
      playerSession,
      gameSession,
      hardwareInput,
    });
  }
}
