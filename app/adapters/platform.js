import JSONAPIAdapter from '@ember-data/adapter/json-api';
import { service } from '@ember/service';
import config from 'tepacheweb/config/environment';

export default class PlatformAdapter extends JSONAPIAdapter {
  @service
  session;

  host = config['platform-adapter'].host;
  namespace = 'api';

  get headers() {
    return {
      Authorization: `${this.session?.data?.authenticated?.user?.accessToken}`,
    };
  }
}
