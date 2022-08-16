import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { hash } from 'rsvp';

export default class MagwestLiveRoute extends Route {
  @service
  remoteConfig;

  async model() {
    const gameSession = this.modelFor('authenticated.base');
    const playerSession = this.modelFor('authenticated.base.magwest');

    const ovenPlayerConfigJSON = await this.remoteConfig.getString(
      'ovenplayer_config'
    );

    const ovenPlayerConfig = JSON.parse(ovenPlayerConfigJSON);

    return hash({
      playerSession,
      gameSession,
      ovenPlayerConfig,
    });
  }
}
