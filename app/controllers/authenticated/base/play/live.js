import Controller from '@ember/controller';
import { service } from '@ember/service';

export default class AuthenticatedBasePlayLiveController extends Controller {
  @service
  remoteConfig;

  get enableChatV2() {
    return true || this.remoteConfig.getBoolean('enable_chat_v2');
  }
}
