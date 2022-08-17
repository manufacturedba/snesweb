import Route from '@ember/routing/route';
import { service } from '@ember/service';
import {
  query,
  where,
  orderBy,
} from 'ember-cloud-firestore-adapter/firebase/firestore';

/**
 * This route is used to display the main landing page for the site
 */
export default class BaseIndexRoute extends Route {
  @service
  store;

  @service
  remoteConfig;

  @service
  router;

  async model() {
    // Look for any game sessions running for the selected game
    // Status does not matter here
    const magWestGameUrn = this.remoteConfig.getString('magwest_game_urn');

    if (magWestGameUrn) {
      const games = await this.store.query('tepache-game-session', {
        isRealtime: true,

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
