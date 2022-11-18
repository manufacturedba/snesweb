import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class TepacheCookieConsentScreenComponent extends Component {
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
