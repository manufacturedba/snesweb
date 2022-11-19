import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { getAnalytics, logEvent } from 'firebase/analytics';

export default class AuthenticatedBaseCookiePolicyController extends Controller {
  @service
  cookieConsent;

  @action
  acceptCookies() {
    logEvent(getAnalytics(), 'accept_cookies');
    this.cookieConsent.accept();
  }

  @action
  rejectCookies() {
    logEvent(getAnalytics(), 'reject_cookies');
    this.cookieConsent.reject();
  }
}
