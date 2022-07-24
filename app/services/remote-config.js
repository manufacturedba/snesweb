import Service from '@ember/service';
import { service } from '@ember/service';
import {
  getRemoteConfig,
  getValue,
  getBoolean,
  fetchAndActivate,
} from 'firebase/remote-config';
import config from 'tepacheweb/config/environment';

export default class RemoteConfigService extends Service {
  @service('-firebase')
  firebase;

  #remoteConfig;

  constructor() {
    super(...arguments);
    const remoteConfig = getRemoteConfig();

    remoteConfig.defaultConfig = config.APP.remoteConfig;
    remoteConfig.settings.minimumFetchIntervalMillis = 3600000; // 1 hour

    fetchAndActivate(remoteConfig);
    this.#remoteConfig = remoteConfig;
  }

  async fetchAndActivate() {
    return await fetchAndActivate(this.#remoteConfig);
  }

  getValue(key) {
    return getValue(this.#remoteConfig, key);
  }

  getBoolean(key) {
    return getBoolean(this.#remoteConfig, key);
  }
}
