import Route from '@ember/routing/route';
import { service } from '@ember/service';
import {
  limit,
  query,
  where,
} from 'ember-cloud-firestore-adapter/firebase/firestore';
import { orderBy } from 'ember-cloud-firestore-adapter/firebase/firestore';
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

  async beforeModel(transition) {
    const analytics = getAnalytics();
    const activated = await this.remoteConfig.fetchAndActivate();

    logEvent(analytics, 'config_fetched', {
      activated,
    });

    const live = this.remoteConfig.getBoolean('live');

    if (!live) {
      this.router.transitionTo('authenticated.construction');
    }

    this.session.requireAuthentication(
      transition,
      'authenticated.construction'
    );

    if (this.session?.data?.authenticated?.user) {
      await this.identifiedUser.fetchRole(
        this.session.data.authenticated.user.uid
      );
    }
  }

  async model() {
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
