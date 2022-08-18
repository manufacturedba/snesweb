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
    const { gameSession, playerSession } = this.modelFor(
      'authenticated.base.magwest'
    );

    if (!gameSession) {
      return this.router.transitionTo('authenticated.base');
    }

    return hash({
      playerSession,
      gameSession,
    });
  }
}
