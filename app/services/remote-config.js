import Service, { service } from '@ember/service';
import {
  fetchAndActivate,
  getBoolean,
  getRemoteConfig,
  getString,
  getValue,
  activate,
  fetchConfig,
} from 'firebase/remote-config';
import config from 'tepacheweb/config/environment';

export default class RemoteConfigService extends Service {
  @service('-firebase')
  firebase;

  #remoteConfig;

  constructor() {
    super(...arguments);

    this.#remoteConfig = getRemoteConfig(this.firebase);

    this.#remoteConfig.defaultConfig = {
      ...config.APP.remoteConfig.defaultConfig,
    };

    this.#remoteConfig.settings.minimumFetchIntervalMillis =
      config.APP.remoteConfig.settings.minimumFetchIntervalMillis;
  }

  async fetchAndActivate() {
    return await fetchAndActivate(this.#remoteConfig);
  }

  async activate() {
    return await activate(this.#remoteConfig);
  }

  async fetchConfig() {
    return await fetchConfig(this.#remoteConfig);
  }

  async ensureInitialized() {
    return await this.#remoteConfig.ensureInitialized();
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
