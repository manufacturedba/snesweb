import Service, { service } from '@ember/service';
import {
  fetchAndActivate,
  getBoolean,
  getRemoteConfig,
  getString,
  getValue,
} from 'firebase/remote-config';
import config from 'tepacheweb/config/environment';

export default class RemoteConfigService extends Service {
  @service('-firebase')
  firebase;

  #remoteConfig;

  constructor() {
    super(...arguments);
    const remoteConfig = getRemoteConfig();

    remoteConfig.defaultConfig = config.APP.remoteConfig.defaultConfig;
    remoteConfig.settings.minimumFetchIntervalMillis =
      config.APP.remoteConfig.settings.minimumFetchIntervalMillis;

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

  getString(key) {
    return getString(this.#remoteConfig, key);
  }
}
