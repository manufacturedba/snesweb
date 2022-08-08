import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { getAnalytics, setUserId, logEvent } from 'firebase/analytics';
import config from 'tepacheweb/config/environment';

export default class ApplicationRoute extends Route {
  @service
  session;

  @service
  router;

  @service
  errorAlert;

  async beforeModel() {
    const analytics = getAnalytics();
    await this.session.setup();

    if (this.session.isAuthenticated) {
      setUserId(
        analytics,
        this.session?.data?.authenticated?.user?.uid || 'NO_UID'
      );
    } else {
      setUserId(analytics, '');
    }

    logEvent(analytics, 'app_start');
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
