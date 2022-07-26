import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class BaseController extends Controller {
  @service
  session;

  @action
  invalidateSession() {
    this.session.invalidate();
  }
}
