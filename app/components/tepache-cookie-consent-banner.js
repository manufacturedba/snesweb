import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { getAnalytics, logEvent } from 'firebase/analytics';

export default class TepacheCookieConsentScreenComponent extends Component {
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
