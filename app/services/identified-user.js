import Service from '@ember/service';
import { service } from '@ember/service';

export default class IdentifiedUserService extends Service {
  @service
  session;

  get user() {
    const userImpl = this.session?.data?.authenticated?.user;

    if (!userImpl?.isAnonymous) {
      return userImpl;
    }

    return null;
  }
}
