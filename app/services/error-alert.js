import Service from '@ember/service';
import { set } from '@ember/object';

export default class ErrorAlertService extends Service {
  set(message = '') {
    set(this, 'message', message);
  }

  clear() {
    set(this, 'message', null);
  }
}
