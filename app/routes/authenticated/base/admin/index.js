import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { query, where } from 'ember-cloud-firestore-adapter/firebase/firestore';
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
    const gameSessionId = this.remoteConfig.getString('game_session_id');

    if (gameSessionId) {
      const gameSession = await this.store.findRecord(
        'tepache-game-session',
        gameSessionId,
        {
          adapterOptions: {
            isRealTime: true,
          },
        }
      );

      const gameId = gameSession.gameId;

      const playerSessions = await this.store.query('tepache-player-session', {
        filter(reference) {
          return query(reference, where('gameSessionId', '==', gameSession.id));
        },
      });

      const game = await this.store.query('tepache-game', gameId, {
        adapterOptions: {
          isRealTime: true,
        },
      });

      return hash({
        game: game,
        gameSession: gameSession,
        playerSessions,
        identifiedUser: this.identifiedUser,
      });
    }
  }
}
