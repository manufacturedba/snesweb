import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { getAnalytics, logEvent } from 'firebase/analytics';
import config from 'tepacheweb/config/environment';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

export default class ApplicationRoute extends Route {
  @service
  session;

  @service
  router;

  @service
  errorAlert;

  @service
  remoteConfig;

  async model() {
    const analytics = getAnalytics();

    if (config.storage?.emulator) {
      const host = config.storage.emulator.host;
      const port = config.storage.emulator.port;
      connectStorageEmulator(getStorage(), host, port);
    }

    logEvent(analytics, 'app_start');
  }

  @action
  error(error) {
    console.error(error);
    this.errorAlert.set('Unrecoverable error has occurred');

    if (config.redirectAfterError) {
      this.router.replaceWith('authenticated.construction');
    }
  }
}
