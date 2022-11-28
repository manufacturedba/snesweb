import Route from '@ember/routing/route';
import { service } from '@ember/service';
import {
  limit,
  orderBy,
  query,
  where,
} from 'ember-cloud-firestore-adapter/firebase/firestore';
import { hash } from 'rsvp';

export default class AuthenticatedBasePlayLiveRoute extends Route {
  @service
  remoteConfig;

  @service
  store;

  @service
  router;

  async model() {
    let { gameSession, playerSession } =
      this.modelFor('authenticated.base.play') || {};

    if (!gameSession || gameSession.expiresAt < new Date()) {
      return this.router.transitionTo('authenticated.base');
    }

    if (!playerSession || !playerSession.name) {
      return this.router.transitionTo('authenticated.base.play');
    }

    const gameRequest = this.store.findRecord(
      'tepache-game',
      gameSession.gameId,
      {
        adapterOptions: {
          isRealTime: true,
        },
      }
    );

    const game = await gameRequest;

    return hash({
      game,
      playerSession,
      gameSession,
    });
  }
}
