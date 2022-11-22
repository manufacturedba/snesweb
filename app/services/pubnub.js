import Service from '@ember/service';
import PubNub from 'pubnub';
import { service } from '@ember/service';
import { getRemoteConfig, getValue } from 'firebase/remote-config';

export default class PubnubService extends Service {
  @service('-firebase')
  firebase;

  #instance;

  constructor() {
    super(...arguments);
  }

  get pubNubConfig() {
    const pubNubConfigJSON = getValue(
      getRemoteConfig(this.firebase),
      'pubnub_config'
    ).asString();

    return JSON.parse(pubNubConfigJSON);
  }

  setUserId(userId) {
    this.#instance = new PubNub({
      ...this.pubNubConfig,
      userId,
    });
  }

  publish(option) {
    return this.#instance.publish(option);
  }

  subscribe(option) {
    return this.#instance.subscribe(option);
  }

  unsubscribeAll() {
    return this.#instance.unsubscribeAll();
  }

  addListener(option) {
    return this.#instance.addListener(option);
  }

  hereNow(option, callback) {
    return this.#instance.hereNow(option, callback);
  }

  fetchMessages(option) {
    return this.#instance.fetchMessages(option);
  }
}
