import Service from '@ember/service';

export default class ErrorAlertService extends Service {
  #message;

  set(message = '') {
    this.#message = message;
  }

  clear() {
    this.#message = '';
  }

  get message() {
    return this.#message;
  }
}
