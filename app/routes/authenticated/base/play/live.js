import Route from '@ember/routing/route';
import { service } from '@ember/service';
import {
  limit,
  orderBy,
  query,
  where,
} from 'ember-cloud-firestore-adapter/firebase/firestore';
import { hash } from 'rsvp';

export default class BasePlayLiveRoute extends Route {
  @service
  remoteConfig;

  @service
  store;

  @service
  router;

  async model() {
    const enableChatV2 = await this.remoteConfig.get('enable_chat_v2');

    let { gameSession, playerSession } =
      this.modelFor('authenticated.base.play') || {};

    if (!gameSession || gameSession.expiresAt < new Date()) {
      return this.router.transitionTo('authenticated.base');
    }

    if (!playerSession) {
      return this.router.transitionTo('authenticated.base.play');
    }

    const today = new Date();
    const lastMinute = new Date(today.getTime() - 1000 * 60);
    const lastHour = new Date(today.getTime() - 1000 * 60 * 60);

    const gameRequest = this.store.findRecord(
      'tepache-game',
      gameSession.gameId,
      {
        adapterOptions: {
          isRealTime: true,
        },
      }
    );

    if (enableChatV2) {
      const game = await gameRequest;

      return hash({
        game,
        playerSession,
        gameSession,
      });
    } else {
      const hardwareInputRequest = this.store.query('tepache-hardware-input', {
        isRealtime: true,

        filter(reference) {
          return query(
            reference,
            where('gameSessionId', '==', gameSession.id),
            where('createdAt', '>', lastMinute),
            orderBy('createdAt', 'desc'),
            limit(4)
          );
        },
      });

      const logRequest = this.store.query('tepache-log', {
        isRealtime: true,

        filter(reference) {
          return query(reference, orderBy('createdAt', 'desc'), limit(100));
        },
      });

      const sessionCaptureRequest = this.store.query(
        'tepache-session-capture',
        {
          isRealtime: true,

          filter(reference) {
            return query(
              reference,
              where('playerSessionId', '==', playerSession.id),
              where('createdAt', '>', lastHour),
              orderBy('createdAt', 'desc'),
              limit(2)
            );
          },
        }
      );

      const hardwareInput = await hardwareInputRequest;
      const sessionCapture = await sessionCaptureRequest;
      const game = await gameRequest;
      const log = await logRequest;

      return hash({
        game,
        playerSession,
        gameSession,
        hardwareInput,
        log,
        sessionCapture,
      });
    }
  }
}
