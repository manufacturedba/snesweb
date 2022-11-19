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
    const gameSessionUrn = this.remoteConfig.getString('game_session_urn');

    let gameSessions;
    let games;

    if (gameSessionUrn) {
      gameSessions = await this.store.query('tepache-game-session', {
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

      if (gameSessions.firstObject) {
        const gameUrn = gameSessions.firstObject.gameUrn;

        games = await this.store.query('tepache-game', {
          filter(reference) {
            return query(reference, where('urn', '==', gameUrn), limit(1));
          },
        });
      }
    }

    return hash({
      games,
      gameSessions,
    });
  }
}
