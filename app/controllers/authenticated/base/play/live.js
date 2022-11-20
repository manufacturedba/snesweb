import Controller from '@ember/controller';
import { service } from '@ember/service';

export default class AuthenticatedBasePlayLiveController extends Controller {
  @service
  remoteConfig;

  get enableChatV2() {
    return this.remoteConfig.get('enable_chat_v2');
  }
}
