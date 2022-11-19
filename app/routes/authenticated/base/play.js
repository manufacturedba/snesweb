import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { hash } from 'rsvp';
import {
  query,
  where,
  limit,
} from 'ember-cloud-firestore-adapter/firebase/firestore';

export default class BasePlayRoute extends Route {
  @service
  store;

  @service
  router;

  @service
  identifiedUser;

  async model() {
    const { gameSessions } = this.modelFor('authenticated.base');
    const gameSession = gameSessions.firstObject;
    const uid = this.identifiedUser.uid;
    const playerSessions = await this.store.query('tepache-player-session', {
      filter(reference) {
        return query(
          reference,
          where('gameSessionUrn', '==', gameSession.urn),
          where('uid', '==', uid),
          limit(1)
        );
      },
    });

    let playerSession = playerSessions.firstObject;

    if (!gameSession) {
      return this.router.transitionTo('authenticated.base');
    }

    if (!playerSession) {
      playerSession = this.store.createRecord('tepache-player-session', {
        gameSessionUrn: gameSession.urn,
      });
    }

    return hash({
      playerSession,
      gameSession,
    });
  }
}
