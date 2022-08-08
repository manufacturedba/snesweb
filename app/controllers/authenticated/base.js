import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { setUserId, getAnalytics } from 'firebase/analytics';

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
      setUserId(analytics, 'unauthenticated');
      this.router.transitionTo('authenticated.index');
    } catch (e) {
      console.error(e);
    }
  }
}
