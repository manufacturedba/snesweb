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
    const { gameSession } = this.modelFor('authenticated.base');
    const uid = this.identifiedUser.uid;
    const playerSessions = await this.store.query('tepache-player-session', {
      filter(reference) {
        return query(
          reference,
          where('gameSessionId', '==', gameSession.id),
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
        gameSessionId: gameSession.id,
        uid,
      });
    }

    return hash({
      playerSession,
      gameSession,
    });
  }
}
