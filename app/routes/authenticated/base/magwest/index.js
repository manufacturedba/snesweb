import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class MagwestRoute extends Route {
  @service
  remoteConfig;

  @service
  store;

  async model() {
    const magwestUrn = await this.remoteConfig.getString('magwest_urn');

    // Looks for existing or grants new session
    return await this.store.query('tepache-player-session', {
      gameSessionUrn: magwestUrn,
    });
  }
}
