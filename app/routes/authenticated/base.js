import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { hash } from 'rsvp';

export default class BaseRoute extends Route {
  @service
  router;

  @service
  session;

  @service
  store;

  @service
  remoteConfig;

  @service
  identifiedUser;

  async model() {
    const analytics = getAnalytics();
    const activated = await this.remoteConfig.fetchAndActivate();

    logEvent(analytics, 'config_fetched', {
      activated,
    });

    if (this.session?.data?.authenticated?.user) {
      await this.identifiedUser.fetchRole(
        this.session.data.authenticated.user.uid
      );
    }

    // Look for any game sessions running for the selected game
    // Status does not matter here
    const gameSessionId = this.remoteConfig.getString('game_session_id');

    let gameSession;
    let game;

    if (gameSessionId) {
      gameSession = await this.store.findRecord(
        'tepache-game-session',
        gameSessionId,
        {
          adapterOptions: {
            isRealTime: true,
          },
        }
      );

      if (gameSession) {
        const gameId = gameSession.gameId;

        game = await this.store.findRecord('tepache-game', gameId, {
          adapterOptions: {
            isRealTime: true,
          },
        });
      }
    }

    return hash({
      game,
      gameSession,
    });
  }
}
