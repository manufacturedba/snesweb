import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class AuthenticatedBaseAdminGameSessionNewController extends Controller {
  @service
  router;

  @action
  transitionBack() {
    this.router.transitionTo('authenticated.base.admin.game-sessions');
  }
}
