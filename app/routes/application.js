import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class ApplicationRoute extends Route {
  @service
  remoteConfig;

  @service
  session;

  async beforeModel() {
    return await this.session.setup();
  }

  async afterModel() {
    await this.remoteConfig.fetchAndActivate();
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
