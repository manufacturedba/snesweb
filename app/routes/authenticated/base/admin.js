import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AuthenticatedBaseAdminRoute extends Route {
  @service
  router;

  @service
  identifiedUser;

  beforeModel() {
    if (!this.identifiedUser.isAdmin) {
      this.router.transitionTo('login');
    }
  }
}
