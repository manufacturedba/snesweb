import Route from '@ember/routing/route';
import { service } from '@ember/service';
import {
  limit,
  query,
  where,
} from 'ember-cloud-firestore-adapter/firebase/firestore';
import { orderBy } from 'ember-cloud-firestore-adapter/firebase/firestore';
import { hash } from 'rsvp';

export default class AuthenticatedBaseAdminIndexRoute extends Route {
  @service
  store;

  @service
  remoteConfig;

  @service
  identifiedUser;

  async model() {
    // Look for any game sessions running for the selected game
    // Status does not matter here
    const gameSessionUrn = this.remoteConfig.getString('game_session_urn');

    if (gameSessionUrn) {
      const gameSessions = await this.store.query('tepache-game-session', {
        isRealTime: true,

        filter(reference) {
          return query(
            reference,
            where('urn', '==', gameSessionUrn),
            orderBy('expiresAt', 'desc'),
            limit(1)
          );
        },
      });

      const gameSession = gameSessions.firstObject;
      const gameUrn = gameSession.gameUrn;

      const playerSessions = await this.store.query('tepache-player-session', {
        gameSessionUrn: gameSession.urn,
      });

      const games = await this.store.query('tepache-game', {
        filter(reference) {
          return query(reference, where('urn', '==', gameUrn), limit(1));
        },
      });

      return hash({
        game: games.firstObject,
        gameSession: gameSession,
        playerSessions,
        identifiedUser: this.identifiedUser,
      });
    }
  }
}
