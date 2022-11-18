import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class AuthenticatedBaseCookiePolicyController extends Controller {
  @service
  cookieConsent;

  @action
  acceptCookies() {
    this.cookieConsent.accept();
  }

  @action
  rejectCookies() {
    this.cookieConsent.reject();
  }
}
