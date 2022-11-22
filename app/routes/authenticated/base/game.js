import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class BaseGameRoute extends Route {
  @service
  store;

  async model(params) {
    return await this.store.findRecord('tepache-game', params.game_urn);
  }
}
