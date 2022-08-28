import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { hash } from 'rsvp';

/**
 * This route is used to display the main landing page for the site
 */
export default class BaseMagwestRoute extends Route {
  @service
  store;

  @service
  remoteConfig;

  @service
  router;

  async model() {
    const { gameSessions } = this.modelFor('authenticated.base');
    const gameSession = gameSessions.firstObject;

    if (!gameSession) {
      return this.router.transitionTo('authenticated.base');
    }

    const playerSessions = await this.store.query('tepache-player-session', {
      gameSessionUrn: gameSession.urn,
    });

    return hash({
      playerSession: playerSessions.firstObject,
      gameSession,
    });
  }
}
