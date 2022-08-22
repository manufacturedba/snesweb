import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { query, where } from 'ember-cloud-firestore-adapter/firebase/firestore';
import { orderBy } from 'ember-cloud-firestore-adapter/firebase/firestore';
import { getAnalytics, logEvent } from 'firebase/analytics';

export default class BaseRoute extends Route {
  @service
  router;

  @service
  session;

  @service
  store;

  @service
  errorAlert;

  @service
  remoteConfig;

  async beforeModel(transition) {
    const analytics = getAnalytics();
    const activated = await this.remoteConfig.activate();
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
  }

  async model() {
    // Look for any game sessions running for the selected game
    // Status does not matter here
    const magWestGameUrn = this.remoteConfig.getString('magwest_game_urn');

    if (magWestGameUrn) {
      const games = await this.store.query('tepache-game-session', {
        filter(reference) {
          return query(
            reference,
            where('gameUrn', '==', magWestGameUrn),
            where('expiresAt', '>', new Date()),
            orderBy('expiresAt', 'desc')
          );
        },
      });

      return games.firstObject;
    }
  }
}
