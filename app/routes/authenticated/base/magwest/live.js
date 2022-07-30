import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class MagwestLiveRoute extends Route {
  @service
  remoteConfig;

  model() {
    return JSON.parse(this.remoteConfig.getString('ovenplayer_config'));
  }
}
