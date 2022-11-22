import Service from '@ember/service';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import {
  setAnalyticsCollectionEnabled,
  getAnalytics,
} from 'firebase/analytics';

const consentNamespace = '__cookie_consent';
const cookieNamespace = '__tepache';

setAnalyticsCollectionEnabled;
export default class CookieConsentService extends Service {
  @service
  cookies;

  @tracked
  interacted = false;

  @tracked
  granted = false;

  constructor() {
    super(...arguments);

    if (!this.cookies.exists(consentNamespace)) {
      setAnalyticsCollectionEnabled(getAnalytics(), false);
      this.cookies.clear(cookieNamespace);
    } else {
      this.granted = this.cookies.read(consentNamespace) === 'true';
    }
  }

  get exists() {
    return this.interacted || this.cookies.exists(consentNamespace);
  }

  get permissionGranted() {
    return this.granted || this.cookies.read(consentNamespace) === 'true';
  }

  accept() {
    this.granted = true;
    this.interacted = true;
    const now = new Date();
    now.setFullYear(now.getFullYear() + 1);

    this.cookies.write(consentNamespace, true, {
      domain: '.tepachemode.com',
      expires: now,
      path: '/',
    });

    setAnalyticsCollectionEnabled(getAnalytics(), true);
  }

  reject() {
    this.granted = false;
    this.interacted = true;

    const now = new Date();
    now.setFullYear(now.getFullYear() + 1);

    this.cookies.write(consentNamespace, false, {
      domain: '.tepachemode.com',
      expires: now,
      path: '/',
    });
    this.cookies.clear(cookieNamespace);
    setAnalyticsCollectionEnabled(getAnalytics(), false);
  }
}
