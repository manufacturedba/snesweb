import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AuthenticatedBaseAdminGameSessionRoute extends Route {
  @service
  store;

  model(params) {
    return this.store.findRecord(
      'tepache-game-session',
      params.game_session_id
    );
  }
}
