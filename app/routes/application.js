import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { getAnalytics } from 'firebase/analytics';
import { action } from '@ember/object';

export default class ApplicationRoute extends Route {
  @service
  remoteConfig;

  @service
  session;

  async model() {
    getAnalytics();
    await this.remoteConfig.fetchAndActivate();
    return await this.session.setup();
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
}
