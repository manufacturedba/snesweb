import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AuthenticatedBaseAdminGameSessionNewRoute extends Route {
  @service
  store;

  model() {
    const gameSessionModel = this.store.createRecord('tepache-game-session');

    return gameSessionModel;
  }
}
