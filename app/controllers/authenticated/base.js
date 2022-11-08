import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { getAnalytics, setUserId } from 'firebase/analytics';

export default class BaseController extends Controller {
  @service
  session;

  @service
  router;

  @service
  identifiedUser;

  @action
  async invalidateSession() {
    try {
      await this.session.invalidate();

      const analytics = getAnalytics();

      setUserId(analytics, null);

      this.router.transitionTo('authenticated.base.index');
    } catch (e) {
      console.error(e);
    }
  }

  get showFooter() {
    return this.router.currentRouteName !== 'authenticated.base.play.live';
  }
}
