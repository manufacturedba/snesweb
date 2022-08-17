import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { hash } from 'rsvp';

export default class MagwestRoute extends Route {
  @service
  remoteConfig;

  @service
  store;

  @service
  router;

  async model() {
    const gameSession = this.modelFor('authenticated.base.index');

    if (!gameSession) {
      return this.router.transitionTo('authenticated.base.index');
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
