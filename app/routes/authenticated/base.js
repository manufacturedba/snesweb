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
    await this.remoteConfig.fetchAndActivate();
    logEvent(analytics, 'config_fetched');

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
    const magWestGameSessionUrn = this.remoteConfig.getString(
      'magwest_game_session_urn'
    );

    if (magWestGameSessionUrn) {
      const games = await this.store.query('tepache-game-session', {
        isRealtime: true,

        filter(reference) {
          return query(
            reference,
            where('urn', '==', magWestGameSessionUrn),
            orderBy('expiresAt', 'desc')
          );
        },
      });

      return games.firstObject;
    }
  }
}
