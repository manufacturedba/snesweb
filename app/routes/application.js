import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { action } from '@ember/object';
import {
  getAnalytics,
  setAnalyticsCollectionEnabled,
} from 'firebase/analytics';
import config from 'tepacheweb/config/environment';

export default class ApplicationRoute extends Route {
  @service
  remoteConfig;

  @service
  session;

  @service
  router;

  @service
  errorAlert;

  async beforeModel() {
    setAnalyticsCollectionEnabled(getAnalytics(), true);
    await this.session.setup();
    return await this.remoteConfig.fetchAndActivate();
  }

  @action
  loading(transition) {
    // eslint-disable-next-line ember/no-controller-access-in-routes
    const controller = this.controllerFor('application');
    controller.set('loading', true);
    transition.promise.finally(() => {
      controller.set('loading', false);
    });
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
