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
    const gameSessionModel = this.modelFor('authenticated.base.index');

    if (!gameSessionModel) {
      return this.router.transitionTo('authenticated.base.index');
    }

    const magWestGameSessionUrn = await this.remoteConfig.getString(
      'magwest_game_session_urn'
    );

    const playerSessions = await this.store.query('tepache-player-session', {
      gameSessionUrn: magWestGameSessionUrn,
    });

    return hash({
      playerSession: playerSessions.firstObject,
      gameSession: this.modelFor('authenticated.base.index'),
    });
  }
}
